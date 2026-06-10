using BookCatalogApi.Data;
using BookCatalogApi.Dtos;
using BookCatalogApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookCatalogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController : ControllerBase
{
    private const int MaxGenreNameLength = 50;

    private readonly AppDbContext _context;

    public GenresController(AppDbContext context)
    {
        _context = context;
    }

    // READ: GET api/genres
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var genres = await _context.Genres
            .Include(genre => genre.BookGenres)
            .ThenInclude(bookGenre => bookGenre.Book)
            .Select(genre => new
            {
                genre.Id,
                genre.Name,
                Books = genre.BookGenres.Select(bg => new
                {
                    bg.BookId,
                    bg.Book!.Title
                })
            })
            .ToListAsync();

        return Ok(genres);
    }

    // READ: GET api/genres/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var genre = await _context.Genres
            .Include(g => g.BookGenres)
            .ThenInclude(bg => bg.Book)
            .Where(g => g.Id == id)
            .Select(g => new
            {
                g.Id,
                g.Name,
                Books = g.BookGenres.Select(bg => new
                {
                    bg.BookId,
                    bg.Book!.Title
                })
            })
            .FirstOrDefaultAsync();

        if (genre == null)
        {
            return NotFound("Жанр не найден.");
        }

        return Ok(genre);
    }

    // CREATE: POST api/genres
    [HttpPost]
    public async Task<IActionResult> Create(GenreCreateDto dto)
    {
        var name = (dto.Name ?? string.Empty).Trim();
        var validationError = Validate(name);
        if (validationError != null) return BadRequest(validationError);

        var duplicateExists = await _context.Genres
            .AnyAsync(genre => genre.Name.ToLower() == name.ToLower());

        if (duplicateExists)
        {
            return BadRequest("Такой жанр уже есть в базе.");
        }

        var genre = new Genre
        {
            Name = name
        };

        _context.Genres.Add(genre);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = genre.Id }, new
        {
            genre.Id,
            genre.Name
        });
    }

    // UPDATE: PUT api/genres/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, GenreUpdateDto dto)
    {
        var name = (dto.Name ?? string.Empty).Trim();
        var validationError = Validate(name);
        if (validationError != null) return BadRequest(validationError);

        var genre = await _context.Genres.FindAsync(id);

        if (genre == null)
        {
            return NotFound("Жанр не найден.");
        }

        var duplicateExists = await _context.Genres
            .AnyAsync(other => other.Id != id && other.Name.ToLower() == name.ToLower());

        if (duplicateExists)
        {
            return BadRequest("Такой жанр уже есть в базе.");
        }

        genre.Name = name;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: DELETE api/genres/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var genre = await _context.Genres.FindAsync(id);

        if (genre == null)
        {
            return NotFound("Жанр не найден.");
        }

        _context.Genres.Remove(genre);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static string? Validate(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return "Название жанра не может быть пустым.";
        }

        if (name.Length > MaxGenreNameLength)
        {
            return $"Название жанра не должно быть длиннее {MaxGenreNameLength} символов.";
        }

        return null;
    }
}

using BookCatalogApi.Data;
using BookCatalogApi.Dtos;
using BookCatalogApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookCatalogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private const int MaxFullNameLength = 80;
    private const int MaxCountryLength = 60;

    private readonly AppDbContext _context;

    public AuthorsController(AppDbContext context)
    {
        _context = context;
    }

    // READ: GET api/authors
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var authors = await _context.Authors
            .Include(author => author.Books)
            .Select(author => new
            {
                author.Id,
                author.FullName,
                author.Country,
                Books = author.Books.Select(book => new
                {
                    book.Id,
                    book.Title,
                    book.Year
                })
            })
            .ToListAsync();

        return Ok(authors);
    }

    // READ: GET api/authors/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var author = await _context.Authors
            .Include(a => a.Books)
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.FullName,
                a.Country,
                Books = a.Books.Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Year
                })
            })
            .FirstOrDefaultAsync();

        if (author == null)
        {
            return NotFound("Автор не найден.");
        }

        return Ok(author);
    }

    // CREATE: POST api/authors
    [HttpPost]
    public async Task<IActionResult> Create(AuthorCreateDto dto)
    {
        var normalized = Normalize(dto.FullName, dto.Country);
        var validationError = Validate(normalized.FullName, normalized.Country);
        if (validationError != null) return BadRequest(validationError);

        var duplicateExists = await _context.Authors.AnyAsync(author =>
            author.FullName.ToLower() == normalized.FullName.ToLower() &&
            (author.Country ?? "").ToLower() == (normalized.Country ?? "").ToLower());

        if (duplicateExists)
        {
            return BadRequest("Такой автор уже есть в базе.");
        }

        var author = new Author
        {
            FullName = normalized.FullName,
            Country = normalized.Country
        };

        _context.Authors.Add(author);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = author.Id }, new
        {
            author.Id,
            author.FullName,
            author.Country
        });
    }

    // UPDATE: PUT api/authors/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AuthorUpdateDto dto)
    {
        var normalized = Normalize(dto.FullName, dto.Country);
        var validationError = Validate(normalized.FullName, normalized.Country);
        if (validationError != null) return BadRequest(validationError);

        var author = await _context.Authors.FindAsync(id);

        if (author == null)
        {
            return NotFound("Автор не найден.");
        }

        var duplicateExists = await _context.Authors.AnyAsync(other =>
            other.Id != id &&
            other.FullName.ToLower() == normalized.FullName.ToLower() &&
            (other.Country ?? "").ToLower() == (normalized.Country ?? "").ToLower());

        if (duplicateExists)
        {
            return BadRequest("Такой автор уже есть в базе.");
        }

        author.FullName = normalized.FullName;
        author.Country = normalized.Country;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: DELETE api/authors/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var author = await _context.Authors.FindAsync(id);

        if (author == null)
        {
            return NotFound("Автор не найден.");
        }

        _context.Authors.Remove(author);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static (string FullName, string? Country) Normalize(string fullName, string? country)
    {
        var normalizedName = (fullName ?? string.Empty).Trim();
        var normalizedCountry = string.IsNullOrWhiteSpace(country) ? null : country.Trim();
        return (normalizedName, normalizedCountry);
    }

    private static string? Validate(string fullName, string? country)
    {
        if (string.IsNullOrWhiteSpace(fullName))
        {
            return "ФИО автора не может быть пустым.";
        }

        if (fullName.Length > MaxFullNameLength)
        {
            return $"ФИО автора не должно быть длиннее {MaxFullNameLength} символов.";
        }

        if (country != null && country.Length > MaxCountryLength)
        {
            return $"Название страны не должно быть длиннее {MaxCountryLength} символов.";
        }

        return null;
    }
}

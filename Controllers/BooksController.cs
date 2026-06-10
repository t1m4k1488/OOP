using BookCatalogApi.Data;
using BookCatalogApi.Dtos;
using BookCatalogApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookCatalogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private const int MinBookYear = 1400;
    private const int MaxBookTitleLength = 80;

    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    // READ: GET api/books
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _context.Books
            .Include(book => book.Author)
            .Include(book => book.BookGenres)
            .ThenInclude(bookGenre => bookGenre.Genre)
            .Select(book => new
            {
                book.Id,
                book.Title,
                book.Year,
                Author = new
                {
                    book.AuthorId,
                    book.Author!.FullName
                },
                Genres = book.BookGenres.Select(bg => new
                {
                    bg.GenreId,
                    bg.Genre!.Name
                })
            })
            .ToListAsync();

        return Ok(books);
    }

    // READ: GET api/books/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await _context.Books
            .Include(b => b.Author)
            .Include(b => b.BookGenres)
            .ThenInclude(bg => bg.Genre)
            .Where(b => b.Id == id)
            .Select(b => new
            {
                b.Id,
                b.Title,
                b.Year,
                Author = new
                {
                    b.AuthorId,
                    b.Author!.FullName
                },
                Genres = b.BookGenres.Select(bg => new
                {
                    bg.GenreId,
                    bg.Genre!.Name
                })
            })
            .FirstOrDefaultAsync();

        if (book == null)
        {
            return NotFound("Книга не найдена.");
        }

        return Ok(book);
    }

    // CREATE: POST api/books
    [HttpPost]
    public async Task<IActionResult> Create(BookCreateDto dto)
    {
        var genreIds = dto.GenreIds ?? new List<int>();
        var normalized = Normalize(dto.Title, dto.Year);
        var validationError = Validate(normalized.Title, dto.AuthorId, genreIds);
        if (validationError != null) return BadRequest(validationError);

        var authorExists = await _context.Authors.AnyAsync(author => author.Id == dto.AuthorId);

        if (!authorExists)
        {
            return BadRequest("Нельзя создать книгу: указанный автор не найден.");
        }

        var duplicateExists = await _context.Books.AnyAsync(book =>
            book.Title.ToLower() == normalized.Title.ToLower() &&
            book.AuthorId == dto.AuthorId);

        if (duplicateExists)
        {
            return BadRequest("Такая книга уже есть у выбранного автора.");
        }

        var distinctGenreIds = genreIds.Distinct().ToList();
        var existingGenreIds = await _context.Genres
            .Where(genre => distinctGenreIds.Contains(genre.Id))
            .Select(genre => genre.Id)
            .ToListAsync();

        if (existingGenreIds.Count != distinctGenreIds.Count)
        {
            return BadRequest("Нельзя создать книгу: один или несколько жанров не найдены.");
        }

        var book = new Book
        {
            Title = normalized.Title,
            Year = normalized.Year,
            AuthorId = dto.AuthorId,
            BookGenres = existingGenreIds.Select(genreId => new BookGenre
            {
                GenreId = genreId
            }).ToList()
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = book.Id }, new
        {
            book.Id,
            book.Title,
            book.Year,
            book.AuthorId,
            GenreIds = existingGenreIds
        });
    }

    // UPDATE: PUT api/books/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BookUpdateDto dto)
    {
        var genreIds = dto.GenreIds ?? new List<int>();
        var normalized = Normalize(dto.Title, dto.Year);
        var validationError = Validate(normalized.Title, dto.AuthorId, genreIds);
        if (validationError != null) return BadRequest(validationError);

        var book = await _context.Books
            .Include(b => b.BookGenres)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
        {
            return NotFound("Книга не найдена.");
        }

        var authorExists = await _context.Authors.AnyAsync(author => author.Id == dto.AuthorId);

        if (!authorExists)
        {
            return BadRequest("Нельзя обновить книгу: указанный автор не найден.");
        }

        var duplicateExists = await _context.Books.AnyAsync(other =>
            other.Id != id &&
            other.Title.ToLower() == normalized.Title.ToLower() &&
            other.AuthorId == dto.AuthorId);

        if (duplicateExists)
        {
            return BadRequest("Такая книга уже есть у выбранного автора.");
        }

        var distinctGenreIds = genreIds.Distinct().ToList();
        var existingGenreIds = await _context.Genres
            .Where(genre => distinctGenreIds.Contains(genre.Id))
            .Select(genre => genre.Id)
            .ToListAsync();

        if (existingGenreIds.Count != distinctGenreIds.Count)
        {
            return BadRequest("Нельзя обновить книгу: один или несколько жанров не найдены.");
        }

        book.Title = normalized.Title;
        book.Year = normalized.Year;
        book.AuthorId = dto.AuthorId;

        var currentGenreIds = book.BookGenres.Select(bg => bg.GenreId).ToList();

        var relationsToRemove = book.BookGenres
            .Where(bg => !existingGenreIds.Contains(bg.GenreId))
            .ToList();

        var relationsToAdd = existingGenreIds
            .Where(genreId => !currentGenreIds.Contains(genreId))
            .Select(genreId => new BookGenre
            {
                BookId = book.Id,
                GenreId = genreId
            })
            .ToList();

        _context.BookGenres.RemoveRange(relationsToRemove);
        _context.BookGenres.AddRange(relationsToAdd);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: DELETE api/books/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound("Книга не найдена.");
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Добавление связи многие-ко-многим: POST api/books/1/genres/2
    [HttpPost("{bookId:int}/genres/{genreId:int}")]
    public async Task<IActionResult> AddGenreToBook(int bookId, int genreId)
    {
        var bookExists = await _context.Books.AnyAsync(book => book.Id == bookId);
        var genreExists = await _context.Genres.AnyAsync(genre => genre.Id == genreId);

        if (!bookExists || !genreExists)
        {
            return NotFound("Книга или жанр не найдены.");
        }

        var relationExists = await _context.BookGenres
            .AnyAsync(bg => bg.BookId == bookId && bg.GenreId == genreId);

        if (relationExists)
        {
            return BadRequest("Такая связь книги и жанра уже существует.");
        }

        _context.BookGenres.Add(new BookGenre
        {
            BookId = bookId,
            GenreId = genreId
        });

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Удаление связи многие-ко-многим: DELETE api/books/1/genres/2
    [HttpDelete("{bookId:int}/genres/{genreId:int}")]
    public async Task<IActionResult> RemoveGenreFromBook(int bookId, int genreId)
    {
        var relation = await _context.BookGenres
            .FirstOrDefaultAsync(bg => bg.BookId == bookId && bg.GenreId == genreId);

        if (relation == null)
        {
            return NotFound("Связь книги и жанра не найдена.");
        }

        _context.BookGenres.Remove(relation);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static int MaxBookYear => DateTime.Now.Year;

    private static (string Title, int Year) Normalize(string title, int year)
    {
        var normalizedTitle = (title ?? string.Empty).Trim();
        var normalizedYear = Math.Clamp(year, MinBookYear, MaxBookYear);
        return (normalizedTitle, normalizedYear);
    }

    private static string? Validate(string title, int authorId, List<int> genreIds)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return "Название книги не может быть пустым.";
        }

        if (title.Length > MaxBookTitleLength)
        {
            return $"Название книги не должно быть длиннее {MaxBookTitleLength} символов.";
        }

        if (authorId <= 0)
        {
            return "Нужно выбрать существующего автора.";
        }

        if (genreIds.Any(genreId => genreId <= 0))
        {
            return "ID жанра должен быть положительным целым числом.";
        }

        return null;
    }
}

using BookCatalogApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookCatalogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly AppDbContext _context;

    public DatabaseController(AppDbContext context)
    {
        _context = context;
    }

    // READ: GET api/database/tables
    // Метод нужен для удобного просмотра всех таблиц БД в веб-интерфейсе.
    [HttpGet("tables")]
    public async Task<IActionResult> GetTables()
    {
        var authors = await _context.Authors
            .Select(author => new
            {
                author.Id,
                author.FullName,
                author.Country
            })
            .ToListAsync();

        var books = await _context.Books
            .Include(book => book.Author)
            .Select(book => new
            {
                book.Id,
                book.Title,
                book.Year,
                book.AuthorId,
                AuthorName = book.Author == null ? null : book.Author.FullName
            })
            .ToListAsync();

        var genres = await _context.Genres
            .Select(genre => new
            {
                genre.Id,
                genre.Name
            })
            .ToListAsync();

        var bookGenres = await _context.BookGenres
            .Include(bookGenre => bookGenre.Book)
            .Include(bookGenre => bookGenre.Genre)
            .Select(bookGenre => new
            {
                bookGenre.BookId,
                BookTitle = bookGenre.Book == null ? null : bookGenre.Book.Title,
                bookGenre.GenreId,
                GenreName = bookGenre.Genre == null ? null : bookGenre.Genre.Name
            })
            .ToListAsync();

        return Ok(new
        {
            Stats = new
            {
                Authors = authors.Count,
                Books = books.Count,
                Genres = genres.Count,
                BookGenres = bookGenres.Count
            },
            Authors = authors,
            Books = books,
            Genres = genres,
            BookGenres = bookGenres
        });
    }
}

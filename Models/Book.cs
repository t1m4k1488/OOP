namespace BookCatalogApi.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Year { get; set; }

    // Связь многие-к-одному: много книг относятся к одному автору.
    public int AuthorId { get; set; }
    public Author? Author { get; set; }

    // Связь многие-ко-многим с жанрами через промежуточную таблицу BookGenres.
    public List<BookGenre> BookGenres { get; set; } = new();
}

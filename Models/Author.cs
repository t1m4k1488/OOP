namespace BookCatalogApi.Models;

public class Author
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Country { get; set; }

    // Один автор может иметь много книг.
    public List<Book> Books { get; set; } = new();
}

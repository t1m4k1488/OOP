namespace BookCatalogApi.Models;

public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Один жанр может относиться ко многим книгам.
    public List<BookGenre> BookGenres { get; set; } = new();
}

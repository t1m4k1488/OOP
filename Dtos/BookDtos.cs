namespace BookCatalogApi.Dtos;

public class BookCreateDto
{
    public string Title { get; set; } = string.Empty;
    public int Year { get; set; }
    public int AuthorId { get; set; }
    public List<int> GenreIds { get; set; } = new();
}

public class BookUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public int Year { get; set; }
    public int AuthorId { get; set; }
    public List<int> GenreIds { get; set; } = new();
}

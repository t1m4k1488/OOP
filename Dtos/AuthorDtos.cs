namespace BookCatalogApi.Dtos;

public class AuthorCreateDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Country { get; set; }
}

public class AuthorUpdateDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Country { get; set; }
}

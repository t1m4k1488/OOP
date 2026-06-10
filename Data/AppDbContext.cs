using BookCatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookCatalogApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Author> Authors => Set<Author>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<BookGenre> BookGenres => Set<BookGenre>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Author>()
            .Property(author => author.FullName)
            .HasMaxLength(80);

        modelBuilder.Entity<Author>()
            .Property(author => author.Country)
            .HasMaxLength(60);

        modelBuilder.Entity<Book>()
            .Property(book => book.Title)
            .HasMaxLength(80);

        modelBuilder.Entity<Genre>()
            .Property(genre => genre.Name)
            .HasMaxLength(50);

        modelBuilder.Entity<Author>()
            .HasMany(author => author.Books)
            .WithOne(book => book.Author)
            .HasForeignKey(book => book.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BookGenre>()
            .HasKey(bookGenre => new { bookGenre.BookId, bookGenre.GenreId });

        modelBuilder.Entity<BookGenre>()
            .HasOne(bookGenre => bookGenre.Book)
            .WithMany(book => book.BookGenres)
            .HasForeignKey(bookGenre => bookGenre.BookId);

        modelBuilder.Entity<BookGenre>()
            .HasOne(bookGenre => bookGenre.Genre)
            .WithMany(genre => genre.BookGenres)
            .HasForeignKey(bookGenre => bookGenre.GenreId);

        modelBuilder.Entity<Author>().HasData(
            new Author { Id = 1, FullName = "Федор Достоевский", Country = "Россия" },
            new Author { Id = 2, FullName = "Джордж Оруэлл", Country = "Великобритания" }
        );

        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "Преступление и наказание", Year = 1866, AuthorId = 1 },
            new Book { Id = 2, Title = "1984", Year = 1949, AuthorId = 2 }
        );

        modelBuilder.Entity<Genre>().HasData(
            new Genre { Id = 1, Name = "Роман" },
            new Genre { Id = 2, Name = "Антиутопия" },
            new Genre { Id = 3, Name = "Классика" }
        );

        modelBuilder.Entity<BookGenre>().HasData(
            new BookGenre { BookId = 1, GenreId = 1 },
            new BookGenre { BookId = 1, GenreId = 3 },
            new BookGenre { BookId = 2, GenreId = 2 },
            new BookGenre { BookId = 2, GenreId = 3 }
        );
    }
}

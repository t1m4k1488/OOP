using BookCatalogApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Защита от циклических ссылок при сериализации связанных сущностей EF Core.
        // Основной вывод всё равно делается через DTO/анонимные объекты, но эта настройка
        // не даст приложению упасть, если где-то случайно вернётся связанная сущность.
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Создаем реальную SQLite-базу book_catalog.db при первом запуске.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Включаем главную веб-страницу из папки wwwroot.
app.UseDefaultFiles();
app.UseStaticFiles();

// Swagger теперь работает всегда, а не только в режиме Development.
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

// Если открыть неизвестный адрес не из /api, пользователь попадет обратно на интерфейс.
app.MapFallbackToFile("index.html");

app.Run();

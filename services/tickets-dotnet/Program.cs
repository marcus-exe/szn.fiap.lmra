using Microsoft.EntityFrameworkCore;
using TicketsService.Data;
using TicketsService.Endpoints;
using TicketsService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? builder.Configuration["ConnectionStrings:DefaultConnection"]
    ?? throw new InvalidOperationException("Connection string not found");

builder.Services.AddDbContext<TicketsDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
        npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3)));

// Services
builder.Services.AddScoped<ITicketService, TicketService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure database is created
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<TicketsDbContext>();
        var canConnect = dbContext.Database.CanConnect();
        Console.WriteLine($"Database can connect: {canConnect}");
        
        if (!canConnect)
        {
            Console.WriteLine("Creating database...");
            dbContext.Database.EnsureCreated();
        }
        
        var ticketsExist = dbContext.Database.ExecuteSqlRaw("SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets'").ToString();
        Console.WriteLine($"Tickets table check: {ticketsExist}");
        
        dbContext.Database.EnsureCreated();
        Console.WriteLine("Database initialized successfully");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error initializing database: {ex}");
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// Map endpoints
app.MapTicketEndpoints();
app.MapHealthCheck();

app.Run();


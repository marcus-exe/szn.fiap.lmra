namespace TicketsService.Endpoints;

public static class HealthEndpoints
{
    public static void MapHealthCheck(this WebApplication app)
    {
        app.MapGet("/health", () =>
        {
            return Results.Ok(new
            {
                status = "UP",
                service = "tickets-service"
            });
        }).WithTags("Health");
    }
}


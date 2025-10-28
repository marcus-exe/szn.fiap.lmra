using TicketsService.Models;
using TicketsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace TicketsService.Endpoints;

public static class TicketEndpoints
{
    public static void MapTicketEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tickets").WithTags("Tickets");

        // GET all tickets
        group.MapGet("/", async (ITicketService ticketService) =>
        {
            var tickets = await ticketService.GetAllTicketsAsync();
            return Results.Ok(tickets);
        });

        // GET ticket by ID
        group.MapGet("/{id}", async (int id, ITicketService ticketService) =>
        {
            var ticket = await ticketService.GetTicketByIdAsync(id);
            return ticket == null ? Results.NotFound() : Results.Ok(ticket);
        });

        // POST create ticket
        group.MapPost("/", async (CreateTicketRequest request, ITicketService ticketService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                return Results.BadRequest("Title is required");

            var ticket = await ticketService.CreateTicketAsync(request);
            return Results.Created($"/api/tickets/{ticket.Id}", ticket);
        });

        // PUT update ticket
        group.MapPut("/{id}", async (int id, UpdateTicketRequest request, ITicketService ticketService) =>
        {
            var ticket = await ticketService.UpdateTicketAsync(id, request);
            return ticket == null ? Results.NotFound() : Results.Ok(ticket);
        });

        // DELETE ticket
        group.MapDelete("/{id}", async (int id, ITicketService ticketService) =>
        {
            var deleted = await ticketService.DeleteTicketAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        // POST add comment
        group.MapPost("/{id}/comments", async (int id, CreateCommentRequest request, ITicketService ticketService) =>
        {
            if (id != request.TicketId)
                return Results.BadRequest("Ticket ID mismatch");

            var comment = await ticketService.AddCommentAsync(request);
            return Results.Created($"/api/tickets/{id}/comments/{comment.Id}", comment);
        });

        // GET comments for ticket
        group.MapGet("/{id}/comments", async (int id, ITicketService ticketService) =>
        {
            var comments = await ticketService.GetTicketCommentsAsync(id);
            return Results.Ok(comments);
        });
    }
}


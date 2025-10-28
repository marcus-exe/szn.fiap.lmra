using TicketsService.Models;
using TicketsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace TicketsService.Endpoints;

public static class TicketEndpoints
{
    public static void MapTicketEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tickets").WithTags("Tickets");

        // GET all tickets with optional filters
        group.MapGet("/", async (
            ITicketService ticketService,
            TicketStatus? status = null,
            TicketPriority? priority = null,
            long? assignedTo = null,
            string? search = null) =>
        {
            var tickets = await ticketService.GetAllTicketsAsync();
            
            // Apply filters
            var filteredTickets = tickets.AsEnumerable();
            
            if (status.HasValue)
                filteredTickets = filteredTickets.Where(t => t.Status == status.Value);
            
            if (priority.HasValue)
                filteredTickets = filteredTickets.Where(t => t.Priority == priority.Value);
            
            if (assignedTo.HasValue)
                filteredTickets = filteredTickets.Where(t => t.AssignedToUserId == assignedTo.Value);
            
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLowerInvariant();
                filteredTickets = filteredTickets.Where(t => 
                    t.Title.ToLowerInvariant().Contains(searchLower) ||
                    t.Description.ToLowerInvariant().Contains(searchLower));
            }
            
            return Results.Ok(filteredTickets.ToList());
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

        // GET tickets by status
        group.MapGet("/status/{status}", async (TicketStatus status, ITicketService ticketService) =>
        {
            var tickets = await ticketService.GetAllTicketsAsync();
            var filteredTickets = tickets.Where(t => t.Status == status).ToList();
            return Results.Ok(filteredTickets);
        });

        // GET tickets by assigned user
        group.MapGet("/assigned/{userId}", async (long userId, ITicketService ticketService) =>
        {
            var tickets = await ticketService.GetAllTicketsAsync();
            var filteredTickets = tickets.Where(t => t.AssignedToUserId == userId).ToList();
            return Results.Ok(filteredTickets);
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

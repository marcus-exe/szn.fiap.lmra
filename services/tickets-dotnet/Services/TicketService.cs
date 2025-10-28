using Microsoft.EntityFrameworkCore;
using TicketsService.Data;
using TicketsService.Models;

namespace TicketsService.Services;

public interface ITicketService
{
    Task<TicketDto> CreateTicketAsync(CreateTicketRequest request);
    Task<TicketDto?> GetTicketByIdAsync(int id);
    Task<List<TicketDto>> GetAllTicketsAsync();
    Task<TicketDto?> UpdateTicketAsync(int id, UpdateTicketRequest request);
    Task<bool> DeleteTicketAsync(int id);
    Task<CommentDto> AddCommentAsync(CreateCommentRequest request);
    Task<List<CommentDto>> GetTicketCommentsAsync(int ticketId);
}

public class TicketService : ITicketService
{
    private readonly TicketsDbContext _context;

    public TicketService(TicketsDbContext context)
    {
        _context = context;
    }

    public async Task<TicketDto> CreateTicketAsync(CreateTicketRequest request)
    {
        var ticket = new Ticket
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            CreatedByUserId = request.CreatedByUserId,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return MapToDto(ticket);
    }

    public async Task<TicketDto?> GetTicketByIdAsync(int id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Comments)
            .FirstOrDefaultAsync(t => t.Id == id);

        return ticket == null ? null : MapToDto(ticket);
    }

    public async Task<List<TicketDto>> GetAllTicketsAsync()
    {
        var tickets = await _context.Tickets
            .Include(t => t.Comments)
            .ToListAsync();

        return tickets.Select(MapToDto).ToList();
    }

    public async Task<TicketDto?> UpdateTicketAsync(int id, UpdateTicketRequest request)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return null;

        if (request.Title != null)
            ticket.Title = request.Title;
        if (request.Description != null)
            ticket.Description = request.Description;
        if (request.Status.HasValue)
        {
            ticket.Status = request.Status.Value;
            if (request.Status.Value == TicketStatus.Closed || request.Status.Value == TicketStatus.Cancelled)
                ticket.ClosedAt = DateTime.UtcNow;
        }
        if (request.Priority.HasValue)
            ticket.Priority = request.Priority.Value;
        if (request.AssignedToUserId.HasValue)
            ticket.AssignedToUserId = request.AssignedToUserId;

        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(ticket);
    }

    public async Task<bool> DeleteTicketAsync(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return false;

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<CommentDto> AddCommentAsync(CreateCommentRequest request)
    {
        var comment = new Comment
        {
            TicketId = request.TicketId,
            UserId = request.UserId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return new CommentDto(comment.Id, comment.TicketId, comment.UserId, comment.Content, comment.CreatedAt);
    }

    public async Task<List<CommentDto>> GetTicketCommentsAsync(int ticketId)
    {
        var comments = await _context.Comments
            .Where(c => c.TicketId == ticketId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();

        return comments.Select(c => new CommentDto(c.Id, c.TicketId, c.UserId, c.Content, c.CreatedAt)).ToList();
    }

    private static TicketDto MapToDto(Ticket ticket)
    {
        return new TicketDto(
            ticket.Id,
            ticket.Title,
            ticket.Description,
            ticket.Status,
            ticket.Priority,
            ticket.CreatedByUserId,
            ticket.AssignedToUserId,
            ticket.CreatedAt,
            ticket.UpdatedAt,
            ticket.ClosedAt,
            ticket.Comments?.Select(c => new CommentDto(c.Id, c.TicketId, c.UserId, c.Content, c.CreatedAt)).ToList() ?? new List<CommentDto>()
        );
    }
}


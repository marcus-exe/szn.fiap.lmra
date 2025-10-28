using Microsoft.EntityFrameworkCore;
using TicketsService.Models;

namespace TicketsService.Data;

public class TicketsDbContext : DbContext
{
    public TicketsDbContext(DbContextOptions<TicketsDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.ToTable("tickets");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(5000);
            entity.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.Priority).HasColumnName("priority").HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.CreatedByUserId).HasColumnName("createdbyuserid");
            entity.Property(e => e.AssignedToUserId).HasColumnName("assignedtouserid");
            entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            entity.Property(e => e.UpdatedAt).HasColumnName("updatedat");
            entity.Property(e => e.ClosedAt).HasColumnName("closedat");
            entity.HasMany(e => e.Comments)
                  .WithOne(c => c.Ticket)
                  .HasForeignKey(c => c.TicketId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.ToTable("comments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content").HasMaxLength(2000).IsRequired();
            entity.Property(e => e.TicketId).HasColumnName("ticketid");
            entity.Property(e => e.UserId).HasColumnName("userid");
            entity.Property(e => e.CreatedAt).HasColumnName("createdat");
        });
    }
}

using Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Core.Context;
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Department> Departments { get; set; }

    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }
}
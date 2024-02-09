using Microsoft.AspNetCore.Identity;

namespace Core.Entities;
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public IList<string> Roles { get; set; }

    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
}
using System.Security.Claims;
using Core.DTOs;
using Core.Entities;

namespace Core.Interfaces;

public interface IUserService
{
    Task<ServiceResponse<ApplicationUser>> Get(string id);
    Task<ServiceResponse<List<ApplicationUser>>> GetAll();
    Task<ServiceResponse<List<ApplicationUser>>> GetDepartmentUsers(Guid departmentId);
    Task<ServiceResponse<ApplicationUser>> Create(ApplicationUser user);
    Task<ServiceResponse<ApplicationUser>> Update(ApplicationUser user, ClaimsPrincipal currentUser);
    Task<ServiceResponse<string>> Delete(Guid id);
}
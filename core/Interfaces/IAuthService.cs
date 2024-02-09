using Core.DTOs;

namespace Core.Interfaces;

public interface IAuthService
{
    Task<ServiceResponse<int>> Register(RegisterRequest request);
    Task<LoginResponse> Login(LoginRequest request);
    Task<ServiceResponse<List<string>>> SeedRoles();
    Task<ServiceResponse<string>> AssignRole(AssignRoleRequest request);
}
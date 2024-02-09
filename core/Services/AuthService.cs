using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Versioning;
using System.Security.Claims;
using System.Text;
using Core.Context;
using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Core.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthService(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _configuration = configuration;
        _roleManager = roleManager;
    }

    /// <summary>
    /// Seed Roles
    /// </summary>
    /// <returns></returns>
    public async Task<ServiceResponse<List<string>>> SeedRoles()
    {
        bool isAdminRoleExists = await _roleManager.RoleExistsAsync("Admin");
        bool isUserRoleExists = await _roleManager.RoleExistsAsync("User");

        if (isAdminRoleExists && isUserRoleExists)
            return new ServiceResponse<List<string>>()
            {
                Success = false,
                Data = ["Admin", "User"],
                Message = "Roles Seeding is Already Done"
            };

        await _roleManager.CreateAsync(new IdentityRole("Admin"));
        await _roleManager.CreateAsync(new IdentityRole("User"));

        return new ServiceResponse<List<string>>()
        {
            Success = true,
            Data = ["Admin", "User"],
            Message = "Roles Seeding Done Successfully"
        };
    }

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        // Find user with username
        var user = await _userManager.FindByNameAsync(request.Email);
        if (user is null)
        {
            return new LoginResponse(null, null, false, "User Not Found");
        }

        // check password of user
        var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordCorrect)
        {
            return new LoginResponse(null, null, false, "Invalid Password");
        }

        // Return Token and userInfo to front-end
        var newToken = await GenerateJwtTokenAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        var userInfo = GenerateUserInfoObject(user, roles);

        return new LoginResponse(newToken, userInfo, true, "Login Success");

    }

    public async Task<ServiceResponse<int>> Register(RegisterRequest request)
    {
        var isExistsUser = await _userManager.FindByNameAsync(request.Email);
        if (isExistsUser is not null)
            return new ServiceResponse<int>()
            {
                Success = false,
                Data = 409,
                Message = "UserName Already Exists"
            };

        ApplicationUser newUser = new()
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email,
            Roles = ["User"],
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var createUserResult = await _userManager.CreateAsync(newUser, request.Password);

        if (!createUserResult.Succeeded)
        {
            var errorString = "User Creation failed because: ";
            foreach (var error in createUserResult.Errors)
            {
                errorString += " # " + error.Description;
            }
            return new ServiceResponse<int>()
            {
                Success = false,
                Data = 400,
                Message = errorString
            };
        }

        // Add a Default USER Role to all users
        await _userManager.AddToRoleAsync(newUser, "User");

        return new ServiceResponse<int>()
        {
            Success = true,
            Data = 201,
            Message = "User Created Successfully"
        };
    }


    public async Task<ServiceResponse<string>> AssignRole(AssignRoleRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.Email);
        if (user is null)
            return new ServiceResponse<string>()
            {
                Success = false,
                Data = "User Not Found",
                Message = "User Not Found"
            };

        var isRoleExists = await _roleManager.RoleExistsAsync(request.Role);
        if (!isRoleExists)
            return new ServiceResponse<string>()
            {
                Success = false,
                Data = "Role Not Found",
                Message = "Role Not Found"
            };

        var isUserAlreadyInRole = await _userManager.IsInRoleAsync(user, request.Role);
        if (isUserAlreadyInRole)
            return new ServiceResponse<string>()
            {
                Success = false,
                Data = "User Already in Role",
                Message = "User Already in Role"
            };

        var result = await _userManager.AddToRoleAsync(user, request.Role);
        if (!result.Succeeded)
            return new ServiceResponse<string>()
            {
                Success = false,
                Data = "Role Assignment Failed",
                Message = "Role Assignment Failed"
            };

        user.Roles.Add(request.Role);
        _context.Update(user);
        await _context.SaveChangesAsync();

        return new ServiceResponse<string>()
        {
            Success = true,
            Data = "Role Assigned Successfully",
            Message = "Role Assigned Successfully"
        };
    }


    /// <summary>
    /// Generate Jwt token
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    private async Task<string> GenerateJwtTokenAsync(ApplicationUser user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);

        var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Email),
                new(ClaimTypes.NameIdentifier, user.Id),
                new("FirstName", user.FirstName),
                new("LastName", user.LastName),
            };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var authSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var signingCredentials = new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256);

        var tokenObject = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            notBefore: DateTime.Now,
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: signingCredentials
            );

        string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);
        return token;
    }

    /// <summary>
    /// Generate UserInfo object
    /// </summary>
    /// <param name="user"></param>
    /// <param name="Roles"></param>
    /// <returns></returns>
    private UserInfoResult GenerateUserInfoObject(ApplicationUser user, IEnumerable<string> Roles)
    {
        return new UserInfoResult(user.Id,
             user.FirstName,
             user.LastName,
             user.Email,
             user.Email,
             Roles);
    }
}

using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IAuthService _authService;


    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IAuthService authService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _authService = authService;
    }

    /// <summary>
    /// Registers a user and assigns a role
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await _authService.Register(request);

        return Ok(response);
    }

    /// <summary>
    /// Logs in a user
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.Login(request);

        return Ok(response);
    }

    /// <summary>
    /// Seeds roles into the database
    /// </summary>
    /// <returns></returns>
    [HttpPost("seed-roles")]
    public async Task<IActionResult> SeedRoles()
    {
        var response = await _authService.SeedRoles();

        return Ok(response);
    }

    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
    {
        var response = await _authService.AssignRole(request);

        return Ok(response);
    }

    /// <summary>
    /// Assigns a role to a user, if there is no admin user, it creates one
    /// </summary>
    /// <param name="user"></param>
    /// <param name="password"></param>
    private void AssignRole(ApplicationUser user, string password)
    {
        var admin = _userManager.FindByEmailAsync("admin@admin.com");
        if (admin is null)
        {
            var newAdmin = new ApplicationUser
            {
                UserName = "admin@admin.com",
                Email = "admin@admin.com"
            };

            _userManager.CreateAsync(newAdmin, "admin");
            _userManager.AddToRoleAsync(newAdmin, "Admin");
        }
        else
        {
            _userManager.AddToRoleAsync(user, "User");
        }
    }
}
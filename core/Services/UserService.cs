using System.Security.Claims;
using Core.Context;
using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public UserService(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<ServiceResponse<ApplicationUser>> Create(ApplicationUser user)
    {
        try
        {
            var existingUser = await _userManager.FindByEmailAsync(user.Email);

            if (existingUser is not null)
            {
                return new ServiceResponse<ApplicationUser>
                {
                    Success = false,
                    Data = null,
                    Message = "User already exists"
                };
            }

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded)
            {
                return new ServiceResponse<ApplicationUser>
                {
                    Success = false,
                    Data = null,
                    Message = "User creation failed"
                };
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "User");

            if (!roleResult.Succeeded)
            {
                return new ServiceResponse<ApplicationUser>
                {
                    Success = false,
                    Data = null,
                    Message = "User role creation failed"
                };
            }

            // If the user is created successfully, we will create a return object
            var newUser = user;
            newUser.Roles = ["User"];

            await _context.SaveChangesAsync();

            return new ServiceResponse<ApplicationUser>
            {
                Success = true,
                Data = newUser,
                Message = "User created successfully"
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse<ApplicationUser>
            {
                Success = false,
                Data = null,
                Message = ex.Message
            };
        }

    }

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<ServiceResponse<string>> Delete(Guid id)
    {
        ServiceResponse<string> result = new();

        try
        {
            var user = _userManager.FindByIdAsync(id.ToString());

            if (user.Result is null)
            {
                result.Success = false;
                result.Data = null;
                result.Message = "User not found";

                return result;
            }

            var deleteResult = await _userManager.DeleteAsync(user.Result);

            if (!deleteResult.Succeeded)
            {
                result.Success = false;
                result.Data = null;
                result.Message = "User deletion failed";

                return result;
            }

            await _context.SaveChangesAsync();

            result.Success = true;
            result.Data = $"{user.Result.FirstName} {user.Result.LastName}";
            result.Message = "User deleted successfully";

            return result;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.Data = null;
            result.Message = ex.Message;

            return result;
        }
    }

    /// <summary>
    /// Get a user by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<ServiceResponse<ApplicationUser>> Get(string id)
    {
        ServiceResponse<ApplicationUser> result = new();

        try
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null)
            {
                result.Success = false;
                result.Data = null;
                result.Message = "User not found";

                return result;
            }

            result.Success = true;
            result.Data = user;
            result.Message = "User found";

            return result;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.Data = null;
            result.Message = ex.Message;

            return result;
        }
    }

    /// <summary>
    /// Get all users
    /// </summary>
    /// <returns></returns>
    public async Task<ServiceResponse<List<ApplicationUser>>> GetAll()
    {
        ServiceResponse<List<ApplicationUser>> result = new();

        try
        {
            var users = await _context.Users.ToListAsync();

            result.Success = users.Count != 0;
            result.Data = users;
            result.Message = users.Count != 0 ? $"{users.Count} users found" : "No users found";

            return result;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.Data = null;
            result.Message = ex.Message;

            return result;
        }
    }

    /// <summary>
    /// Get all users in a department
    /// </summary>
    /// <param name="departmentId"></param>
    /// <returns></returns>
    public async Task<ServiceResponse<List<ApplicationUser>>> GetDepartmentUsers(Guid departmentId)
    {
        ServiceResponse<List<ApplicationUser>> result = new();

        try
        {
            var users = await _context.Users.Where(u => u.DepartmentId == departmentId).ToListAsync();

            result.Success = users.Count != 0;
            result.Data = users;
            result.Message = users.Count != 0 ? $"{users.Count} users found" : "No users found";

            return result;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.Data = null;
            result.Message = ex.Message;

            return result;
        }
    }

    /// <summary>
    /// Update a user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<ServiceResponse<ApplicationUser>> Update(ApplicationUser user, ClaimsPrincipal currentUser)
    {
        ServiceResponse<ApplicationUser> result = new();

        var authorizationResult = await IsAuthorized(currentUser, user.Id);

        if (!authorizationResult.IsAuthorized)
        {
            result.Success = false;
            result.Data = null;
            result.Message = "You are not authorized to update this user";

            return result;
        }

        try
        {


            var existingUser = await _userManager.FindByIdAsync(user.Id);

            if (existingUser is null)
            {
                result.Success = false;
                result.Data = null;
                result.Message = "User not found";

                return result;
            }

            existingUser.UserName = user.UserName;
            existingUser.Email = user.Email;
            existingUser.DepartmentId = user.DepartmentId;

            if (existingUser.Roles != user.Roles)
            {
                foreach (var role in existingUser.Roles)
                {
                    await _userManager.RemoveFromRoleAsync(existingUser, role);
                }

                foreach (var role in user.Roles)
                {
                    await _userManager.AddToRoleAsync(existingUser, role);
                }
            }

            var updateResult = await _userManager.UpdateAsync(existingUser);

            if (!updateResult.Succeeded)
            {
                result.Success = false;
                result.Data = null;
                result.Message = "User update failed";

                return result;
            }

            result.Success = true;
            result.Data = existingUser;
            result.Message = "User updated successfully";

            await _context.SaveChangesAsync();

            return result;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.Data = null;
            result.Message = ex.Message;

            return result;
        }
    }

    /// <summary>
    /// Check if the current user is authorized to perform an action
    /// </summary>
    /// <param name="currentUser"></param>
    /// <param name="id"></param>
    /// <returns></returns>
    private async Task<AuthorizationResult> IsAuthorized(ClaimsPrincipal currentUser, string id)
    {
        try
        {
            var loggedInUser = await _userManager.GetUserAsync(currentUser);

            return new AuthorizationResult(loggedInUser?.Id == id || currentUser.IsInRole("Admin"), null);
        }
        catch (Exception ex)
        {
            return new AuthorizationResult(false, ex);
        }
    }
}
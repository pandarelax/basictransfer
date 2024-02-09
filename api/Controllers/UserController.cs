using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Route("{id}")]
    public async ValueTask<IActionResult> Get([FromRoute] string id)
    {
        var result = await _userService.Get(id);

        return Ok(result);
    }

    [HttpGet]
    public async ValueTask<IActionResult> GetAll()
    {
        var result = await _userService.GetAll();

        return Ok(result);
    }

    [HttpPut]
    public async ValueTask<IActionResult> Update([FromBody] ApplicationUser user)
    {
        var result = await _userService.Update(user, User);

        return Ok(result);
    }

    [HttpDelete]
    [Route("{id}")]
    [Authorize(Roles = "Admin")]
    public async ValueTask<IActionResult> Delete([FromRoute] Guid id)
    {
        var result = await _userService.Delete(id);

        return Ok(result);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    [HttpPost]
    public async ValueTask<IActionResult> Create([FromBody] ApplicationUser user)
    {
        var result = await _userService.Create(user);

        return Ok(result);
    }
}
using Core.Context;
using Core.DTOs;
using Core.Entities;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _departmentService;
    public DepartmentController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    public async ValueTask<IActionResult> GetAll()
    {
        var response = await _departmentService.GetAll();

        return Ok(response);
    }

    [HttpGet]
    [Route("{id}")]
    public async ValueTask<IActionResult> GetById([FromRoute] Guid id)
    {
        var response = await _departmentService.Get(id);

        return Ok(response);
    }

    [HttpPost]
    public async ValueTask<IActionResult> Create([FromBody] CreateDepartmentRequest request)
    {
        var response = await _departmentService.Create(request);

        return Ok(response);
    }

    [HttpDelete]
    [Route("{id}")]
    public async ValueTask<IActionResult> Delete([FromRoute] Guid id)
    {
        var response = await _departmentService.Delete(id);

        return Ok(response);
    }
}
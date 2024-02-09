using Core.Context;
using Core.DTOs;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class DepartmentService : IDepartmentService
{
    private readonly ApplicationDbContext _context;
    public DepartmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Create a new department
    /// </summary>
    /// <param name="department"></param>
    /// <returns></returns>
    public async Task<ServiceResponse<Department>> Create(CreateDepartmentRequest request)
    {
        ServiceResponse<Department> response = new();

        var newDepartment = new Department
        {
            Name = request.Name,
            CreatedAt = DateTime.Now,
        };

        try
        {
            var result = await _context.Departments.AddAsync(newDepartment);

            if (result.State is not EntityState.Added)
            {
                response.Success = false;
                response.Message = "Department creation failed";

                return response;
            }

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Data = result.Entity;
            response.Message = "Department created successfully";

            return response;
        }
        catch (DbUpdateException ex)
        {
            response.Success = false;
            response.Message = ex.Message;

            return response;
        }
    }

    public async Task<ServiceResponse<Department>> Delete(Guid id)
    {
        ServiceResponse<Department> response = new();

        try
        {
            var department = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id);

            if (department is null)
            {
                response.Success = false;
                response.Message = "Department not found";

                return response;
            }

            var removeResult = _context.Departments.Remove(department);
            if (removeResult.State is not EntityState.Deleted)
            {
                response.Success = false;
                response.Message = "Department deletion failed";

                return response;
            }
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Department deleted successfully";

            return response;
        }
        catch (DbUpdateException ex)
        {
            response.Success = false;
            response.Message = ex.Message;

            return response;
        }
    }

    public async Task<ServiceResponse<Department>> Get(Guid id)
    {
        ServiceResponse<Department> response = new();

        try
        {
            var department = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id);

            if (department is null)
            {
                response.Success = false;
                response.Message = "Department not found";

                return response;
            }

            response.Success = true;
            response.Data = department;
            response.Message = "Department found";

            return response;
        }
        catch (DbUpdateException ex)
        {
            response.Success = false;
            response.Message = ex.Message;

            return response;
        }
    }

    public async Task<ServiceResponse<List<Department>>> GetAll()
    {
        ServiceResponse<List<Department>> response = new();

        try
        {
            var departments = await _context.Departments.ToListAsync();

            if (departments.Count is 0)
            {
                response.Success = false;
                response.Message = "No departments found";

                return response;
            }

            response.Success = true;
            response.Data = departments;
            response.Message = "Departments found";

            return response;
        }
        catch (DbUpdateException ex)
        {
            response.Success = false;
            response.Message = ex.Message;

            return response;
        }
    }

    public async Task<ServiceResponse<Department>> Update(Guid id, Department department)
    {
        ServiceResponse<Department> response = new();

        try
        {
            var existingDepartment = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id);

            if (existingDepartment is null)
            {
                response.Success = false;
                response.Message = "Department not found";

                return response;
            }

            existingDepartment.Name = department.Name;

            var updateResult = _context.Departments.Update(existingDepartment);
            if (updateResult.State is not EntityState.Modified)
            {
                response.Success = false;
                response.Message = "Department update failed";

                return response;
            }
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Data = existingDepartment;
            response.Message = "Department updated successfully";

            return response;
        }
        catch (DbUpdateException ex)
        {
            response.Success = false;
            response.Message = ex.Message;

            return response;
        }
    }
}
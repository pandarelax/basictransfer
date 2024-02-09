using Core.DTOs;
using Core.Entities;

namespace Core.Services;

public interface IDepartmentService
{
    Task<ServiceResponse<Department>> Create(CreateDepartmentRequest request);
    Task<ServiceResponse<Department>> Get(Guid id);
    Task<ServiceResponse<List<Department>>> GetAll();
    Task<ServiceResponse<Department>> Update(Guid id, Department department);
    Task<ServiceResponse<Department>> Delete(Guid id);
}
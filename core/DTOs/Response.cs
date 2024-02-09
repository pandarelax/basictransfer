namespace Core.DTOs;

// Generate a response object which will have a success property and a data property and the data can be of any type
public class ServiceResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
}
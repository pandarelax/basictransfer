namespace Core.DTOs;

public record UserInfoResult(string Id, string FirstName, string LastName, string Email, string UserName, IEnumerable<string> Roles);


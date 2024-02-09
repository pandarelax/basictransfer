namespace Core.DTOs;
public record LoginResponse(string? NewToken, UserInfoResult? UserInfo, bool? Success, string? Message);
namespace Core.DTOs;

public record AuthorizationResult(bool IsAuthorized, Exception? Exception);
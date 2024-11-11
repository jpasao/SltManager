using System.Text.Json;

namespace stl.Utils;

public static class Response 
{
    public static IResult BuildResponse(dynamic items)
    {
        return Results.Json(items, new JsonSerializerOptions { PropertyNamingPolicy = null }, statusCode: 200);
    }
    public static IResult BuildError(Exception ex, int errorCode = 500)
    {
        var settings = new JsonSerializerOptions
        {
            Converters = { new JsonException() },
            WriteIndented = true
        };

        var str = JsonSerializer.Serialize(ex, options: settings);
        var exception = new Exception(str);
        return Results.Json(exception, statusCode: errorCode);
    }
}
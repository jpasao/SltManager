namespace stl.Utils;

public static class Response 
{
    public static IResult BuildResponse(dynamic items)
    {
        return Results.Json(items, statusCode: 200);
    }
    public static IResult BuildError(Exception ex, int errorCode = 500)
    {
        return Results.Json(ex, statusCode: errorCode);
    }
}
using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using stl.Code;
using stl.Interfaces;
using stl.Models;
using stl.Utils;

namespace stl.Repositories;

public class TagRepository : ITagRepository
{
    private readonly IDbConnection db;
    public string ConnectionString { get; set; }

    public TagRepository(IOptions<ConnectionString> connectionStrings)
    {
        db = new MySqlConnection(connectionStrings.Value.STLConnectionString);
    }

    public async Task<IResult> SearchTag(Tag tag)
    {
        try
        {
            var sql = @"SELECT IdTag, TagName 
                FROM tags 
                WHERE (@TagName = '' OR TagName LIKE CONCAT('%', @TagName, '%')) 
                ORDER BY TagName";
            var response = (await db.QueryAsync<Tag>(sql, tag).ConfigureAwait(false)).AsList();

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> SaveTag(Tag tag)
    {
        try
        {
            var sql = (tag.IdTag == 0) ? 
                "INSERT INTO tags (TagName) VALUES (@TagName)" : 
                "UPDATE tags SET TagName = @TagName WHERE IdTag = @IdTag";
            var response = await db.ExecuteAsync(sql, tag).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> DeleteTag(int id)
    {
        try
        {
            var sql = "DELETE FROM tags WHERE IdTag = @IdTag";
            var response = await db.ExecuteAsync(sql, new { IdTag = id }).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }        
    }

    public async Task<IResult> GetDependencies(int id)
    {
        try
        {
            var sql = @"
                SELECT M.ModelName AS Name, 'Modelos' AS Category 
                FROM tags T
                    INNER JOIN modeltags MT ON T.IdTag = MT.IdTag
                    INNER JOIN models M ON M.IdModel = MT.IdModel
                WHERE T.IdTag = @IdTag
                ORDER BY Category, Name";
            var response = await db.QueryAsync<Dependency>(sql, new { IdTag = id }).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }
}
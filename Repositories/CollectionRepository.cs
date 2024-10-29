using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using stl.Code;
using stl.Interfaces;
using stl.Models;
using stl.Utils;

namespace stl.Repositories;

public class CollectionRepository : ICollectionRepository
{
    private readonly IDbConnection db;
    public string ConnectionString { get; set; }

    public CollectionRepository(IOptions<ConnectionString> connectionStrings)
    {
        db = new MySqlConnection(connectionStrings.Value.STLConnectionString);
    }

    public async Task<IResult> SearchCollection(Collection collection)
    {
        try
        {
            var sql = @"SELECT C.IdCollection, C.CollectionName, P.IdPatreon, P.PatreonName
                FROM collections C
                    INNER JOIN patreons P ON C.IdPatreon = P.IdPatreon
                WHERE (@CollectionName = '' OR C.CollectionName LIKE CONCAT('%', @CollectionName, '%')) AND
                    (@IdPatreon = 0 OR C.IdPatreon = @IdPatreon)
                ORDER BY C.CollectionName";

            var response = (await db.QueryAsync<Collection, Patreon, Collection>(sql,
                (collection, patreon) => {
                    collection.Patreon = patreon;
                    return collection;
                }, splitOn: "IdPatreon",
                param: new 
                {
                    collection.IdCollection,
                    collection.Patreon.IdPatreon,
                    collection.CollectionName
                }).ConfigureAwait(false)).AsList();

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> SaveCollection(Collection collection)
    {
        try
        {
            var sql = (collection.IdCollection == 0) ? 
                "INSERT INTO collections (IdPatreon, CollectionName) VALUES (@IdPatreon, @CollectionName)" : 
                @"UPDATE collections SET 
                    IdPatreon = @IdPatreon,
                    CollectionName = @CollectionName 
                WHERE IdCollection = @IdCollection";
            var response = await db.ExecuteAsync(sql, 
                new 
                {
                    collection.IdCollection,
                    collection.Patreon.IdPatreon,
                    collection.CollectionName
                }).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> DeleteCollection(int id)
    {
        try
        {
            var sql = "DELETE FROM collections WHERE IdCollection = @IdCollection";
            var response = await db.ExecuteAsync(sql, new { IdCollection = id }).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }
}


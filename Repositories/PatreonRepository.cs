using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using stl.Code;
using stl.Interfaces;
using stl.Models;
using stl.Utils;

namespace stl.Repositories;

public class PatreonRepository : IPatreonRepository
{
    private readonly IDbConnection db;
    public string ConnectionString { get; set; }

    public PatreonRepository(IOptions<ConnectionString> connectionStrings)
    {
        db = new MySqlConnection(connectionStrings.Value.STLConnectionString);
    }

        public async Task<IResult> SearchPatreon(Patreon patreon)
    {
        try
        {
            var sql = @"SELECT IdPatreon, PatreonName 
                FROM patreons 
                WHERE (@PatreonName = '' OR PatreonName LIKE CONCAT('%', @PatreonName, '%')) 
                ORDER BY PatreonName";
            var response = (await db.QueryAsync<Patreon>(sql, patreon).ConfigureAwait(false)).AsList();

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> SavePatreon(Patreon patreon)
    {
        try
        {
            var sql = (patreon.IdPatreon == 0) ? 
                "INSERT INTO patreons (PatreonName) VALUES (@PatreonName)" : 
                "UPDATE patreons SET PatreonName = @PatreonName WHERE IdPatreon = @IdPatreon";
            var response = await db.ExecuteAsync(sql, patreon).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> DeletePatreon(int id)
    {
        try
        {
            var sql = "DELETE FROM patreons WHERE IdPatreon = @IdPatreon";
            var response = await db.ExecuteAsync(sql, new { IdPatreon = id }).ConfigureAwait(false);
            
            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }
}
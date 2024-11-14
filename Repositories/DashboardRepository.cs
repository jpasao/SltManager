using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using MySqlConnector;
using stl.Code;
using stl.Interfaces;
using stl.Models;
using stl.Utils;

namespace stl.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly IDbConnection db;
    public string ConnectionString { get; set; }

    public DashboardRepository(IOptions<ConnectionString> connectionStrings)
    {
        db = new MySqlConnection(connectionStrings.Value.STLConnectionString);
    }

    public async Task<IResult> GetOverview()
    {
        try
        {
            var sql = @"SELECT COUNT(*) AS Quantity, 'Patreons' AS Category FROM patreons
                UNION
                SELECT COUNT(*) AS Quantity, 'Colecciones' AS Category FROM collections
                UNION
                SELECT COUNT(*) AS Quantity, 'Etiquetas' AS Category FROM tags
                UNION
                SELECT COUNT(*) AS Quantity, 'Modelos' AS Category FROM models
                ORDER BY Category";
            var response = await db.QueryAsync<Dashboard>(sql).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> GetModelDistribution()
    {
        try
        {
            var sql = @"SELECT COUNT(*) AS Quantity, DATE_FORMAT(Created, '%b. %Y') AS Category
                FROM models
                GROUP BY DATE_FORMAT(Created, '%m-%y')
                ORDER BY YEAR(Created), MONTH(Created)";
            var response = await db.QueryAsync<Dashboard>(sql).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> GetPatreonDistribution()
    {
        try
        {
            var sql = @"SELECT COUNT(P.IdPatreon) AS Quantity, P.PatreonName AS Category
                FROM patreons P 
	                INNER JOIN models M ON P.IdPatreon = M.IdPatreon
                GROUP BY P.IdPatreon
                ORDER BY Category";
            var response = await db.QueryAsync<Dashboard>(sql).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> GetTagDistribution()
    {
        try
        {
            var sql = @"SELECT COUNT(*) as Quantity, T.TagName AS Category
                FROM tags T
	                INNER JOIN modeltags M ON M.IdTag = T.IdTag
                GROUP BY M.IdTag
                ORDER BY Category";
            var response = await db.QueryAsync<Dashboard>(sql).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }
}
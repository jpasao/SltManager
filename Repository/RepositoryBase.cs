using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using stl.Code;
using stl.Models;


namespace stl.Repository;

public class RepositoryBase : IRepositoryBase
{
    private readonly IDbConnection db;
    public string ConnectionString { get; set; }

    public RepositoryBase(IOptions<ConnectionString> connectionStrings)
    {
        db = new MySqlConnection(connectionStrings.Value.STLConnectionString);
    }

    #region Patreon

    public async Task<List<Patreon>> SearchPatreon(Patreon patreon)
    {
        var sql = @"SELECT IdPatreon, Name 
            FROM patreons 
            WHERE (@Name = 0 OR Name LIKE CONCAT('%', @Name, '%')) 
            ORDER BY Name";

        return (await db.QueryAsync<Patreon>(sql, patreon).ConfigureAwait(false)).AsList();
    }

    public async Task<int> SavePatreon(Patreon patreon)
    {
        var sql = (patreon.IdPatreon == 0) ? 
            "INSERT INTO patreons (Name) VALUES (@Name)" : 
            "UPDATE patreons SET Name = @Name WHERE IdPatreon = @IdPatreon";

        return await db.ExecuteAsync(sql, patreon).ConfigureAwait(false);
    }

    public async Task<int> DeletePatreon(Patreon patreon)
    {
        var sql = "DELETE FROM patreons WHERE IdPatreon = @IdPatreon";

        return await db.ExecuteAsync(sql, patreon).ConfigureAwait(false);      
    }

    #endregion

    #region Models

    public async Task<List<StlModel>> SearchModel(StlModel model)
    {

        var sql = @"SELECT 
                M.IdModel, 
                M.ModelName, 
                M.Year, 
                M.Month, 
                M.Photo, 
                M.Path,
                P.IdPatreon,
                P.PatreonName,
                T.IdTag, 
                T.TagName
            FROM models M
                INNER JOIN patreons P ON M.IdPatreon = P.IdPatreon
                INNER JOIN modeltags MT ON MT.IdModel = M.IdModel
                INNER JOIN tags T ON T.IdTag = MT.IdTag 
            WHERE (@IdPatreon = 0 OR M.IdPatreon = @IdPatreon) AND
                (@IdTag = 0 OR T.IdTag = @IdTag) AND
                (@ModelName = 0 OR M.ModelName LIKE CONCAT('%', @ModelName, '%')) AND
                (@Year = 0 OR M.Year = @Year) AND
                (@Month = 0 OR M.Month = @Month)
            ORDER BY M.ModelName";

        var models = await db.QueryAsync<StlModel, Patreon, Tag, StlModel>(sql, 
            (model, patreon, tag) => {
                model.Patreon = patreon;
                model.Tag = new List<Tag>{ tag };
                return model;
            }, splitOn: "IdPatreon, IdTag", 
            param: new {
                model.Patreon.IdPatreon,
                model.Tag.FirstOrDefault().IdTag,
                model.ModelName,
                model.Year,
                model.Month
            }).ConfigureAwait(false);
        
        var results = models.GroupBy(p => p.IdModel).Select(g => 
        {
            var groupedModel = g.First();
            groupedModel.Tag = g.Select(p => p.Tag.Single()).ToList();
            return groupedModel;
        });

        return results.AsList();
    }
    
    public async Task<int> SaveModel(StlModel model)
    {
        return await db.ExecuteAsync("", model).ConfigureAwait(false);
    }

    public async Task<int> DeleteModel(StlModel model)
    {
        return await db.ExecuteAsync("", model).ConfigureAwait(false);
    } 

    #endregion

    #region Tags

    public async Task<List<Tag>> SearchTag(Tag tag)
    {
        var sql = @"SELECT IdTag, Name 
            FROM tags 
            WHERE (@Name = 0 OR Name LIKE CONCAT('%', @Name, '%')) 
            ORDER BY Name";

        return (await db.QueryAsync<Tag>(sql, 
            new { 
                tag.TagName
            }).ConfigureAwait(false)).AsList();
    }

    public async Task<int> SaveTag(Tag tag)
    {
        return await db.ExecuteAsync("", tag).ConfigureAwait(false);
    }

    public async Task<int> DeleteTag(Tag tag)
    {
        return await db.ExecuteAsync("", tag).ConfigureAwait(false);
    }

    #endregion
}


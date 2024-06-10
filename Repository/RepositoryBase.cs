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
        try
        {
            var sql = @"SELECT IdPatreon, PatreonName 
                FROM patreons 
                WHERE (@PatreonName = '' OR PatreonName LIKE CONCAT('%', @PatreonName, '%')) 
                ORDER BY PatreonName";

            return (await db.QueryAsync<Patreon>(sql, patreon).ConfigureAwait(false)).AsList();            
        }
        catch (System.Exception)
        {
            return null;
        }
    }

    public async Task<int> SavePatreon(Patreon patreon)
    {
        try
        {
            var sql = (patreon.IdPatreon == 0) ? 
                "INSERT INTO patreons (PatreonName) VALUES (@PatreonName)" : 
                "UPDATE patreons SET PatreonName = @PatreonName WHERE IdPatreon = @IdPatreon";

            return await db.ExecuteAsync(sql, patreon).ConfigureAwait(false);            
        }
        catch (System.Exception)
        {
            return -1;
        }
    }

    public async Task<int> DeletePatreon(int id)
    {
        try
        {
            var sql = "DELETE FROM patreons WHERE IdPatreon = @IdPatreon";

            return await db.ExecuteAsync(sql, new { IdPatreon = id }).ConfigureAwait(false);
        }
        catch (System.Exception)
        {
            return -1;
        }
    }

    #endregion

    #region Models

    public async Task<List<StlModel>> SearchModel(StlModel model)
    {
        try
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
                    (@ModelName = '' OR M.ModelName LIKE CONCAT('%', @ModelName, '%')) AND
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
        catch (System.Exception)
        {
            return null;
        }
    }
    
    public async Task<int> SaveModel(StlModel model)
    {
        try
        {
            bool isNewModel = model.IdModel == 0;
            int modelSave = 0, modelTagDelete = 0, modelTagInsert = 0, modelId = 0;
            var sql = isNewModel ? 
                "INSERT INTO models (IdPatreon, ModelName, Year, Month, Photo, Path) VALUES (@IdPatreon, @ModelName, @Year, @Month, @Photo, @Path); SELECT LAST_INSERT_ID()" :
                "UPDATE models SET IdPatreon = @IdPatreon, ModelName = @ModelName, Year = @Year, Month = @Month, Photo = @Photo, Path = @Path WHERE IdModel = @IdModel";
            modelSave = await db.ExecuteScalarAsync<int>(sql, 
                new 
                {
                    model.IdModel,
                    model.Patreon.IdPatreon,
                    model.ModelName,
                    model.Year,
                    model.Month,
                    model.Photo,
                    model.Path
                }).ConfigureAwait(false);

            if (modelSave > 0 && model.Tag != null && model.Tag.Count > 0) 
            {
                if (!isNewModel) 
                {
                    sql = "DELETE FROM modeltags WHERE IdModel = @IdModel";
                    modelTagDelete = await db.ExecuteAsync(sql, model).ConfigureAwait(false);
                    modelId = model.IdModel;
                }
                else 
                {
                    modelId = modelSave;
                }
                sql = "INSERT INTO modeltags (IdTag, IdModel) VALUES (@IdTag, @IdModel)";
                model.Tag.ForEach(async tag => {
                    modelTagInsert = await db.ExecuteAsync(sql, 
                        new 
                        {
                            tag.IdTag,
                            IdModel = modelId
                        }).ConfigureAwait(false);  
                }); 
            }
            return modelSave + modelTagDelete + modelTagInsert;
        }
        catch (System.Exception)
        {
            return -1;
        }
    }

    public async Task<int> DeleteModel(int id)
    {
        try
        {
            var sql = "DELETE FROM models WHERE IdModel = @idModel";
            return await db.ExecuteAsync(sql, id).ConfigureAwait(false);            
        }
        catch (System.Exception)
        {
            return -1;
        }
    } 

    #endregion

    #region Tags

    public async Task<List<Tag>> SearchTag(Tag tag)
    {
        try
        {
            var sql = @"SELECT IdTag, TagName 
                FROM tags 
                WHERE (@TagName = '' OR TagName LIKE CONCAT('%', @TagName, '%')) 
                ORDER BY TagName";

            return (await db.QueryAsync<Tag>(sql, tag).ConfigureAwait(false)).AsList();            
        }
        catch (System.Exception)
        {
            return null;
        }
    }

    public async Task<int> SaveTag(Tag tag)
    {
        try
        {
            var sql = (tag.IdTag == 0) ? 
                "INSERT INTO tags (TagName) VALUES (@TagName)" : 
                "UPDATE tags SET TagName = @TagName WHERE IdTag = @IdTag";

            return await db.ExecuteAsync(sql, tag).ConfigureAwait(false);            
        }
        catch (System.Exception)
        {
            return -1;
        }
    }

    public async Task<int> DeleteTag(int id)
    {
        try
        {
            var sql = "DELETE FROM tags WHERE IdTag = @IdTag";

            return await db.ExecuteAsync(sql, new { IdTag = id }).ConfigureAwait(false);
        }
        catch (System.Exception)
        {
            return -1;
        }        
    }

    #endregion
}


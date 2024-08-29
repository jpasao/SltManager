using System.Data;
using System.Diagnostics;
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
        catch (Exception)
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
        catch (Exception)
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
        catch (Exception)
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
                    M.Path,
                    P.IdPatreon,
                    P.PatreonName,
                    T.IdTag, 
                    T.TagName
                FROM models M
                    INNER JOIN patreons P ON M.IdPatreon = P.IdPatreon
                    LEFT JOIN modeltags MT ON MT.IdModel = M.IdModel
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
                groupedModel.Tag = g.Select(tag => tag.Tag.Single()).ToList();
                groupedModel.Tag = groupedModel.Tag
                    .GroupBy(tag => tag.IdTag)
                    .Select(tag => tag.First())
                    .ToList();
                    
                return groupedModel;
            }).AsList();
       
            return results;        
        }
        catch (Exception)
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
                "INSERT INTO models (IdPatreon, ModelName, Year, Month, Path) VALUES (@IdPatreon, @ModelName, @Year, @Month, @Path); SELECT LAST_INSERT_ID()" :
                "UPDATE models SET IdPatreon = @IdPatreon, ModelName = @ModelName, Year = @Year, Month = @Month, Path = @Path WHERE IdModel = @IdModel";
            modelSave = await db.ExecuteScalarAsync<int>(sql, 
                new 
                {
                    model.IdModel,
                    model.Patreon.IdPatreon,
                    model.ModelName,
                    model.Year,
                    model.Month,                    
                    model.Path
                }).ConfigureAwait(false);

            modelId = isNewModel ? modelSave : model.IdModel;

            if (modelSave > 0 && model.Tag != null && model.Tag.Count > 0) 
            {
                if (!isNewModel) 
                {
                    sql = "DELETE FROM modeltags WHERE IdModel = @IdModel";
                    modelTagDelete = await db.ExecuteAsync(sql, model).ConfigureAwait(false);
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
        catch (Exception)
        {
            return -1;
        }
    }

    public async Task<List<Photo>> GetPhotos(int idModel)
    {
        try
        {
            var sql = @"SELECT idPhoto, Image
                        FROM photos
                        WHERE idModel = @IdModel";

            return (await db.QueryAsync<Photo>(sql, new { IdModel = idModel }).ConfigureAwait(false)).AsList();
        }
        catch (System.Exception)
        {
            return null;
        }
    }
 
    public async Task<int> SavePhotos(int idModel, int idPhoto, bool isUpdate, IFormFile photo)
    {
        try
        {
            if (photo == null || photo.Length == 0) 
            {
                return 0;
            }
            byte[]? photoBytes = null;

            using (var photoFileStream = photo.OpenReadStream())
            using (var photoMemoryStream = new MemoryStream())
            {
                await photoFileStream.CopyToAsync(photoMemoryStream);
                photoBytes = photoMemoryStream.ToArray();
            }

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@IdModel", idModel);
            parameters.Add("@IdPhoto", idPhoto);
            parameters.Add("@Photo", photoBytes, DbType.Binary, ParameterDirection.Input);
            
            string sql = isUpdate ? 
                "UPDATE photos SET Image = @Photo, IdModel = @IdModel WHERE IdPhoto = @IdPhoto" :
                "INSERT INTO photos (IdModel, Image) VALUES (@IdModel, @Photo)";
            int photoSaving = await db.ExecuteAsync(sql, parameters).ConfigureAwait(false);

            return photoSaving;
        }
        catch (Exception)
        {
            return -1;
        }
    }

    private async Task<int> DeletePhotos(int idModel)
    {
        try
        {
            var sql = "DELETE FROM photos WHERE IdModel = @IdModel";
            return await db.ExecuteAsync(sql, 
            new 
            { 
                IdModel = idModel 
            }).ConfigureAwait(false);            
        }
        catch (Exception)
        {
            return -1;
        }
    }

    public async Task<int> DeleteModel(int id)
    {
        try
        {
            int modelDelete = 0, modelPhotoDelete = 0;
            var sql = "DELETE FROM models WHERE IdModel = @IdModel";
            modelDelete = await db.ExecuteAsync(sql, new { IdModel = id }).ConfigureAwait(false);

            if (modelDelete > 0)
            {
                modelPhotoDelete = await DeletePhotos(id);
            } 

            return modelDelete + modelPhotoDelete;        
        }
        catch (Exception)
        {
            return -1;
        }
    }

    public async Task<List<int>> GetModelYears()
    {
        try
        {
            var sql = @"SELECT DISTINCT Year FROM models ORDER BY Year";

            return (await db.QueryAsync<int>(sql).ConfigureAwait(false)).AsList();
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task OpenFolder(string path)
    {
        var process = new ProcessStartInfo() {
            FileName = $"{path}{Path.DirectorySeparatorChar}",
            UseShellExecute = true};
        Process.Start(process);
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
        catch (Exception)
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
        catch (Exception)
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
        catch (Exception)
        {
            return -1;
        }        
    }

    #endregion
}


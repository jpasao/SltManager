using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using MySqlConnector;
using stl.Code;
using stl.Interfaces;
using stl.Models;
using stl.Utils;

namespace stl.Repositories;

public class StlModelRepository : IStlModelRepository
{
    private readonly IDbConnection db;
    public string ConnectionString { get; set; }

    public StlModelRepository(IOptions<ConnectionString> connectionStrings)
    {
        db = new MySqlConnection(connectionStrings.Value.STLConnectionString);
    }

    public async Task<IResult> SearchModel(StlModel model)
    {
        try
        {
            var sql = @"SELECT 
                    M.IdModel, 
                    M.ModelName, 
                    M.Year, 
                    M.Month, 
                    M.Path,
                    M.IdCollection,
                    P.IdPatreon,
                    P.PatreonName,
                    T.IdTag,
                    T.TagName
                FROM models M
                    INNER JOIN patreons P ON M.IdPatreon = P.IdPatreon
                    LEFT JOIN modeltags MT ON MT.IdModel = M.IdModel
                    INNER JOIN tags T ON T.IdTag = MT.IdTag 
                WHERE (@IdPatreon = 0 OR M.IdPatreon = @IdPatreon) AND
                    (@IdCollection = 0 OR M.IdCollection = @IdCollection) AND
                    (@NoTags = 1 OR T.IdTag IN @TagIdList) AND
                    (@ModelName = '' OR M.ModelName LIKE CONCAT('%', @ModelName, '%'))
                ORDER BY M.ModelName";

            var tagList = model.Tag.Select(t => t.IdTag).ToArray();
            model.TagIdList = tagList;
            model.NoTags = tagList[0] != 0 ? 0 : 1;
            var models = await db.QueryAsync<StlModel, Patreon, Tag, StlModel>(sql,
                (model, patreon, tag) => {
                    model.Patreon = patreon;
                    model.Tag = new List<Tag>{ tag };
                    model.TagIdList = tagList;
                    return model;
                }, splitOn: "IdPatreon, IdTag", 
                param: new {
                    model.Patreon.IdPatreon,
                    model.IdCollection,
                    model.Tag,
                    model.TagIdList,
                    model.ModelName,
                    model.NoTags
                }).ConfigureAwait(false);

            var response = models
                .GroupBy(p => p.IdModel)
                .Select(g => 
                {
                    var groupedModel = g.First();
                    groupedModel.Tag = g.Select(tag => tag.Tag.Single()).ToList();
                        groupedModel.Tag = groupedModel.Tag
                            .GroupBy(tag => tag.IdTag)
                            .Select(tag => tag.First())
                            .ToList();
                        
                    return groupedModel;
                })
                .AsList();
       
            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }
    
    public async Task<IResult> SaveModel(StlModel model)
    {
        try
        {
            bool isNewModel = model.IdModel == 0;
            int modelSave = 0, modelTagDelete = 0, modelTagInsert = 0, modelId = 0;
            var sql = isNewModel ?
                "INSERT INTO models (IdPatreon, IdCollection, ModelName, Year, Month, Path) VALUES (@IdPatreon, @IdCollection, @ModelName, @Year, @Month, @Path); SELECT LAST_INSERT_ID()" :
                "UPDATE models SET IdPatreon = @IdPatreon, IdCollection = @IdCollection, ModelName = @ModelName, Year = @Year, Month = @Month, Path = @Path WHERE IdModel = @IdModel";
            modelSave = await db.ExecuteScalarAsync<int>(sql,
                new 
                {
                    model.IdModel,
                    model.Patreon.IdPatreon,
                    model.IdCollection,
                    model.ModelName,
                    model.Year,
                    model.Month,
                    model.Path
                }).ConfigureAwait(false);

            modelId = isNewModel ? modelSave : model.IdModel;

            if (model.Tag != null && model.Tag.Count > 0)
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
            var response = modelSave + modelTagDelete + modelTagInsert;

            return Response.BuildResponse(response);
        }
        catch (UniqueException ex)
        {
            return Response.BuildError(ex, 400);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("Duplicate")) throw new UniqueException("Modelos");
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> GetPhotos(int idModel)
    {
        try
        {
            var sql = @"SELECT idPhoto, Image
                        FROM photos
                        WHERE idModel = @IdModel";
            var response = (await db.QueryAsync<Photo>(sql, new { IdModel = idModel }).ConfigureAwait(false)).AsList();
            
            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> SavePhoto(int idModel, IFormFile photo)
    {
        try
        {
            if (photo == null || photo.Length == 0) 
            {
                return Response.BuildError(new Exception("No data received"), 400);
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
            parameters.Add("@Photo", photoBytes, DbType.Binary, ParameterDirection.Input);
            
            string sql = "INSERT INTO photos (IdModel, Image) VALUES (@IdModel, @Photo); SELECT LAST_INSERT_ID()";
            int response = await db.ExecuteScalarAsync<int>(sql, parameters).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> DeletePhoto(int idPhoto)
    {
        try
        {
            var sql = "DELETE FROM photos WHERE IdPhoto = @IdPhoto";
            var response = await db.ExecuteAsync(sql, 
            new 
            { 
                IdPhoto = idPhoto 
            }).ConfigureAwait(false);

            return Response.BuildResponse(response);  
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }

    public async Task<IResult> DeleteModel(int id)
    {
        try
        {
            int modelDelete = 0, modelPhotoDelete = 0;
            var sql = "DELETE FROM models WHERE IdModel = @IdModel";
            modelDelete = await db.ExecuteAsync(sql, new { IdModel = id }).ConfigureAwait(false);

            if (modelDelete > 0)
            {
            sql = "DELETE FROM photos WHERE IdModel = @IdModel";
            modelPhotoDelete = await db.ExecuteAsync(sql, 
            new 
            { 
                IdModel = id 
            }).ConfigureAwait(false);  
            } 
            var response = modelDelete + modelPhotoDelete;

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
                SELECT P.PatreonName AS Name, 'Patreons' AS Category 
                FROM patreons P
                    INNER JOIN models M ON M.IdPatreon = P.IdPatreon
                WHERE M.IdModel = @IdModel
                UNION
                SELECT C.CollectionName as Name, 'Colecciones' AS Category
                FROM collections C
                    INNER JOIN models M ON M.IdCollection = C.IdCollection
                WHERE M.IdModel = @IdModel
                UNION 
                SELECT T.TagName AS Name, 'Etiquetas' AS Category
                FROM tags T
                    INNER JOIN modeltags MT ON T.IdTag = MT.IdTag
                    INNER JOIN models M ON M.IdModel = MT.IdModel
                WHERE M.IdModel = @IdModel
                ORDER BY Category, Name";
            var response = await db.QueryAsync<Dependency>(sql, new { IdModel = id }).ConfigureAwait(false);

            return Response.BuildResponse(response);
        }
        catch (Exception ex)
        {
            return Response.BuildError(ex);
        }
    }
}
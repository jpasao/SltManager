using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repository;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class StlModelController : ControllerBase
{
    private readonly RepositoryBase repository;

    public StlModelController(IOptions<ConnectionString> connectionString)
    {
        repository = new RepositoryBase(connectionString);
    }

    [HttpGet("ModelYears")]
    public async Task<List<int>> GetModelYears()
    {
        return await repository.GetModelYears();
    }

    [HttpPost("OpenFolder")]
    public async Task OpenFolder(PathObj path)
    {
        await repository.OpenFolder(path.path);
    }

    [HttpPost("Get")]
    public async Task<IEnumerable<StlModel>> Get(StlModel model)
    {
        return await repository.SearchModel(model);
    }

    [HttpPost("Post")]
    public async Task<int> Post(StlModel model)
    {
        return await repository.SaveModel(model);
    }

    [HttpGet("Photo")]
    public async Task<List<Photo>> GetPhotos(int id)
    {
        return await repository.GetPhotos(id); 
    }

    [HttpPost("Photo")]
    public async Task<int> PhotoInsert(int id, int idPhoto, IFormFile photo)
    {
        return await repository.SavePhotos(id, idPhoto, false, photo);
    }

    [HttpPut("Photo")]
    public async Task<int> PhotoUpdate(int id, int idPhoto, IFormFile photo)
    {
        return await repository.SavePhotos(id, idPhoto, true, photo);
    }
    
    [HttpPut]
    public async Task<int> Put(StlModel model)
    {
        return await repository.SaveModel(model);
    }

    [HttpDelete]
    public async Task<int> Delete(int id)
    {
        return await repository.DeleteModel(id);
    }
}


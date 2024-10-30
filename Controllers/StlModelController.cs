using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repositories;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class StlModelController : ControllerBase
{
    private readonly StlModelRepository repository;

    public StlModelController(IOptions<ConnectionString> connectionString)
    {
        repository = new StlModelRepository(connectionString);
    }

    [HttpPost("Get")]
    public async Task<IResult> Get(StlModel model)
    {
        return await repository.SearchModel(model);
    }

    [HttpPost("Post")]
    public async Task<IResult> Post(StlModel model)
    {
        return await repository.SaveModel(model);
    }

    [HttpGet("Photo")]
    public async Task<IResult> GetPhotos(int id)
    {
        return await repository.GetPhotos(id); 
    }

    [HttpPost("Photo")]
    public async Task<IResult> SavePhoto(int id, IFormFile photo)
    {
        return await repository.SavePhoto(id, photo);
    }

    [HttpDelete("Photo")]
    public async Task<IResult> PhotoDelete(int id)
    {
        return await repository.DeletePhoto(id);
    }
    
    [HttpPut]
    public async Task<IResult> Put(StlModel model)
    {
        return await repository.SaveModel(model);
    }

    [HttpDelete]
    public async Task<IResult> Delete(int id)
    {
        return await repository.DeleteModel(id);
    }

    [HttpGet("Dependency")]
    public async Task<IResult> Dependencies(int id)
    {
        return await repository.GetDependencies(id);
    }
}


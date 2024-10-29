using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repositories;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class CollectionController : ControllerBase
{
    private readonly CollectionRepository repository;

    public CollectionController(IOptions<ConnectionString> connectionString)
    {
        repository = new CollectionRepository(connectionString);
    }

    [HttpPost("Get")]    
    public async Task<IResult> Get(Collection collection)
    {
        return await repository.SearchCollection(collection);
    }

    [HttpPost("Post")]
    public async Task<IResult> Post(Collection collection)
    {
        return await repository.SaveCollection(collection);
    }

    [HttpPut]
    public async Task<IResult> Put(Collection collection)
    {
        return await repository.SaveCollection(collection);
    }

    [HttpDelete]
    public async Task<IResult> Delete(int id)
    {
        return await repository.DeleteCollection(id);
    }
}
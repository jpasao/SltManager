using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repository;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class CollectionController : ControllerBase
{
    private readonly RepositoryBase repository;

    public CollectionController(IOptions<ConnectionString> connectionString)
    {
        repository = new RepositoryBase(connectionString);
    }

    [HttpPost("Get")]    
    public async Task<IEnumerable<Collection>> Get(Collection collection)
    {
        return await repository.SearchCollection(collection);
    }

    [HttpPost("Post")]
    public async Task<int> Post(Collection collection)
    {
        return await repository.SaveCollection(collection);
    }

    [HttpPut]
    public async Task<int> Put(Collection collection)
    {
        return await repository.SaveCollection(collection);
    }

    [HttpDelete]
    public async Task<int> Delete(int id)
    {
        return await repository.DeleteCollection(id);
    }
}
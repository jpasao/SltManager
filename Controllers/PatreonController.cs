using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repository;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class PatreonController : ControllerBase
{
    public RepositoryBase repository;

    public PatreonController(IOptions<ConnectionString> connectionString)
    {
        repository = new RepositoryBase(connectionString);
    }

    [HttpPost("Get")]    
    public async Task<IEnumerable<Patreon>> Get(Patreon patreon)
    {
        return await repository.SearchPatreon(patreon);
    }

    [HttpPost("Post")]
    public async Task<int> Post(Patreon patreon)
    {
        return await repository.SavePatreon(patreon);
    }

    [HttpPut]
    public async Task<int> Put(Patreon patreon)
    {
        return await repository.SavePatreon(patreon);
    }

    [HttpDelete]
    public async Task<int> Delete(Patreon patreon)
    {
        return await repository.DeletePatreon(patreon);
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repositories;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class PatreonController : ControllerBase
{
    private readonly PatreonRepository repository;

    public PatreonController(IOptions<ConnectionString> connectionString)
    {
        repository = new PatreonRepository(connectionString);
    }

    [HttpPost("Get")]    
    public async Task<IResult> Get(Patreon patreon)
    {
        return await repository.SearchPatreon(patreon);
    }

    [HttpPost("Post")]
    public async Task<IResult> Post(Patreon patreon)
    {
        return await repository.SavePatreon(patreon);
    }

    [HttpPut]
    public async Task<IResult> Put(Patreon patreon)
    {
        return await repository.SavePatreon(patreon);
    }

    [HttpDelete]
    public async Task<IResult> Delete(int id)
    {
        return await repository.DeletePatreon(id);
    }

    [HttpGet("Dependency")]
    public async Task<IResult> Dependencies(int id)
    {
        return await repository.GetDependencies(id);
    }    
}
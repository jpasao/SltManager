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
    private readonly RepositoryBase repository;

    public PatreonController(IOptions<ConnectionString> connectionString)
    {
        repository = new RepositoryBase(connectionString);
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
}
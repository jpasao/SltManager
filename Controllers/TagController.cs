using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repository;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class TagController : ControllerBase
{
    private readonly RepositoryBase repository;

    public TagController(IOptions<ConnectionString> connectionString)
    {
        repository = new RepositoryBase(connectionString);
    }

    [HttpPost("Get")]
    public async Task<IResult> Get(Tag tag)
    {
        return await repository.SearchTag(tag);
    }

    [HttpPost("Post")]
    public async Task<IResult> Post(Tag tag)
    {
        return await repository.SaveTag(tag);
    }

    [HttpPut]
    public async Task<IResult> Put(Tag tag)
    {
        return await repository.SaveTag(tag);
    }

    [HttpDelete]
    public async Task<IResult> Delete(int id)
    {
        return await repository.DeleteTag(id);
    }
}
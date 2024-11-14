using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using stl.Code;
using stl.Models;
using stl.Repositories;

namespace stl.Controllers;

[ApiController]
[Route("[controller]")]
public class DashboardController : ControllerBase
{
    private readonly DashboardRepository repository;

    public DashboardController(IOptions<ConnectionString> connectionString)
    {
        repository = new DashboardRepository(connectionString);
    }

    [HttpGet("Overview")]
    public async Task<IResult> Overview()
    {
        return await repository.GetOverview();
    }

    [HttpGet("Model")]
    public async Task<IResult> Model()
    {
        return await repository.GetModelDistribution();
    }

    [HttpGet("Patreon")]
    public async Task<IResult> Patreon()
    {
        return await repository.GetPatreonDistribution();
    }

    [HttpGet("Tag")]
    public async Task<IResult> Tag()
    {
        return await repository.GetTagDistribution();
    }
}
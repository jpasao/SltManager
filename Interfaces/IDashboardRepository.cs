using stl.Models;

namespace stl.Interfaces;

interface IDashboardRepository
{
    Task<IResult> GetOverview();

    Task<IResult> GetModelDistribution();

    Task<IResult> GetPatreonDistribution();

    Task<IResult> GetTagDistribution();
}
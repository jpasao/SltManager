using stl.Models;

namespace stl.Interfaces;

internal interface IPatreonRepository
{
    Task<IResult> SearchPatreon(Patreon patreon);

    Task<IResult> SavePatreon(Patreon patreon);

    Task<IResult> DeletePatreon(int id);
}
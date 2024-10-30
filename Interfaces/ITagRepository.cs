using stl.Models;

namespace stl.Interfaces;

interface ITagRepository
{
    Task<IResult> SearchTag(Tag tag);

    Task<IResult> SaveTag(Tag tag);

    Task<IResult> DeleteTag(int id);

    Task<IResult> GetDependencies(int id);
}
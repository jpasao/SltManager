using stl.Models;

namespace stl.Interfaces;

internal interface ITagRepository
{
    Task<IResult> SearchTag(Tag tag);

    Task<IResult> SaveTag(Tag tag);

    Task<IResult> DeleteTag(int id);
}
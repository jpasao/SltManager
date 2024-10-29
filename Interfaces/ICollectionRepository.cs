using stl.Models;

namespace stl.Interfaces;

internal interface ICollectionRepository
{
    Task<IResult> SearchCollection(Collection collection);

    Task<IResult> SaveCollection(Collection collection);
    
    Task<IResult> DeleteCollection(int id);
}
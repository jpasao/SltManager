using stl.Models;

namespace stl.Interfaces;

interface ICollectionRepository
{
    Task<IResult> SearchCollection(Collection collection);

    Task<IResult> SaveCollection(Collection collection);
    
    Task<IResult> DeleteCollection(int id);

    Task<IResult> GetDependencies(int id);
}
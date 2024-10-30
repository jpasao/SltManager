using stl.Models;

namespace stl.Interfaces;

interface IStlModelRepository
{
    Task<IResult> SearchModel(StlModel model);
    
    Task<IResult> SaveModel(StlModel model);

    Task<IResult> GetPhotos(int idModel);

    Task<IResult> SavePhoto(int idModel, IFormFile photo);

    Task<IResult> DeletePhoto(int idPhoto);
    
    Task<IResult> DeleteModel(int id);

    Task<IResult> GetDependencies(int id);
}
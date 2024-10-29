using stl.Models;

namespace stl.Repository;

internal interface IRepositoryBase
{
    #region Patreon

    Task<IResult> SearchPatreon(Patreon patreon);

    Task<IResult> SavePatreon(Patreon patreon);

    Task<IResult> DeletePatreon(int id);

    #endregion

    #region Collection

    Task<IResult> SearchCollection(Collection collection);

    Task<IResult> SaveCollection(Collection collection);
    
    Task<IResult> DeleteCollection(int id);

    #endregion

    #region Models
    Task<IResult> SearchModel(StlModel model);
    
    Task<IResult> SaveModel(StlModel model);

    Task<IResult> GetPhotos(int idModel);

    Task<IResult> SavePhoto(int idModel, IFormFile photo);

    Task<IResult> DeletePhoto(int idPhoto);
    
    Task<IResult> DeleteModel(int id); 
    
    #endregion

    #region Tags

    Task<IResult> SearchTag(Tag tag);

    Task<IResult> SaveTag(Tag tag);

    Task<IResult> DeleteTag(int id);

    #endregion
}

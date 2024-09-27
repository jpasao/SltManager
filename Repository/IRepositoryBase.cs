using stl.Models;

namespace stl.Repository;

internal interface IRepositoryBase
{
    #region Patreon

    Task<List<Patreon>> SearchPatreon(Patreon patreon);

    Task<int> SavePatreon(Patreon patreon);

    Task<int> DeletePatreon(int id);

    #endregion

    #region Models
    Task<List<StlModel>> SearchModel(StlModel model);
    
    Task<int> SaveModel(StlModel model);

    Task<List<Photo>> GetPhotos(int idModel);

    Task<int> SavePhoto(int idModel, IFormFile photo);

    Task<int> DeletePhoto(int idPhoto);
    
    Task<int> DeleteModel(int id); 

    Task<List<int>> GetModelYears();
    
    Task OpenFolder(string path);

    #endregion

    #region Tags

    Task<List<Tag>> SearchTag(Tag tag);

    Task<int> SaveTag(Tag tag);

    Task<int> DeleteTag(int id);

    #endregion
}

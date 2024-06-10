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

    Task<int> DeleteModel(int id); 

    #endregion

    #region Tags

    Task<List<Tag>> SearchTag(Tag tag);

    Task<int> SaveTag(Tag tag);

    Task<int> DeleteTag(int id);

    #endregion
}

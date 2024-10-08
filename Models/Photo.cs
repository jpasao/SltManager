using Dapper.Contrib.Extensions;

namespace stl.Models;

[Table("photos")]
public class Photo
{
  [Key]
  public int IdPhoto { get; set; }

  public int IdModel { get; set; }

  public byte[]? Image { get; set; }
}

public class PhotoData
{
  public int IdModel { get; set; }

  public IFormFile Image { get; set; }
}
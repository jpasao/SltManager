using Dapper.Contrib.Extensions;

namespace stl.Models;

[Table("tags")]
public class Tag
{
  [Key]
  public int IdTag { get; set; }

  public string TagName { get; set; } 
}
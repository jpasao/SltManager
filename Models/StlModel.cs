using Dapper.Contrib.Extensions;

namespace stl.Models;

[Table("models")]
public class StlModel
{
  [Key]
  public int IdModel { get; set; }

  public Patreon Patreon { get; set; }

  public List<Tag> Tag { get; set; }

  public string? ModelName { get; set; } 

  public short Year { get; set; }

  public byte Month { get; set; }

  public List<Photo> Image { get; set; }

  public string? Path { get; set; } 
}

  public struct PathObj
  {
      public string path {get;set;}
  }
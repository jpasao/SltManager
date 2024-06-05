using Dapper.Contrib.Extensions;

namespace stl.Models;

[Table("patreons")]
public class Patreon
{
  [Key]
  public int IdPatreon { get; set; }

  public virtual string? PatreonName { get; set; } 
}
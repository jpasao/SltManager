using Dapper.Contrib.Extensions;

namespace stl.Models;

[Table("collections")]
public class Collection
{
    [Key]
    public int IdCollection { get; set;}
    public Patreon Patreon { get; set; }
    public string? CollectionName { get; set; }
}
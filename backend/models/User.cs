using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace interview
{
    //We're using this Table attribute to tell Entity Framework that we want this class to be backed by a `users` table in postgres
    [Table ("users")]
    public class User
    {
        //Generates unique ID for each User
        [Column("id")]
        [Key]
        public Guid Id { get; set; }

        //Each user has a public Name/Password/Deleted property
        [Column("name")]
        public string Name { get; set; }

        [Column("password")]
        public string Password { get; set; }
        
        [Column("deleted")]
        public bool Deleted { get; set; }

        //Users have a list of recipes they have created
        public List<Recipe> Recipes { get; set; }
    }
}

using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace interview
{
    //We're using this Table attribute to tell Entity Framework that we want this class to be backed by a `ingredients` table in postgres
    [Table("ingredients")]
    public class Ingredient
    {
        //Generates unique ID for each Ingredient
        [Column("id")]
        [Key]
        public Guid Id { get; set; }

        //Each Ingredient has a public Name/Quantity/Measure property
        [Column("name")]
        public string Name { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("measure")]
        public string Measure { get; set; }

        //Ingredients have a recipe they are in
        [JsonIgnore]
        public Recipe Recipe { get; set; }

        [Column("recipe_id")]
        public Guid RecipeID { get; set; }
    }
}

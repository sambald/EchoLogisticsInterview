using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace interview
{
    //Set Entity Framework that we want this class to be backed by a 'recipes' table in postgres
    [Table("recipes")]
    public class Recipe
    {
        //Generates unique ID for each Recipe
        [Column("id")]
        [Key]
        public Guid Id { get; set; }

        //Each Recipe has a public Title/Description/Time/Deleted property
        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("time")]
        public TimeSpan Time { get; set; }

        [Column("deleted")]
        public bool Deleted { get; set; }

        //Recipes have a list of Ingredients and a User who created it
        public List<Ingredient> Ingredients { get; set; }

        [Column("user_id")]
        public Guid UserID { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        //Default Recipe constructor
        public Recipe()
        {
            this.Id = Guid.Empty;
            this.Title = string.Empty;
            this.Description = string.Empty;
            this.Time = TimeSpan.Zero;
            this.Deleted = false;
            this.Ingredients = new List<Ingredient>();
            this.User = new User();
            this.UserID = this.User.Id;
        }
    }
}
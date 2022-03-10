using Microsoft.EntityFrameworkCore;

namespace interview
{
    public class EFContext : DbContext
    {
        //DbSet<Model> represents the table in the database that holds records of type Model
        public DbSet<Ingredient> Ingredients { get; set; } = default!;
        public DbSet<Recipe> Recipes { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //Load connection string from the environment 
            var connectionString = Environment.GetEnvironmentVariable("PG_CONNECTION_STRING");
            //Set Entity Framework to use Npgsql (Postgres)
            if (connectionString == null)
            {
                throw new Exception("No connection string provided");
            }
            optionsBuilder.UseNpgsql(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>()
                        //Recipe has a single user
                        .HasOne(r => r.User)
                        //User has many recipes
                        .WithMany(u => u.Recipes)
                        //Populate the user via the UserID
                        .HasForeignKey(r => r.UserID);

            modelBuilder.Entity<Ingredient>()
                        //Ingredient has a single recipe
                        .HasOne(i => i.Recipe)
                        //Recipe has many Ingredients
                        .WithMany(r => r.Ingredients)
                        //Populate the Recipe via the Recipe
                        .HasForeignKey(i => i.RecipeID);
        }
    }
}

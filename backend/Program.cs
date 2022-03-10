using interview;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

//Gets all recipes for all users
app.MapGet("/api/recipes", RecipesController.GetAllRecipes);

//Gets a specific recipe
app.MapGet("/api/recipes/{rid:guid}", RecipesController.GetRecipeById);

//Gets all recipes for a specific user
app.MapGet("/api/users/{uid:guid}/recipes", RecipesController.GetAllRecipesForUser);

//Post to add a new recipe
app.MapPost("/api/recipes", RecipesController.AddNewRecipe);

// Delete to delete a recipe
// app.MapDelete(...)

//Post to register a new user
app.MapPost("/api/register", UsersController.RegisterUser);

//Post to login an existing user
app.MapPost("/api/login", UsersController.ValidateLogin);

//Get to reset the database
app.MapGet("/api/resetDB", () =>
{
    using (var db = new EFContext())
    {
        //Delete the database, then create it
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var userID = Guid.NewGuid();
        var user = new User() { Id = userID, Name = "Sam", Deleted = false, Password = "p@sswrd" };

        //Creates a new user and recipe
        db.Users.Add(user);
        db.Recipes.Add(new Recipe() { Id = Guid.NewGuid(), Title = "Banana bread", Deleted = false, Description = "Very delicious!", Time = TimeSpan.FromSeconds(600), UserID = userID, User = user });

        db.SaveChanges();

    }
});

// Starts the backend
app.Run("http://0.0.0.0:5000");


using interview;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

//Gets all recipes
app.MapGet("/api/recipes", RecipesController.GetAllRecipes);

//Gets a specific recipe
app.MapGet("/api/recipes/{rid:guid}", RecipesController.GetRecipeById);

//Get recipes by user
app.MapGet("/api/users/{uid:guid}/recipes", RecipesController.GetAllRecipesForUser);

//Post to add a new recipe
app.MapPost("/api/recipes", RecipesController.AddNewRecipe);

// //Delete to delete a recipe
// //app.MapDelete(...)

//Login 
app.MapPost("/api/login", UsersController.ValidateLogin);

app.MapGet("/api/resetDB", () =>
{
    using (var db = new EFContext())
    {
        //Delete the database, then create it
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var userID = Guid.NewGuid();

        db.Users.Add(new User() { Id = userID, Name = "Sam", Deleted = false, Password = "p@sswrd" });
        db.Recipes.Add(new Recipe() { Id = Guid.NewGuid(), Title = "salty tears", Deleted = false, Description = "cook for ever", Time = TimeSpan.FromSeconds(60), UserID = userID });

        db.SaveChanges();

    }
});

// Starts the backend
app.Run("http://0.0.0.0:5000");


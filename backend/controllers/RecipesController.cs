using System.Net;
using Microsoft.EntityFrameworkCore;

namespace interview
{
    public static class RecipesController
    {
        //Returns a list of all the recipes
        public static async Task<IResult> GetAllRecipes()
        {
            using (var db = new EFContext())
            {
                return Results.Json(await db.Recipes.ToListAsync());
            }
        }

        //Returns one recipe specified by it's unique ID
        public static async Task<IResult> GetRecipeById(Guid rid)
        {
            using (var db = new EFContext())
            {
                try
                {
                    return Results.Json(await db.Recipes.Where(r => r.Id == rid)
                                                        .Include(r => r.Ingredients)
                                                        .Include(r => r.User)
                                                        .FirstAsync());
                }
                //If the unique ID does not have a recipe, return Not Found
                catch (Exception ex)
                {
                    return Results.NotFound();
                }
            }
        }

        //Lets user create a new recipe
        public static async Task AddNewRecipe(HttpContext context)
        {
            using (var db = new EFContext())
            {
                var recipe = await context.Request.ReadFromJsonAsync<Recipe>();
                recipe.Id = Guid.NewGuid();
                db.Recipes.Add(recipe);
                db.SaveChanges();

                context.Response.StatusCode = (int)HttpStatusCode.OK;
                await context.Response.WriteAsJsonAsync(recipe);
            }
        }

        //Returns all recipes created by a specific user
        public static async Task<IResult> GetAllRecipesForUser(Guid uid)
        {
            using (var db = new EFContext())
            {
                try
                {
                    return Results.Json(await db.Recipes.Where(u => u.UserID == uid)
                                                        .Include(r => r.Ingredients)
                                                        .Include(r => r.User)
                                                        .ToListAsync());
                }
                //If the user does not exist, return Not Found
                catch (Exception ex)
                {
                    return Results.NotFound();
                }
            }
        }
    }
}
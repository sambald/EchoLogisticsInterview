using System.Net;
using Microsoft.EntityFrameworkCore;

namespace interview
{
    public static class UsersController
    {
        //Validating an existing user logging in
        public static async Task ValidateLogin(HttpContext context)
        {
            using (var db = new EFContext())
            {
                try
                {
                    var user = await context.Request.ReadFromJsonAsync<User>();

                    try
                    {
                        //If user request is empty
                        if (user == null)
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                            return;
                        }
                        //If valid request, match entered username and password to database
                        var match = await db.Users.Where(u => u.Name == user.Name)
                                                  .Where(u => u.Password == user.Password).FirstAsync();

                        context.Response.StatusCode = (int)HttpStatusCode.OK;
                        await context.Response.WriteAsJsonAsync(new
                        {
                            userId = match.Id
                        });

                    }
                    //If user isn't found
                    catch (Exception)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    }
                }
                //If data is invalid
                catch (Exception)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                }
            }
        }

        //Registers a new user
        public static async Task RegisterUser(HttpContext context)
        {
            using (var db = new EFContext())
            {
                //Input validation
                try
                {
                    var user = await context.Request.ReadFromJsonAsync<User>();

                    //If user request is empty
                    if (user == null)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return;
                    }

                    //If username is too short
                    if (user.Name.Length <= 2)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        await context.Response.WriteAsJsonAsync(new { message = "Username too short" });
                        return;
                    }

                    //If password is too short
                    if (user.Password.Length <= 6)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        await context.Response.WriteAsJsonAsync(new { message = "Password too short" });
                        return;
                    }

                    //If passes input validation, create a new user
                    user.Id = Guid.NewGuid();
                    db.Users.Add(user);
                    db.SaveChanges();

                    context.Response.StatusCode = (int)HttpStatusCode.OK;
                    await context.Response.WriteAsJsonAsync(user);

                }
                //If data is invalid
                catch (Exception)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                }
            }
        }
    }
}
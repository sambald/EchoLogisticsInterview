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
                        var match = await db.Users.Where(u => u.Name == user.Name)
                                                  .Where(u => u.Password == user.Password).FirstAsync();

                        context.Response.StatusCode = (int)HttpStatusCode.OK;
                        await context.Response.WriteAsJsonAsync(new
                        {
                            userId = match.Id
                        });

                    }
                    //If user isn't found
                    catch (Exception ex)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    }
                }
                //If data is invalid
                catch (Exception ex)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                }
            }
        }

        //Registers a new user
    }
}
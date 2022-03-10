# EchoLogisticsInterview
**Author:** Sam Bald

This is my interview demo. There's a backend, written in C# that uses Entity Framework Core as the ORM and ASP.Net to serve a simple REST API. The backend API interacts with a postgres database to read/write recipes, users, and ingredients. 

There's a basic frontend (static html/js served by nginx) with three pages: a login page, a page to view all recipes, and a page to view an individual recipe.

## API 
Here are some example routes in the backend API with screenshots. 

`GET: /api/recipes` This route returns a JSON list of all the recipes in the postgres database. 

`GET /api/recipes/{recipeId}` this route returns a single recipe as JSON with ingredients and user information inline.

`POST /api/recipes` Posting a recipe (as JSON) to this route will add it to the database. We do basic validation to ensure that each recipe is linked to a user.  

`POST /api/validateLogin` This route expects a `{ name: "...", password: "..." }` to be posted and will return an OK response if the user exists in the database with a matching password. NOTE: I stored passwords in plaintext here, but in reality you wouldn't want to store any sensitive info in plaintext... 

## Database
I'm using a postgres database (`DB=interview` `user=postgres`) to store data on the recipes, users, and ingredients. I didn't write a schema manually, instead I used Entity Framework Core's "code first" models to generate a schema for the DB automatically. (I have a debug `GET /api/resetDB` route that allows me to delete/re-create the DB.)

## Frontend 
I have a handful of pages for the frontend. I'm by no means a frontend expert, so I googled around for a basic library to use and settled on Material Design Lite (MDL). I use MDL for layout/cards/lists and use vanilla JavaScript to dynamically compose some things based on responses from the backend API.

### Page: `/login.html`
[Frontend Screenshot](docs/frontend_screenshot.png)

### Page: `/recipes.html?userId=<Id>`
[screenshot]

### Page: `/recipe.html?recipeId`
[screenshot]

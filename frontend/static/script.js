//Verifies a valid user
let onLoginClick = () => {

    //Clears error message
    document.getElementById("badRegistration").style.display = "none";

    //Sends username and password inputs to backend
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    }).then(res => {
        //If invalid password, display error message
        if (res.status != 200) {
            document.getElementById("badPassword").style.display = "block";
        }
        //If valid password, log in user and display their recipes
        else {
            document.getElementById("badPassword").style.display = "none";
            res.json().then(json => {
                window.location.assign("/recipes.html?userId=" + json.userId);
            });
        }
    })
};

//Registers a new user
let onRegisterClick = () => {

    //Clears error message
    document.getElementById("badPassword").style.display = "none";

    //Sends username and password inputs to backend
    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    }).then(res => {
        //If invalid username or password, display error message
        if (res.status != 200) {
            document.getElementById("badRegistration").style.display = "block";
            res.json().then(json => {
                if (json.message != null){
                    document.getElementById("badRegistration").innerText = json.message;
                }
                else{
                    document.getElementById("badRegistration").innerText = "Incomplete username or password";
                }
            });
        }
        //If valid username and password, create new user and log them in displaying their recipes
        else {
            document.getElementById("badRegistration").style.display = "none";
            res.json().then(json => {
                window.location.assign("/recipes.html?userId=" + json.id);
            });
        }
    });
};

//If user presses enter key after typing in their password, activates on click event
let onPasswordEnter = (event) => {
    if (event.key === 'Enter') {
        onLoginClick();
    }
};

//Displays all recipes for a user
let buildRecipes = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    fetch("/api/users/" + params.userId + "/recipes", {
        method: "GET"
    }).then(
        res => res.json().then(json => {

            json.forEach(recipe => {

                var listItem = document.createElement('li');
                listItem.className = 'mdl-list__item mdl-list__item--three-line';

                var content = document.createElement('span');
                content.className = 'mdl-list__item-primary-content';

                //Recipe Title
                var title = document.createElement('a');
                title.textContent = recipe.title;
                //Makes title clickable to go to inividual recipe
                title.href = "/recipe.html?recipeId=" + recipe.id;

                //Recipe description
                var description = document.createElement('span');
                description.textContent = recipe.description;
                description.className = 'mdl-list__item-text-body';

                content.appendChild(title);
                content.appendChild(description);
                listItem.appendChild(content);

                document.getElementById('recipe-list').appendChild(listItem);
            });
        })
    );
};

//Displays individual recipe and all it's ingredients
let buildRecipe = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    fetch("/api/recipes/" + params.recipeId, {
        method: "GET"
    }).then(
        res => res.json().then(recipe => {
            //Recipe Title
            document.getElementById('recipeTitle').textContent = recipe.title;
            //Description
            document.getElementById('recipeDescription').textContent = recipe.description;
            //Cook Time
            document.getElementById('recipeTime').textContent = "Prep time: " + recipe.time;

            var list = document.createElement('ul');
            list.className = 'mdl-list';

            //Ingredients
            recipe.ingredients.forEach(ingredient => {

                var listItem = document.createElement('li');
                listItem.className = 'mdl-list__item';

                var content = document.createElement('span');
                content.className = 'mdl-list__item-primary-content';

                content.textContent = ingredient.name + ": " + ingredient.quantity + " " + ingredient.measure;
                listItem.appendChild(content);
                list.appendChild(listItem);
            });

            document.getElementById('anchor').appendChild(list);
        })
    );
};
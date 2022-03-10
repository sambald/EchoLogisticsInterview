//Logs in an existing user
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
        //If invalid username or password, display error message
        if (res.status != 200) {
            document.getElementById("badPassword").style.display = "block";
        }
        //If valid user and password, log in user and display their recipes
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
                if (json.message != null) {
                    document.getElementById("badRegistration").innerText = json.message;
                }
                else {
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

//If user presses enter key after typing in their password, activates log in button
let onPasswordEnter = (event) => {
    if (event.key === 'Enter') {
        onLoginClick();
    }
};

//Displays all recipes for a user
let buildRecipes = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    document.getElementById('create-recipe-button').href = "createRecipe.html?userId=" + params.userId;

    fetch("/api/users/" + params.userId + "/recipes", {
        method: "GET"
    }).then(
        res => res.json().then(json => {

            json.forEach(recipe => {

                const listItem = document.createElement('li');
                listItem.className = 'mdl-list__item mdl-list__item--three-line';

                const content = document.createElement('span');
                content.className = 'mdl-list__item-primary-content';

                //Recipe title
                const title = document.createElement('a');
                title.textContent = recipe.title;
                //Makes title clickable to go to inividual recipe
                title.href = "/recipe.html?recipeId=" + recipe.id;

                //Recipe description
                const description = document.createElement('span');
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
            //Recipe title
            document.getElementById('recipeTitle').textContent = recipe.title;
            //Description
            document.getElementById('recipeDescription').textContent = recipe.description;
            //Cook time
            document.getElementById('recipeTime').textContent = "Prep time: " + recipe.time;

            const list = document.createElement('ul');
            list.className = 'mdl-list';

            //Ingredients
            recipe.ingredients.forEach(ingredient => {

                let listItem = document.createElement('li');
                listItem.className = 'mdl-list__item';

                let content = document.createElement('span');
                content.className = 'mdl-list__item-primary-content';

                content.textContent = ingredient.name + ": " + ingredient.quantity + " " + ingredient.measure;
                listItem.appendChild(content);
                list.appendChild(listItem);
            });

            document.getElementById('anchor').appendChild(list);
        })
    );
};

//Lets user save a new recipe
let saveRecipe = () => {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const ingredientTable = document.getElementById("ingredient-table");

    let recipe = {
        title: document.getElementById("recipeTitle").value,
        description: document.getElementById("recipeDescription").value,
        userId: params.userId,
        time: document.getElementById("recipeTime").value,
        deleted: false,
        ingredients: Array.from(ingredientTable.children).map(c => ({
            name: c.children[0].children[0].children[0].value,
            quantity: c.children[1].children[0].children[0].value,
            measure: c.children[2].children[0].children[0].value,
        }))
    };
    
    console.log(recipe);

    //Sends username and password inputs to backend
    fetch("/api/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            recipe
        )
    }).then(res => {
        //If invalid username or password, display error message
        if (res.status != 200) {
            document.getElementById("badRecipe").style.display = "block";
            res.json().then(json => {
                if (json.message != null) {
                    document.getElementById("badRecipe").innerText = json.message;
                }
                else {
                    document.getElementById("badRecipe").innerText = "Incomplete/bad recipe data";
                }
            });
        }
        //If valid username and password, create new user and log them in displaying their recipes
        else {
            document.getElementById("badRecipe").style.display = "none";
            res.json().then(json => {
                window.location.assign("/recipes.html?userId=" + params.userId);
            });
        }
    });
};

//Directs user back to recipes page if canceling creating a new recipe
let cancelRecipe = () => {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    window.location.assign("/recipes.html?userId=" + params.userId);
};

//Adds another row to create ingredients table
let addIngredientRow = () => {
    const ingredientTable = document.getElementById("ingredient-table");
    const ingredientRow = document.getElementById("ingredient-row").cloneNode(true);

    //Change the labels
    ingredientRow.children[0].children[0].children[1].innerText = "Ingredient " + (ingredientTable.childElementCount + 1);
    ingredientRow.children[1].children[0].children[1].innerText = "Quantity " + (ingredientTable.childElementCount + 1);
    ingredientRow.children[2].children[0].children[1].innerText = "Measure " + (ingredientTable.childElementCount + 1);
    ingredientTable.appendChild(ingredientRow);
    
    //We cloned MDL textfield inputs... had to google around to figure out how to "reset" them
    ingredientRow.children[0].children[0].classList.remove('is-upgraded');
    ingredientRow.children[1].children[0].classList.remove('is-upgraded');
    ingredientRow.children[2].children[0].classList.remove('is-upgraded');
    ingredientRow.children[0].children[0].removeAttribute('data-upgraded');
    ingredientRow.children[1].children[0].removeAttribute('data-upgraded');
    ingredientRow.children[2].children[0].removeAttribute('data-upgraded');
    componentHandler.upgradeDom();

    //Tell MDL to reset the text on all of the inputs
    ingredientRow.children[0].children[0].MaterialTextfield.change('');
    ingredientRow.children[1].children[0].MaterialTextfield.change('');
    ingredientRow.children[2].children[0].MaterialTextfield.change('');
};

//Adds another row to create ingredients table
let removeIngredientRow = () => {

    //Makes sure to not remove the first row
    const ingredientTable = document.getElementById("ingredient-table");
    if (ingredientTable.childElementCount > 1) {
        ingredientTable.removeChild(ingredientTable.lastChild);
    }
};
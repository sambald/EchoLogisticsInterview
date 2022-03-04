let onLoginClick = () => {
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
        if (res.status != 200) {
            document.getElementById("badPassword").style.display="block";
        }
        else{
            document.getElementById("badPassword").style.display="none";
            res.json().then(json => { 
                window.location.assign("/recipes.html?userId=" + json.userId);
            });
        }
    })
};

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

                var title = document.createElement('span');
                title.textContent = recipe.title;

                var description = document.createElement('span');
                description.textContent = recipe.description;
                description.className = 'mdl-list__item-text-body';

                content.appendChild(title);
                content.appendChild(description);
                listItem.appendChild(content);

                document.getElementById('recipe-list').appendChild(
                    listItem
                );
            });
        })
    );
};
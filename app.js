const RecipeApp = (() => {

    let currentFilter = "all";
    let currentSort = "none";

    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            category: "pasta",
            description: "A creamy Italian pasta dish.",
            ingredients: [
                "Spaghetti",
                "Eggs",
                "Parmesan",
                "Pancetta",
                "Black Pepper"
            ],
            steps: [
                "Boil salted water",
                "Cook spaghetti",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Beat eggs",
                        "Mix cheese",
                        "Combine eggs and cheese"
                    ]
                },
                "Cook pancetta",
                "Mix everything"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            category: "curry",
            description: "Spiced creamy tomato chicken curry.",
            ingredients: [
                "Chicken",
                "Yogurt",
                "Tomato puree",
                "Cream",
                "Spices"
            ],
            steps: [
                "Marinate chicken",
                {
                    text: "Prepare curry base",
                    substeps: [
                        "Heat oil",
                        "Add onions",
                        {
                            text: "Add spices",
                            substeps: [
                                "Add cumin",
                                "Add chili powder"
                            ]
                        }
                    ]
                },
                "Cook chicken",
                "Simmer sauce"
            ]
        },
        {
            id: 3,
            title: "Vegetable Fried Rice",
            time: 20,
            difficulty: "easy",
            category: "rice",
            description: "Quick stir-fried rice with vegetables.",
            ingredients: [
                "Rice",
                "Carrots",
                "Beans",
                "Soy sauce",
                "Spring onions"
            ],
            steps: [
                "Heat oil",
                "Add vegetables",
                "Add rice",
                "Stir fry",
                "Serve hot"
            ]
        }
    ];

    const renderSteps = (steps, level = 0) => {
        let html = "<ul>";

        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li class="level-${level}">${step}</li>`;
            } else {
                html += `<li class="level-${level}">${step.text}`;
                if (step.substeps) {
                    html += renderSteps(step.substeps, level + 1);
                }
                html += "</li>";
            }
        });

        html += "</ul>";
        return html;
    };

    const createRecipeCard = (recipe) => {
        return `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>

            <div class="recipe-meta">
                <span>⏱ ${recipe.time} mins</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>

            <p>${recipe.description}</p>

            <div class="card-buttons">
                <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
                    Show Steps
                </button>
                <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
                    Show Ingredients
                </button>
            </div>

            <div class="steps-container" data-id="${recipe.id}">
                ${renderSteps(recipe.steps)}
            </div>

            <div class="ingredients-container" data-id="${recipe.id}">
                <ul>
                    ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
                </ul>
            </div>
        </div>
        `;
    };

    const getFilteredAndSortedRecipes = () => {

        let filtered = recipes.filter(recipe =>
            currentFilter === "all" || recipe.category === currentFilter
        );

        if (currentSort === "time") {
            filtered.sort((a, b) => a.time - b.time);
        }

        if (currentSort === "difficulty") {
            const order = { easy: 1, medium: 2, hard: 3 };
            filtered.sort((a, b) =>
                order[a.difficulty] - order[b.difficulty]
            );
        }

        return filtered;
    };

    const renderRecipes = () => {
        const container = document.getElementById("recipe-container");
        const recipesToRender = getFilteredAndSortedRecipes();

        container.innerHTML = recipesToRender
            .map(recipe => createRecipeCard(recipe))
            .join("");
    };

    const handleClick = (e) => {

        if (!e.target.classList.contains("toggle-btn")) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.type;

        const container = document.querySelector(
            `.${type}-container[data-id="${id}"]`
        );

        container.classList.toggle("visible");

        if (container.classList.contains("visible")) {
            e.target.textContent = "Hide " + type;
        } else {
            e.target.textContent = "Show " + type;
        }
    };

    const init = () => {

        renderRecipes();

        document
            .getElementById("recipe-container")
            .addEventListener("click", handleClick);

        document
            .getElementById("filter-select")
            .addEventListener("change", (e) => {
                currentFilter = e.target.value;
                renderRecipes();
            });

        document
            .getElementById("sort-select")
            .addEventListener("change", (e) => {
                currentSort = e.target.value;
                renderRecipes();
            });

        console.log("RecipeApp Ready!");
    };

    return { init };

})();

RecipeApp.init();
// ==============================================
// IIFE MODULE PATTERN
// ==============================================
const RecipeApp = (() => {

    // ==============================================
    // RECIPE DATA
    // ==============================================
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
            ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black Pepper"],
            steps: [
                "Boil salted water",
                "Cook spaghetti",
                {
                    text: "Prepare sauce",
                    substeps: ["Beat eggs", "Mix cheese", "Combine eggs & cheese"]
                },
                "Cook pancetta",
                "Mix everything together"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
            ingredients: ["Chicken", "Yogurt", "Tomato puree", "Cream", "Spices"],
            steps: [
                "Marinate chicken",
                {
                    text: "Prepare curry base",
                    substeps: [
                        "Heat oil",
                        "Add onions",
                        { text: "Add spices", substeps: ["Add cumin", "Add chili powder"] }
                    ]
                },
                "Cook chicken",
                "Simmer sauce"
            ]
        },
        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Buttery, flaky French pastries.",
            ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar"],
            steps: [
                "Prepare dough",
                "Fold butter layers",
                "Roll and shape",
                "Bake until golden"
            ]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables with feta cheese.",
            ingredients: ["Tomatoes", "Cucumber", "Feta", "Olives", "Olive oil"],
            steps: [
                "Chop vegetables",
                "Add feta and olives",
                "Drizzle olive oil",
                "Toss and serve"
            ]
        },
        {
            id: 5,
            title: "Beef Wellington",
            time: 120,
            difficulty: "hard",
            description: "Tender beef wrapped in puff pastry.",
            ingredients: ["Beef fillet", "Mushrooms", "Puff pastry", "Mustard"],
            steps: [
                "Sear beef",
                "Prepare mushroom duxelles",
                "Wrap in pastry",
                "Bake until golden"
            ]
        },
        {
            id: 6,
            title: "Vegetable Stir Fry",
            time: 20,
            difficulty: "easy",
            description: "Colorful mixed vegetables in savory sauce.",
            ingredients: ["Broccoli", "Carrots", "Soy sauce", "Garlic"],
            steps: [
                "Heat oil",
                "Add vegetables",
                "Add sauce",
                "Stir fry quickly"
            ]
        },
        {
            id: 7,
            title: "Pad Thai",
            time: 30,
            difficulty: "medium",
            description: "Thai stir-fried rice noodles.",
            ingredients: ["Rice noodles", "Shrimp", "Peanuts", "Tamarind sauce"],
            steps: [
                "Soak noodles",
                "Cook shrimp",
                "Add sauce",
                "Mix everything together"
            ]
        },
        {
            id: 8,
            title: "Margherita Pizza",
            time: 60,
            difficulty: "medium",
            description: "Classic Italian pizza.",
            ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
            steps: [
                "Prepare dough",
                "Add toppings",
                "Bake in oven",
                "Garnish with basil"
            ]
        }
    ];

    // ==============================================
    // STATE
    // ==============================================
    let currentFilter = "all";
    let currentSort = "none";
    let searchQuery = "";
    let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
    let debounceTimer = null;

    // ==============================================
    // DOM REFERENCES
    // ==============================================
    const recipeContainer = document.querySelector("#recipe-container");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");
    const searchInput = document.querySelector("#search-input");
    const clearSearchBtn = document.querySelector("#clear-search");
    const recipeCounter = document.querySelector("#recipe-counter");

    // ==============================================
    // RENDER RECURSIVE STEPS
    // ==============================================
    const renderSteps = (steps, level = 0) => {
        let html = "<ul>";
        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li class="level-${level}">${step}</li>`;
            } else {
                html += `<li class="level-${level}">${step.text}`;
                if (step.substeps) html += renderSteps(step.substeps, level + 1);
                html += "</li>";
            }
        });
        html += "</ul>";
        return html;
    };

    // ==============================================
    // CREATE CARD
    // ==============================================
    const createRecipeCard = recipe => {
        const isFav = favorites.includes(recipe.id);

        return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>

            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>

            <p>${recipe.description}</p>

            <div class="card-buttons">
                <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">Show Steps</button>
                <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">Show Ingredients</button>

                <button class="favorite-btn ${isFav ? "active" : ""}"
                    data-favid="${recipe.id}">
                    ❤️
                </button>
            </div>

            <div class="steps-container" data-id="${recipe.id}">
                ${renderSteps(recipe.steps)}
            </div>

            <div class="ingredients-container" data-id="${recipe.id}">
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
            </div>
        </div>`;
    };

    // ==============================================
    // SEARCH FILTER
    // ==============================================
    const searchFilter = (recipes, query) => {
        if (!query.trim()) return recipes;

        const lower = query.toLowerCase();

        return recipes.filter(recipe => {
            const titleMatch = recipe.title.toLowerCase().includes(lower);

            const ingredientMatch = recipe.ingredients.some(i =>
                i.toLowerCase().includes(lower)
            );

            const descriptionMatch = recipe.description.toLowerCase().includes(lower);

            return titleMatch || ingredientMatch || descriptionMatch;
        });
    };

    // ==============================================
    // FAVORITES FILTER
    // ==============================================
    const favoritesFilter = recipes =>
        recipes.filter(r => favorites.includes(r.id));

    // ==============================================
    // DIFFICULTY + QUICK FILTERS
    // ==============================================
    const filterByDifficulty = (recipes, difficulty) => {
        if (difficulty === "all") return recipes;
        return recipes.filter(r => r.difficulty === difficulty);
    };

    const filterByQuick = recipes => recipes.filter(r => r.time < 30);

    const applyFilter = (recipes, type) => {
        if (type === "quick") return filterByQuick(recipes);
        if (type === "favorites") return favoritesFilter(recipes);
        return filterByDifficulty(recipes, type);
    };

    // ==============================================
    // SORT
    // ==============================================
    const sortByName = recipes => [...recipes].sort((a, b) => a.title.localeCompare(b.title));

    const sortByTime = recipes => [...recipes].sort((a, b) => a.time - b.time);

    const applySort = (recipes, type) => {
        if (type === "name") return sortByName(recipes);
        if (type === "time") return sortByTime(recipes);
        return recipes;
    };

    // ==============================================
    // UPDATE COUNTER (NEW)
    // ==============================================
    const updateCounter = visible => {
        recipeCounter.textContent = `Showing ${visible} of ${recipes.length} recipes`;
    };

    // ==============================================
    // RENDER DISPLAY (CORE PIPELINE)
    // ==============================================
    const updateDisplay = () => {
        let result = recipes;

        result = searchFilter(result, searchQuery);
        result = applyFilter(result, currentFilter);
        result = applySort(result, currentSort);

        recipeContainer.innerHTML = result.map(createRecipeCard).join("");

        updateCounter(result.length);
    };

    // ==============================================
    // FAVORITES MANAGEMENT
    // ==============================================
    const toggleFavorite = id => {
        id = Number(id);
        if (favorites.includes(id)) {
            favorites = favorites.filter(f => f !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
        updateDisplay();
    };

    // ==============================================
    // EVENT HANDLERS
    // ==============================================
    recipeContainer.addEventListener("click", e => {
        // Toggle steps/ingredients
        if (e.target.classList.contains("toggle-btn")) {
            const id = e.target.dataset.id;
            const type = e.target.dataset.type;

            const box = document.querySelector(`.${type}-container[data-id="${id}"]`);
            box.classList.toggle("visible");

            e.target.textContent = box.classList.contains("visible")
                ? `Hide ${type}`
                : `Show ${type}`;
        }

        // Favorite button
        if (e.target.dataset.favid) {
            toggleFavorite(e.target.dataset.favid);
        }
    });

    // Filters
    filterButtons.forEach(btn =>
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentFilter = btn.dataset.filter;
            updateDisplay();
        })
    );

    // Sorts
    sortButtons.forEach(btn =>
        btn.addEventListener("click", () => {
            sortButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentSort = btn.dataset.sort;
            updateDisplay();
        })
    );

    // Search + Debounce
    searchInput.addEventListener("input", () => {
        clearSearchBtn.classList.toggle("hidden", searchInput.value.trim() === "");

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = searchInput.value.trim();
            updateDisplay();
        }, 300);
    });

    // Clear search
    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.classList.add("hidden");
        updateDisplay();
    });

    // ==============================================
    // INIT
    // ==============================================
    const init = () => {
        console.log("Recipe App Loaded ✔️");
        updateDisplay();
    };

    init();

    return {};

})();
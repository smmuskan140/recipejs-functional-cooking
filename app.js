// ===============================
// IIFE WRAPPER (NEW - Part 3)
// ===============================
const RecipeApp = (() => {

// ===============================
// Recipe Data (UPDATED WITH STEPS + INGREDIENTS)
// ===============================
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta",
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
        category: "curry",
        ingredients: ["Chicken", "Yogurt", "Tomato puree", "Cream", "Spices"],
        steps: [
            "Marinate chicken",
            {
                text: "Prepare curry base",
                substeps: [
                    "Heat oil",
                    "Add onions",
                    {
                        text: "Add spices",
                        substeps: ["Add cumin", "Add chili powder"]
                    }
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
        category: "baking",
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
        category: "salad",
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
        category: "meat",
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
        category: "vegetarian",
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
        category: "noodles",
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
        category: "pizza",
        ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
        steps: [
            "Prepare dough",
            "Add toppings",
            "Bake in oven",
            "Garnish with basil"
        ]
    }
];

// ===============================
// STATE
// ===============================
let currentFilter = "all";
let currentSort = "none";

// ===============================
// DOM REFERENCES
// ===============================
const recipeContainer = document.querySelector('#recipe-container');
const filterButtons = document.querySelectorAll('[data-filter]');
const sortButtons = document.querySelectorAll('[data-sort]');

// ===============================
// RECURSIVE STEP RENDER (NEW)
// ===============================
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

// ===============================
// CREATE RECIPE CARD (UPDATED)
// ===============================
const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
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
                    ${recipe.ingredients.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
        </div>
    `;
};

// ===============================
// (ALL YOUR ORIGINAL FILTER + SORT CODE REMAINS SAME)
// ===============================

const filterByDifficulty = (recipes, difficulty) => {
    if (difficulty === "all") return recipes;
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

const filterByQuickTime = (recipes) => {
    return recipes.filter(recipe => recipe.time < 30);
};

const applyFilter = (recipes, filterType) => {
    if (filterType === "quick") return filterByQuickTime(recipes);
    return filterByDifficulty(recipes, filterType);
};

const sortByName = (recipes) => {
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
};

const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) => a.time - b.time);
};

const applySort = (recipes, sortType) => {
    if (sortType === "name") return sortByName(recipes);
    if (sortType === "time") return sortByTime(recipes);
    return recipes;
};

const updateDisplay = () => {
    let updatedRecipes = recipes;
    updatedRecipes = applyFilter(updatedRecipes, currentFilter);
    updatedRecipes = applySort(updatedRecipes, currentSort);
    renderRecipes(updatedRecipes);
};

const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender
        .map(createRecipeCard)
        .join('');
};

// ===============================
// EVENT DELEGATION (NEW)
// ===============================
recipeContainer.addEventListener("click", (e) => {

    if (!e.target.classList.contains("toggle-btn")) return;

    const id = e.target.dataset.id;
    const type = e.target.dataset.type;

    const container = document.querySelector(
        `.${type}-container[data-id="${id}"]`
    );

    container.classList.toggle("visible");

    e.target.textContent = container.classList.contains("visible")
        ? `Hide ${type}`
        : `Show ${type}`;
});

// ===============================
// ORIGINAL BUTTON EVENTS (UNCHANGED)
// ===============================
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        updateDisplay();
    });
});

sortButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentSort = button.dataset.sort;
        updateDisplay();
    });
});

// ===============================
// INIT
// ===============================
updateDisplay();

return {};

})();
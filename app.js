// ===============================
// Recipe Data
// ===============================
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta"
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry"
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking"
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad"
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat"
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian"
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles"
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza"
    }
];

// ===============================
// STATE MANAGEMENT
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
// CREATE RECIPE CARD
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
        </div>
    `;
};

// ===============================
// RENDER RECIPES
// ===============================
const renderRecipes = (recipesToRender) => {
    const recipeCardsHTML = recipesToRender
        .map(createRecipeCard)
        .join('');

    recipeContainer.innerHTML = recipeCardsHTML;
};

// ===============================
// PURE FILTER FUNCTIONS
// ===============================

const filterByDifficulty = (recipes, difficulty) => {
    if (difficulty === "all") return recipes;
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

const filterByQuickTime = (recipes) => {
    return recipes.filter(recipe => recipe.time < 30);
};

const applyFilter = (recipes, filterType) => {
    if (filterType === "quick") {
        return filterByQuickTime(recipes);
    }
    return filterByDifficulty(recipes, filterType);
};

// ===============================
// PURE SORT FUNCTIONS
// ===============================

const sortByName = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.title.localeCompare(b.title)
    );
};

const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.time - b.time
    );
};

const applySort = (recipes, sortType) => {
    if (sortType === "name") return sortByName(recipes);
    if (sortType === "time") return sortByTime(recipes);
    return recipes;
};

// ===============================
// UPDATE DISPLAY (MAIN FUNCTION)
// ===============================

const updateDisplay = () => {
    let updatedRecipes = recipes;

    updatedRecipes = applyFilter(updatedRecipes, currentFilter);
    updatedRecipes = applySort(updatedRecipes, currentSort);

    console.log(
        `Displaying ${updatedRecipes.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
    );

    renderRecipes(updatedRecipes);
};

// ===============================
// UPDATE ACTIVE BUTTON STYLES
// ===============================

const updateActiveButtons = () => {
    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });

    sortButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.sort === currentSort
        );
    });
};

// ===============================
// EVENT LISTENERS
// ===============================

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        updateActiveButtons();
        updateDisplay();
    });
});

sortButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentSort = button.dataset.sort;
        updateActiveButtons();
        updateDisplay();
    });
});

// ===============================
// INITIALIZE APP
// ===============================

updateDisplay();
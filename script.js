// Sample recipe data (in a real app, this would come from a backend)
const recipes = [
  {
    id: 1,
    title: "Creamy Garlic Pasta",
    category: "dinner",
    prepTime: "15 min",
    cookTime: "20 min",
    servings: 4,
    rating: 4.8,
    difficulty: "Easy",
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    description: "A rich and creamy pasta dish with garlic and parmesan.",
    ingredients: [
      "8 oz fettuccine pasta",
      "3 tbsp butter",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1 cup grated parmesan cheese",
      "Salt and pepper to taste",
      "Fresh parsley for garnish"
    ],
    instructions: [
      "Cook pasta according to package directions until al dente. Reserve 1/2 cup pasta water before draining.",
      "In a large skillet, melt butter over medium heat. Add minced garlic and sauté for 1-2 minutes until fragrant.",
      "Pour in heavy cream and bring to a simmer. Cook for 3-4 minutes until slightly thickened.",
      "Reduce heat to low and gradually whisk in parmesan cheese until melted and smooth.",
      "Add drained pasta to the sauce and toss to coat. If needed, add reserved pasta water to thin the sauce.",
      "Season with salt and pepper to taste. Garnish with fresh parsley before serving."
    ],
    nutrition: {
      calories: 520,
      protein: "15g",
      carbs: "42g",
      fat: "32g",
      fiber: "2g"
    }
  },
  {
    id: 2,
    title: "Blueberry Pancakes",
    category: "breakfast",
    prepTime: "10 min",
    cookTime: "15 min",
    servings: 3,
    rating: 4.5,
    difficulty: "Easy",
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    description: "Fluffy pancakes loaded with fresh blueberries.",
    ingredients: [
      "1 1/2 cups all-purpose flour",
      "3 tbsp sugar",
      "1 tbsp baking powder",
      "1/2 tsp salt",
      "1 1/4 cups milk",
      "1 egg",
      "3 tbsp melted butter",
      "1 cup fresh blueberries",
      "Maple syrup for serving"
    ],
    instructions: [
      "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
      "In another bowl, whisk together milk, egg, and melted butter.",
      "Pour wet ingredients into dry ingredients and stir until just combined. Fold in blueberries.",
      "Heat a griddle or non-stick pan over medium heat. Lightly grease with butter or oil.",
      "Pour 1/4 cup batter for each pancake. Cook until bubbles form on top, then flip and cook until golden brown.",
      "Serve warm with maple syrup."
    ],
    nutrition: {
      calories: 320,
      protein: "8g",
      carbs: "48g",
      fat: "12g",
      fiber: "2g"
    }
  },
  {
    id: 3,
    title: "Avocado Toast",
    category: "breakfast",
    prepTime: "5 min",
    cookTime: "5 min",
    servings: 1,
    rating: 4.2,
    difficulty: "Easy",
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    description: "Simple and nutritious avocado toast with various toppings.",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "1/2 lemon, juiced",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "2 eggs (optional)",
      "Cherry tomatoes, halved (optional)",
      "Microgreens or sprouts (optional)"
    ],
    instructions: [
      "Toast the bread until golden and crisp.",
      "Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.",
      "Add lemon juice, salt, and pepper. Mash with a fork to desired consistency.",
      "Spread the avocado mixture evenly on the toast.",
      "If desired, top with fried or poached eggs, tomatoes, microgreens, and a sprinkle of red pepper flakes."
    ],
    nutrition: {
      calories: 280,
      protein: "6g",
      carbs: "30g",
      fat: "16g",
      fiber: "8g"
    }
  },
  {
    id: 4,
    title: "Chocolate Chip Cookies",
    category: "dessert",
    prepTime: "15 min",
    cookTime: "12 min",
    servings: 24,
    rating: 4.9,
    difficulty: "Medium",
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80",
    description: "Classic chocolate chip cookies with a soft center and crispy edges.",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups semi-sweet chocolate chips",
      "1 cup chopped nuts (optional)"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a small bowl, mix flour, baking soda, and salt.",
      "In a large bowl, beat butter, granulated sugar, and brown sugar until creamy.",
      "Add eggs one at a time, then stir in vanilla.",
      "Gradually blend in the flour mixture.",
      "Stir in chocolate chips and nuts if using.",
      "Drop by rounded tablespoon onto ungreased baking sheets.",
      "Bake for 9 to 11 minutes or until golden brown.",
      "Let stand for 2 minutes, then remove to wire racks to cool completely."
    ],
    nutrition: {
      calories: 150,
      protein: "2g",
      carbs: "19g",
      fat: "8g",
      fiber: "1g"
    }
  },
  {
    id: 5,
    title: "Chicken Caesar Salad",
    category: "lunch",
    prepTime: "15 min",
    cookTime: "10 min",
    servings: 2,
    rating: 4.3,
    difficulty: "Easy",
    isVegetarian: false,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    description: "Fresh romaine lettuce with grilled chicken, croutons, and Caesar dressing.",
    ingredients: [
      "2 boneless, skinless chicken breasts",
      "1 tbsp olive oil",
      "Salt and pepper to taste",
      "1 large head romaine lettuce, chopped",
      "1/2 cup Caesar dressing",
      "1/2 cup croutons",
      "1/4 cup grated parmesan cheese",
      "Lemon wedges for serving"
    ],
    instructions: [
      "Season chicken breasts with salt and pepper.",
      "Heat olive oil in a skillet over medium-high heat. Cook chicken for 5-6 minutes per side until cooked through.",
      "Let chicken rest for 5 minutes, then slice into strips.",
      "In a large bowl, toss romaine lettuce with Caesar dressing.",
      "Divide the lettuce between two plates, top with sliced chicken, croutons, and parmesan cheese.",
      "Serve with lemon wedges on the side."
    ],
    nutrition: {
      calories: 420,
      protein: "35g",
      carbs: "12g",
      fat: "25g",
      fiber: "3g"
    }
  },
  {
    id: 6,
    title: "Vegetable Lasagna",
    category: "dinner",
    prepTime: "30 min",
    cookTime: "45 min",
    servings: 8,
    rating: 4.7,
    difficulty: "Medium",
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    description: "A hearty vegetable lasagna loaded with fresh vegetables, creamy ricotta, and melted mozzarella.",
    ingredients: [
      "12 lasagna noodles",
      "2 tbsp olive oil",
      "1 large onion, diced",
      "3 cloves garlic, minced",
      "2 zucchini, diced",
      "1 red bell pepper, diced",
      "1 yellow bell pepper, diced",
      "8 oz mushrooms, sliced",
      "2 cups fresh spinach",
      "24 oz marinara sauce",
      "15 oz ricotta cheese",
      "1 egg",
      "1/4 cup fresh basil, chopped",
      "2 cups shredded mozzarella cheese",
      "1/2 cup grated parmesan cheese",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Cook lasagna noodles according to package directions. Drain and set aside.",
      "In a large skillet, heat olive oil over medium heat. Add onion and garlic, sauté for 3 minutes until softened.",
      "Add zucchini, bell peppers, and mushrooms. Cook for 5-7 minutes until vegetables are tender. Add spinach and cook until wilted.",
      "Season vegetables with salt and pepper. Remove from heat and set aside.",
      "In a bowl, mix ricotta cheese, egg, half of the basil, and 1/4 cup parmesan cheese.",
      "Spread 1/2 cup marinara sauce in the bottom of a 9x13 inch baking dish.",
      "Layer 4 lasagna noodles, 1/3 of the ricotta mixture, 1/3 of the vegetable mixture, 1/3 of the remaining marinara sauce, and 1/3 of the mozzarella.",
      "Repeat layers twice more, ending with mozzarella and remaining parmesan on top.",
      "Cover with foil and bake for 25 minutes. Remove foil and bake for an additional 15-20 minutes until cheese is bubbly and golden.",
      "Let stand for 10 minutes before serving. Garnish with remaining fresh basil."
    ],
    nutrition: {
      calories: 410,
      protein: "22g",
      carbs: "42g",
      fat: "18g",
      fiber: "6g"
    }
  }
];

// DOM Elements
const recipesContainer = document.getElementById('recipes-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const featuredCard = document.querySelector('.featured-card');
const addRecipeBtn = document.getElementById('add-recipe');
const modal = document.getElementById('recipe-modal');
const recipeDetailContainer = document.getElementById('recipe-detail-container');
const closeModal = document.querySelector('.close-modal');
const addRecipeModal = document.getElementById('add-recipe-modal');
const closeAddModal = document.querySelector('.close-add-modal');
const recipeForm = document.getElementById('recipe-form');
const cancelAddBtn = document.getElementById('cancel-add');
const savedRecipesSection = document.getElementById('saved-recipes-section');
const savedRecipesContainer = document.getElementById('saved-recipes-container');
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const overlay = document.getElementById('overlay');

// Initialize saved recipes array from localStorage or empty array
let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

// Initialize comments array in localStorage if it doesn't exist
let recipeComments = JSON.parse(localStorage.getItem('recipeComments')) || {};

// Initialize the page
function init() {
  displayRecipes(recipes);
  displayFeaturedRecipe();
  displaySavedRecipes();
  setupModalListeners();
  setupAddRecipeListeners();
  setupMenuToggle();
  setupSearchFunctionality();
  setupScrollToTop();
  displayWelcomeMessage();
  
  // Add sample comments if none exist
  addSampleComments();
  
  // Fix any scrolling issues on load
  fixScrollingIssues();
  
  // Event listeners for filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilter);
  });
  
  console.log('Initialization complete');
}

// Setup Add Recipe Modal Listeners
function setupAddRecipeListeners() {
  // Open add recipe modal
  addRecipeBtn.addEventListener('click', () => {
    addRecipeModal.classList.add('show');
    document.body.classList.add('modal-open');
  });
  
  // Close add recipe modal
  closeAddModal.addEventListener('click', closeAddRecipeModal);
  
  // Close when clicking cancel button
  cancelAddBtn.addEventListener('click', closeAddRecipeModal);
  
  // Close when clicking outside the modal
  window.addEventListener('click', (e) => {
    if (e.target === addRecipeModal) {
      closeAddRecipeModal();
    }
  });
  
  // Handle form submission
  recipeForm.addEventListener('submit', handleAddRecipe);
}

// Close add recipe modal
function closeAddRecipeModal() {
  addRecipeModal.classList.remove('show');
  document.body.classList.remove('modal-open'); // Ensure body scrolling is restored
  recipeForm.reset();
}

// Handle add recipe form submission
function handleAddRecipe(e) {
  e.preventDefault();
  
  // Get form values
  const title = document.getElementById('recipe-title').value;
  const category = document.getElementById('recipe-category').value;
  const difficulty = document.getElementById('recipe-difficulty').value;
  const prepTime = document.getElementById('recipe-prep-time').value;
  const cookTime = document.getElementById('recipe-cook-time').value;
  const servings = document.getElementById('recipe-servings').value;
  const image = document.getElementById('recipe-image').value;
  const description = document.getElementById('recipe-description').value;
  const isVegetarian = document.getElementById('recipe-vegetarian').value === 'true';
  
  // Get ingredients and instructions (split by new line)
  const ingredients = document.getElementById('recipe-ingredients').value
    .split('\n')
    .filter(item => item.trim() !== '');
    
  const instructions = document.getElementById('recipe-instructions').value
    .split('\n')
    .filter(item => item.trim() !== '');
  
  // Get nutrition info
  const nutrition = {
    calories: document.getElementById('recipe-calories').value,
    protein: document.getElementById('recipe-protein').value,
    carbs: document.getElementById('recipe-carbs').value,
    fat: document.getElementById('recipe-fat').value,
    fiber: document.getElementById('recipe-fiber').value
  };
  
  // Create new recipe object
  const newRecipe = {
    id: recipes.length + 1,
    title,
    category,
    prepTime,
    cookTime,
    servings,
    rating: 0, // New recipes start with 0 rating
    difficulty,
    isVegetarian,
    image,
    description,
    ingredients,
    instructions,
    nutrition
  };
  
  // Add to recipes array
  recipes.unshift(newRecipe);
  
  // Update display
  displayRecipes(recipes);
  
  // If this is the first recipe or has highest rating, update featured
  if (recipes.length === 1 || newRecipe.rating > recipes[1].rating) {
    displayFeaturedRecipe();
  }
  
  // Close modal and reset form
  closeAddRecipeModal();
  
  // Show success message
  showNotification('Recipe added successfully!');
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  document.body.appendChild(notification);
  
  // Add active class after a small delay (for animation)
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300); // Wait for fade out animation
  }, 5000);
  
  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300); // Wait for fade out animation
  });
}

// Update welcome message if it exists
function displayWelcomeMessage() {
  // Check if this is the first visit
  const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
  
  if (!hasVisitedBefore) {
    // Show welcome message
    showNotification('Welcome to Entipal Collection! Discover and save your favorite recipes.');
    
    // Set flag in localStorage
    localStorage.setItem('hasVisitedBefore', 'true');
  }
}

// Display all recipes
function displayRecipes(recipesToDisplay) {
  recipesContainer.innerHTML = '';
  
  if (recipesToDisplay.length === 0) {
    recipesContainer.innerHTML = '<p class="no-results">No recipes found. Try a different search.</p>';
    return;
  }
  
  recipesToDisplay.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    recipesContainer.appendChild(recipeCard);
  });
}

// Create a recipe card element - Simplified elegant design
function createRecipeCard(recipe, isSavedSection = false) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  
  // Generate stars based on rating
  const stars = generateStars(recipe.rating);
  
  // Check if this recipe is saved
  const isSaved = savedRecipes.includes(recipe.id);
  const bookmarkClass = isSaved ? 'fas fa-bookmark saved' : 'far fa-bookmark';
  
  // Determine vegetarian status
  const vegClass = recipe.isVegetarian ? 'vegetarian' : 'non-vegetarian';
  const vegIcon = recipe.isVegetarian ? 'fas fa-leaf' : 'fas fa-drumstick-bite';
  
  card.innerHTML = `
    <div class="recipe-image" data-category="${recipe.category}">
      <div class="veg-badge ${vegClass}">
        <i class="${vegIcon}"></i>
      </div>
      <img src="${recipe.image}" alt="${recipe.title}">
    </div>
    <div class="recipe-content">
      <h3 class="recipe-title">${recipe.title}</h3>
      <div class="recipe-meta">
        <span><i class="far fa-clock"></i> ${recipe.prepTime} prep</span>
        <span><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
      </div>
      <p class="recipe-description">${recipe.description}</p>
      <div class="recipe-footer">
        <div class="rating">${stars}</div>
        <div class="recipe-actions">
          <button title="${isSaved ? 'Unsave recipe' : 'Save recipe'}" class="save-recipe-btn">
            <i class="${bookmarkClass} bookmark-icon"></i>
          </button>
          <button title="Share recipe"><i class="fas fa-share-alt"></i></button>
        </div>
      </div>
    </div>
  `;
  
  // Add click event to view recipe details (except for the save button)
  card.addEventListener('click', (e) => {
    // Don't trigger recipe details if clicking the save button
    if (!e.target.closest('.save-recipe-btn')) {
      showRecipeDetails(recipe);
    }
  });
  
  // Add click event for save button
  const saveBtn = card.querySelector('.save-recipe-btn');
  saveBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent opening recipe details
    toggleSaveRecipe(recipe.id);
    
    // Update the bookmark icon
    const bookmarkIcon = saveBtn.querySelector('.bookmark-icon');
    if (savedRecipes.includes(recipe.id)) {
      bookmarkIcon.className = 'fas fa-bookmark saved bookmark-icon';
      saveBtn.title = 'Unsave recipe';
    } else {
      bookmarkIcon.className = 'far fa-bookmark bookmark-icon';
      saveBtn.title = 'Save recipe';
    }
    
    // If in saved section and unsaving, remove the card
    if (isSavedSection && !savedRecipes.includes(recipe.id)) {
      card.remove();
      if (savedRecipes.length === 0) {
        displaySavedRecipes(); // Redisplay to show the "no saved recipes" message
      }
    }
  });
  
  return card;
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

// Display featured recipe - Simplified elegant design
function displayFeaturedRecipe() {
  // Get the highest rated recipe
  const featured = [...recipes].sort((a, b) => b.rating - a.rating)[0];
  
  // Determine vegetarian status
  const vegClass = featured.isVegetarian ? 'vegetarian' : 'non-vegetarian';
  const vegIcon = featured.isVegetarian ? 'fas fa-leaf' : 'fas fa-drumstick-bite';
  const vegText = featured.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian';
  
  featuredCard.innerHTML = `
    <div class="featured-image">
      <div class="veg-badge ${vegClass}">
        <i class="${vegIcon}"></i>
      </div>
      <img src="${featured.image}" alt="${featured.title}">
    </div>
    <div class="featured-content">
      <h3>${featured.title}</h3>
      <div class="rating">${generateStars(featured.rating)}</div>
      
      <div class="veg-indicator ${vegClass}">
        <i class="${vegIcon}"></i> ${vegText}
      </div>
      
      <div class="featured-meta">
        <p><i class="far fa-clock"></i> Prep: ${featured.prepTime}</p>
        <p><i class="fas fa-fire"></i> Cook: ${featured.cookTime}</p>
        <p><i class="fas fa-utensils"></i> Servings: ${featured.servings}</p>
        <p><i class="fas fa-chart-line"></i> Difficulty: ${featured.difficulty || 'Medium'}</p>
      </div>
      
      <p class="featured-description">${featured.description}</p>
      
      <button class="view-recipe-btn">
        <i class="fas fa-utensils"></i> View Full Recipe
      </button>
    </div>
  `;
  
  // Add event listener to the View Full Recipe button
  const viewRecipeBtn = featuredCard.querySelector('.view-recipe-btn');
  viewRecipeBtn.addEventListener('click', () => {
    showRecipeDetails(featured);
  });
}

// Handle search functionality - Fixed version
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  console.log('Searching for:', searchTerm);
  
  if (searchTerm === '') {
    displayRecipes(recipes);
    return;
  }
  
  // Improved search to check title, description, ingredients, and category
  const filteredRecipes = recipes.filter(recipe => {
    // Check title and description
    const titleMatch = recipe.title.toLowerCase().includes(searchTerm);
    const descriptionMatch = recipe.description.toLowerCase().includes(searchTerm);
    
    // Check ingredients if they exist
    let ingredientsMatch = false;
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      ingredientsMatch = recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      );
    }
    
    // Check category
    const categoryMatch = recipe.category && recipe.category.toLowerCase().includes(searchTerm);
    
    return titleMatch || descriptionMatch || ingredientsMatch || categoryMatch;
  });
  
  console.log('Found', filteredRecipes.length, 'matching recipes');
  
  // Display results
  displayRecipes(filteredRecipes);
  
  // Scroll to results
  document.querySelector('.recipe-grid').scrollIntoView({ behavior: 'smooth' });
  
  // Show search feedback
  if (filteredRecipes.length === 0) {
    // No results found
    recipesContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-blue); margin-bottom: 15px;"></i>
        <h3>No recipes found</h3>
        <p>We couldn't find any recipes matching "${searchTerm}"</p>
        <button class="clear-search-btn" onclick="clearSearch()">Clear Search</button>
      </div>
    `;
  } else {
    // Show search results count above results
    const resultsHeading = document.querySelector('.recipe-grid h2');
    resultsHeading.textContent = `Search Results (${filteredRecipes.length})`;
    
    // Add clear search button
    if (!document.querySelector('.clear-search-btn-container')) {
      const clearBtnContainer = document.createElement('div');
      clearBtnContainer.className = 'clear-search-btn-container';
      clearBtnContainer.innerHTML = `
        <button class="clear-search-btn" onclick="clearSearch()">
          <i class="fas fa-times"></i> Clear Search
        </button>
      `;
      resultsHeading.after(clearBtnContainer);
    }
  }
}

// Add clear search function
function clearSearch() {
  // Clear search input
  searchInput.value = '';
  
  // Reset display
  displayRecipes(recipes);
  
  // Reset heading
  const resultsHeading = document.querySelector('.recipe-grid h2');
  resultsHeading.textContent = 'All Recipes';
  
  // Remove clear search button if it exists
  const clearBtnContainer = document.querySelector('.clear-search-btn-container');
  if (clearBtnContainer) {
    clearBtnContainer.remove();
  }
}

// Make sure the search button and input are properly set up
function setupSearchFunctionality() {
  // Ensure search elements exist
  if (!searchInput || !searchBtn) {
    console.error('Search elements not found');
    return;
  }
  
  // Add event listeners
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  console.log('Search functionality set up');
}

// Handle filter functionality
function handleFilter() {
  // Update active button
  filterBtns.forEach(btn => btn.classList.remove('active'));
  this.classList.add('active');
  
  const filter = this.getAttribute('data-filter');
  
  if (filter === 'all') {
    displayRecipes(recipes);
    return;
  }
  
  const filteredRecipes = recipes.filter(recipe => recipe.category === filter);
  displayRecipes(filteredRecipes);
}

// Add event listeners for the modal
function setupModalListeners() {
  // Close modal when clicking the X
  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open'); // Ensure body scrolling is restored
  });
  
  // Close modal when clicking outside the content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open'); // Ensure body scrolling is restored
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open'); // Ensure body scrolling is restored
    }
  });
}

// Display saved recipes
function displaySavedRecipes() {
  savedRecipesContainer.innerHTML = '';
  
  if (savedRecipes.length === 0) {
    savedRecipesContainer.innerHTML = '<p class="no-saved-recipes">You haven\'t saved any recipes yet. Click the bookmark icon on any recipe to save it.</p>';
    return;
  }
  
  // Get the full recipe objects for each saved recipe ID
  const savedRecipeObjects = savedRecipes.map(savedId => 
    recipes.find(recipe => recipe.id === savedId)
  ).filter(recipe => recipe !== undefined); // Filter out any that might not exist anymore
  
  savedRecipeObjects.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe, true);
    savedRecipesContainer.appendChild(recipeCard);
  });
}

// Toggle save/unsave recipe
function toggleSaveRecipe(recipeId) {
  const index = savedRecipes.indexOf(recipeId);
  
  if (index === -1) {
    // Recipe not saved, so save it
    savedRecipes.push(recipeId);
    showNotification('Recipe saved to your collection!');
  } else {
    // Recipe already saved, so unsave it
    savedRecipes.splice(index, 1);
    showNotification('Recipe removed from your collection');
  }
  
  // Save to localStorage
  localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  
  // Update saved recipes display
  displaySavedRecipes();
}

// Function to determine ingredient icon based on ingredient name
function getIngredientIcon(ingredient) {
  // Convert to lowercase for easier matching
  const ing = ingredient.toLowerCase();
  
  // Map common ingredients to Font Awesome icons
  if (ing.includes('flour') || ing.includes('wheat')) return 'fa-wheat-awn';
  if (ing.includes('sugar')) return 'fa-cubes';
  if (ing.includes('salt')) return 'fa-salt-shaker';
  if (ing.includes('butter') || ing.includes('margarine')) return 'fa-butter';
  if (ing.includes('egg')) return 'fa-egg';
  if (ing.includes('milk') || ing.includes('cream')) return 'fa-bottle-water';
  if (ing.includes('cheese')) return 'fa-cheese';
  if (ing.includes('chicken')) return 'fa-drumstick-bite';
  if (ing.includes('beef') || ing.includes('steak')) return 'fa-cow';
  if (ing.includes('pork')) return 'fa-bacon';
  if (ing.includes('fish') || ing.includes('salmon')) return 'fa-fish';
  if (ing.includes('shrimp') || ing.includes('prawn')) return 'fa-shrimp';
  if (ing.includes('rice')) return 'fa-bowl-rice';
  if (ing.includes('pasta') || ing.includes('noodle')) return 'fa-utensils';
  if (ing.includes('tomato')) return 'fa-apple-whole';
  if (ing.includes('onion')) return 'fa-seedling';
  if (ing.includes('garlic')) return 'fa-seedling';
  if (ing.includes('pepper') || ing.includes('chili')) return 'fa-pepper-hot';
  if (ing.includes('oil') || ing.includes('vinegar')) return 'fa-bottle-droplet';
  if (ing.includes('wine') || ing.includes('beer')) return 'fa-wine-bottle';
  if (ing.includes('herb') || ing.includes('spice') || ing.includes('seasoning')) return 'fa-mortar-pestle';
  if (ing.includes('fruit') || ing.includes('apple') || ing.includes('banana') || ing.includes('berry')) return 'fa-apple-whole';
  if (ing.includes('vegetable') || ing.includes('carrot') || ing.includes('broccoli')) return 'fa-carrot';
  if (ing.includes('nut') || ing.includes('almond') || ing.includes('walnut')) return 'fa-acorn';
  if (ing.includes('chocolate') || ing.includes('cocoa')) return 'fa-candy-bar';
  if (ing.includes('honey') || ing.includes('syrup')) return 'fa-jar';
  if (ing.includes('water')) return 'fa-droplet';
  if (ing.includes('lemon') || ing.includes('lime') || ing.includes('citrus')) return 'fa-lemon';
  if (ing.includes('avocado')) return 'fa-avocado';
  
  // Default icon for other ingredients
  return 'fa-utensils';
}

// Show recipe details with comments section - Fixed ingredients list
function showRecipeDetails(recipe) {
  // Check if recipe is saved
  const isSaved = savedRecipes.includes(recipe.id);
  const saveButtonText = isSaved ? '<i class="fas fa-bookmark"></i> Unsave Recipe' : '<i class="far fa-bookmark"></i> Save Recipe';
  
  // Determine vegetarian status
  const vegClass = recipe.isVegetarian ? 'vegetarian' : 'non-vegetarian';
  const vegIcon = recipe.isVegetarian ? 'fas fa-leaf' : 'fas fa-drumstick-bite';
  const vegText = recipe.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian';
  
  // Get comments for this recipe
  const comments = recipeComments[recipe.id] || [];
  
  // Create comments HTML
  const commentsHTML = comments.length > 0 ? 
    comments.map(comment => `
      <div class="comment">
        <div class="comment-header">
          <div class="comment-user">${comment.user}</div>
          <div class="comment-date">${formatDate(comment.date)}</div>
        </div>
        <div class="comment-text">${comment.text}</div>
      </div>
    `).join('') : 
    '<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>';
  
  // Populate the recipe detail container with a full-width layout
  recipeDetailContainer.innerHTML = `
    <div class="recipe-detail-fullwidth">
      <div class="recipe-detail-header-section">
        <div class="recipe-detail-image">
          <div class="veg-badge ${vegClass}">
            <i class="${vegIcon}"></i>
          </div>
          <img src="${recipe.image}" alt="${recipe.title}">
        </div>
        <div class="recipe-detail-header-content">
          <h2>${recipe.title}</h2>
          <div class="rating">${generateStars(recipe.rating)}</div>
          
          <div class="veg-indicator ${vegClass}">
            <i class="${vegIcon}"></i> ${vegText}
          </div>
          
          <div class="recipe-detail-meta">
            <div class="recipe-detail-meta-item">
              <i class="far fa-clock"></i>
              <span>Prep: ${recipe.prepTime}</span>
            </div>
            <div class="recipe-detail-meta-item">
              <i class="fas fa-fire"></i>
              <span>Cook: ${recipe.cookTime}</span>
            </div>
            <div class="recipe-detail-meta-item">
              <i class="fas fa-utensils"></i>
              <span>Servings: ${recipe.servings}</span>
            </div>
            <div class="recipe-detail-meta-item">
              <i class="fas fa-chart-line"></i>
              <span>Difficulty: ${recipe.difficulty || 'Medium'}</span>
            </div>
          </div>
          
          <div class="recipe-detail-description">
            <h3>Description</h3>
            <p>${recipe.description || 'No description available.'}</p>
          </div>
        </div>
      </div>
      
      <div class="recipe-detail-divider"></div>
      
      <div class="recipe-detail-section full-width">
        <h3>Ingredients</h3>
        <ul class="ingredients-list">
          ${recipe.ingredients.map(ingredient => `
            <li>${ingredient}</li>
          `).join('')}
        </ul>
      </div>
      
      <div class="recipe-detail-divider"></div>
      
      <div class="recipe-detail-section full-width">
        <h3>Instructions</h3>
        <ol class="instructions-list">
          ${recipe.instructions.map(instruction => `
            <li>${instruction}</li>
          `).join('')}
        </ol>
      </div>
      
      <div class="recipe-detail-divider"></div>
      
      <div class="recipe-detail-section full-width">
        <h3>Nutrition Information</h3>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <span>Calories:</span>
            <span>${recipe.nutrition.calories}</span>
          </div>
          <div class="nutrition-item">
            <span>Protein:</span>
            <span>${recipe.nutrition.protein}</span>
          </div>
          <div class="nutrition-item">
            <span>Carbs:</span>
            <span>${recipe.nutrition.carbs}</span>
          </div>
          <div class="nutrition-item">
            <span>Fat:</span>
            <span>${recipe.nutrition.fat}</span>
          </div>
          <div class="nutrition-item">
            <span>Fiber:</span>
            <span>${recipe.nutrition.fiber}</span>
          </div>
        </div>
      </div>
      
      <div class="recipe-detail-divider"></div>
      
      <div class="recipe-detail-section full-width">
        <h3>Comments</h3>
        <div class="comments-container">
          ${commentsHTML}
        </div>
        
        <div class="add-comment-form">
          <h4>Add a Comment</h4>
          <div class="comment-form-group">
            <label for="comment-name">Your Name</label>
            <input type="text" id="comment-name" placeholder="Enter your name">
          </div>
          <div class="comment-form-group">
            <label for="comment-text">Your Comment</label>
            <textarea id="comment-text" rows="3" placeholder="Share your experience with this recipe"></textarea>
          </div>
          <button class="add-comment-btn" id="add-comment-btn">
            Post Comment
          </button>
        </div>
      </div>
      
      <div class="recipe-actions-bar">
        <button class="recipe-action-btn save-detail-btn">
          ${saveButtonText}
        </button>
        <button class="recipe-action-btn secondary">
          <i class="fas fa-print"></i> Print
        </button>
        <button class="recipe-action-btn secondary">
          <i class="fas fa-share-alt"></i> Share
        </button>
      </div>
    </div>
  `;
  
  // Add event listener to the save button in the detail view
  const saveDetailBtn = recipeDetailContainer.querySelector('.save-detail-btn');
  saveDetailBtn.addEventListener('click', () => {
    toggleSaveRecipe(recipe.id);
    
    // Update button text and icon
    if (savedRecipes.includes(recipe.id)) {
      saveDetailBtn.innerHTML = '<i class="fas fa-bookmark"></i> Unsave Recipe';
    } else {
      saveDetailBtn.innerHTML = '<i class="far fa-bookmark"></i> Save Recipe';
    }
    
    // Update recipe cards in the background
    displayRecipes(recipes);
  });
  
  // Add event listener to the add comment button
  const addCommentBtn = recipeDetailContainer.querySelector('#add-comment-btn');
  addCommentBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    
    if (name === '' || text === '') {
      showNotification('Please enter your name and comment');
      return;
    }
    
    // Create new comment
    const newComment = {
      user: name,
      text: text,
      date: new Date().toLocaleDateString()
    };
    
    // Add comment to the recipe
    if (!recipeComments[recipe.id]) {
      recipeComments[recipe.id] = [];
    }
    
    recipeComments[recipe.id].unshift(newComment);
    
    // Save to localStorage
    localStorage.setItem('recipeComments', JSON.stringify(recipeComments));
    
    // Refresh the comments section
    const commentsContainer = document.querySelector('.comments-container');
    const newCommentHTML = `
      <div class="comment">
        <div class="comment-header">
          <div class="comment-user">${newComment.user}</div>
          <div class="comment-date">${newComment.date}</div>
        </div>
        <div class="comment-text">${newComment.text}</div>
      </div>
    `;
    
    if (commentsContainer.querySelector('.no-comments')) {
      commentsContainer.innerHTML = newCommentHTML;
    } else {
      commentsContainer.insertAdjacentHTML('afterbegin', newCommentHTML);
    }
    
    // Clear the form
    nameInput.value = '';
    textInput.value = '';
    
    // Show success message
    showNotification('Comment added successfully!');
  });
  
  // Show the modal
  modal.classList.add('show');
  document.body.classList.add('modal-open');
}

// Setup Menu Toggle - Enhanced version
function setupMenuToggle() {
  // Add click event to menu toggle button
  menuToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking overlay
  overlay.addEventListener('click', closeMenu);
  
  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });
  
  // Add click events to mobile nav links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Handle navigation based on link text
      const linkText = e.target.textContent.trim();
      
      if (linkText.includes('Add Recipe')) {
        e.preventDefault();
        closeMenu();
        addRecipeModal.classList.add('show');
        document.body.classList.add('modal-open');
      } else if (linkText.includes('Saved Recipes')) {
        e.preventDefault();
        closeMenu();
        // Scroll to saved recipes section
        savedRecipesSection.scrollIntoView({ behavior: 'smooth' });
      } else if (linkText.includes('All Recipes')) {
        e.preventDefault();
        closeMenu();
        // Scroll to all recipes section
        document.querySelector('.recipe-grid').scrollIntoView({ behavior: 'smooth' });
      } else if (linkText.includes('Home')) {
        e.preventDefault();
        closeMenu();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
  
  // Log to confirm setup
  console.log('Menu toggle setup complete');
}

// Toggle Menu - Fixed version
function toggleMenu() {
  console.log('Toggle menu clicked');
  mobileNav.classList.toggle('active');
  overlay.classList.toggle('active');
  
  // Only toggle menu-open class, not modal-open
  document.body.classList.toggle('menu-open');
  
  // Animate menu icon
  const bars = menuToggle.querySelectorAll('.bar');
  bars.forEach(bar => bar.classList.toggle('active'));
}

// Close Menu - Fixed version
function closeMenu() {
  mobileNav.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('menu-open'); // Use menu-open, not modal-open
  
  // Reset menu icon
  const bars = menuToggle.querySelectorAll('.bar');
  bars.forEach(bar => bar.classList.remove('active'));
}

// Add a function to check and fix scrolling issues
function fixScrollingIssues() {
  // Remove any classes that might prevent scrolling
  document.body.classList.remove('modal-open');
  document.body.classList.remove('menu-open');
  
  // Make sure modals are closed
  if (modal) modal.classList.remove('show');
  if (addRecipeModal) addRecipeModal.classList.remove('show');
  
  // Make sure mobile nav is closed
  if (mobileNav) mobileNav.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  
  console.log('Scrolling issues fixed');
}

// Add scroll to top functionality
function setupScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  
  if (!scrollTopBtn) {
    console.error('Scroll to top button not found');
    return;
  }
  
  // Show button when scrolling down
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when clicked
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  console.log('Scroll to top functionality set up');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

// Add this to your script.js
document.addEventListener('DOMContentLoaded', function() {
  // Setup logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  const mobileLogout = document.getElementById('mobile-logout');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  if (mobileLogout) {
    mobileLogout.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  // Add user menu to header
  updateUserMenu();
});

// Logout function
function logout() {
  auth.signOut()
    .then(() => {
      showNotification('Logged out successfully');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    })
    .catch(error => {
      console.error('Logout error:', error);
      showNotification('Error logging out', 'error');
    });
}

// Update user menu based on authentication state
function updateUserMenu() {
  auth.onAuthStateChanged(user => {
    const headerContainer = document.querySelector('header .container');
    
    // Remove existing user menu if it exists
    const existingUserMenu = document.querySelector('.user-menu');
    if (existingUserMenu) {
      existingUserMenu.remove();
    }
    
    if (user) {
      // Get user data from Firestore
      db.collection('users').doc(user.uid).get()
        .then(doc => {
          const userData = doc.data();
          const displayName = userData ? userData.firstName : 'User';
          
          // Create user menu
          const userMenu = document.createElement('div');
          userMenu.className = 'user-menu';
          userMenu.innerHTML = `
            <button class="user-menu-btn">
              <i class="fas fa-user-circle"></i>
              <span>${displayName}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-menu-content">
              <a href="#"><i class="fas fa-user"></i> Profile</a>
              <a href="#"><i class="fas fa-cog"></i> Settings</a>
              <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
          `;
          
          // Insert after the header title
          const headerTitle = headerContainer.querySelector('p');
          headerTitle.after(userMenu);
          
          // Toggle user menu dropdown
          const userMenuBtn = userMenu.querySelector('.user-menu-btn');
          userMenuBtn.addEventListener('click', function() {
            userMenu.classList.toggle('active');
          });
          
          // Close menu when clicking outside
          document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target)) {
              userMenu.classList.remove('active');
            }
          });
          
          // Setup logout button
          const logoutBtn = userMenu.querySelector('#logout-btn');
          logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
          });
        });
    }
  });
}

const moods = ["happy","sad","energetic","lazy","romantic","angry","tired","healthy","cozy"];
const API_BASE = "https://www.themealdb.com/api/json/v1/1/";

// DOM
const moodsEl = document.getElementById("moods");
const cardArea = document.getElementById("cardArea");
const resultTitle = document.getElementById("resultTitle");
const searchInput = document.getElementById("search");
const randomBtn = document.getElementById("randomBtn");
const favoritesList = document.getElementById("favoritesList");
const themeToggle = document.getElementById("themeToggle");

// init
function init(){
  renderMoodButtons();
  loadFavorites();
}

// mood buttons
function renderMoodButtons(){
  moods.forEach(m=>{
    const b = document.createElement("button");
    b.className = "mood-btn";
    b.textContent = m;
    b.onclick = ()=> searchMeals(m);
    moodsEl.appendChild(b);
  });
}

// search API
async function searchMeals(query){
  resultTitle.textContent = `Results for "${query}"`;
  const res = await fetch(`${API_BASE}search.php?s=${query}`);
  const data = await res.json();
  renderCards(data.meals || []);
}

// random meal
randomBtn.addEventListener("click", async ()=>{
  const res = await fetch(`${API_BASE}random.php`);
  const data = await res.json();
  resultTitle.textContent = "Random Pick 🍀";
  renderCards(data.meals || []);
});

// search input
searchInput.addEventListener("input", e=>{
  const q = e.target.value.trim();
  if(q.length > 2){ searchMeals(q); }
});

// render cards
function renderCards(meals){
  cardArea.innerHTML = "";
  if(meals.length === 0){ cardArea.innerHTML = "<p>No meals found.</p>"; return; }
  meals.forEach(me=>{
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `
      <img src="${me.strMealThumb}" alt="${me.strMeal}">
      <h4>${me.strMeal}</h4>
      <p>${me.strArea} • ${me.strCategory}</p>
      <div class="meta">
        <a href="${me.strSource || me.strYoutube}" target="_blank">📖 Recipe</a>
        <button onclick="toggleFavorite('${me.idMeal}','${me.strMeal}','${me.strMealThumb}')">♡</button>
      </div>
    `;
    cardArea.appendChild(c);
  });
}

// favorites
function getFavorites(){
  try { return JSON.parse(localStorage.getItem("mm_favs")||"[]"); } catch(e){ return []; }
}
function saveFavorites(arr){ localStorage.setItem("mm_favs", JSON.stringify(arr)); loadFavorites(); }

function toggleFavorite(id,title,img){
  const favs = getFavorites();
  const idx = favs.findIndex(f=>f.id===id);
  if(idx>-1){ favs.splice(idx,1); } else { favs.push({id,title,img}); }
  saveFavorites(favs);
}
function loadFavorites(){
  const favs = getFavorites();
  favoritesList.innerHTML = "";
  if(favs.length===0){ favoritesList.innerHTML="<p>No favorites yet.</p>"; return; }
  favs.forEach(f=>{
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `
      <img src="${f.img}" alt="${f.title}">
      <h4>${f.title}</h4>
      <div class="meta"><button onclick="toggleFavorite('${f.id}')">Remove</button></div>
    `;
    favoritesList.appendChild(c);
  });
}

// theme toggle
themeToggle.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

init();

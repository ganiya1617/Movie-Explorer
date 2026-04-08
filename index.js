const API_KEY = "43de8ff65f6ff177a1547c3f54cc67c7";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

// DOM
const searchInput = document.getElementById("search");
const yearInput = document.getElementById("year");
const ratingInput = document.getElementById("rating");
const ratingValue = document.getElementById("ratingValue");
const sortInput = document.getElementById("sort");
const genreInput = document.getElementById("genre");
const applyBtn = document.getElementById("apply");
const moviesDiv = document.getElementById("movies");

// 🎯 Show rating value
ratingInput.addEventListener("input", () => {
  ratingValue.textContent = ratingInput.value;
});

// 🎬 Fetch Genres
async function fetchGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();

    data.genres.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      genreInput.appendChild(opt);
    });

  } catch (err) {
    console.error("Genre error:", err);
  }
}

// 🎬 Fetch Movies
async function fetchMovies(type = "filter") {
  let url;

  const search = searchInput.value.trim();
  const year = yearInput.value;
  const rating = ratingInput.value;
  const sort = sortInput.value;
  const genre = genreInput.value;

  try {
    // 🔍 SEARCH MODE
    if (type === "search") {
      if (!search) return;
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`;
    }

    // 🎯 FILTER MODE
    else {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`;

      if (year) url += `&primary_release_year=${year}`;
      if (rating > 0) url += `&vote_average.gte=${rating}`;
      if (genre) url += `&with_genres=${genre}`;
    }

    console.log("Fetching:", url);

    const res = await fetch(url);
    const data = await res.json();

    displayMovies(data.results || []);

  } catch (err) {
    console.error("Movie fetch error:", err);
    moviesDiv.innerHTML = "<h2>Error loading movies</h2>";
  }
}

// 🎬 Display Movies
function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  if (movies.length === 0) {
    moviesDiv.innerHTML = "<h2>No movies found</h2>";
    return;
  }

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="${movie.poster_path ? IMG + movie.poster_path : ''}">
      <h4>${movie.title}</h4>
      <p>⭐ ${movie.vote_average}</p>
    `;

    moviesDiv.appendChild(div);
  });
}

// 🎯 Apply Filters Button
applyBtn.addEventListener("click", () => {
  searchInput.value = "";   // clear search
  fetchMovies("filter");
});

// 🔍 Search on Enter
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchMovies("search");
  }
});

// 🚀 Initial Load
window.onload = () => {
  fetchGenres();
  fetchMovies("filter");
};
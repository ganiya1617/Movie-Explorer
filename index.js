const API_KEY = "8e2f4d36";

const grid = document.getElementById("movieGrid");
const details = document.getElementById("details");
const loading = document.getElementById("loading");

window.onload = () => {
  fetchTrending();
};

async function fetchTrending() {
  loading.style.display = "block";

  const res = await fetch(
    `https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`
  );
  const data = await res.json();

  if (data.Response === "True") {
    displayMovies(data.Search);
  }

  loading.style.display = "none";
}

async function fetchMovies() {
  const search = document.getElementById("searchInput").value;
  if (!search) return;

  loading.style.display = "block";

  const res = await fetch(
    `https://www.omdbapi.com/?s=${search}&apikey=${API_KEY}`
  );
  const data = await res.json();

  if (data.Response === "True") {
    displayMovies(data.Search);
  } else {
    grid.innerHTML = "<p>No movies found</p>";
  }

  loading.style.display = "none";
}

function displayMovies(movies) {
  grid.innerHTML = "";
  details.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/150"
      }" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    card.onclick = () => fetchDetails(movie.imdbID);

    grid.appendChild(card);
  });
}

async function fetchDetails(id) {
  const res = await fetch(
    `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`
  );
  const movie = await res.json();

  details.innerHTML = `
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster}" width="200" />
    <p><b>Year:</b> ${movie.Year}</p>
    <p><b>Genre:</b> ${movie.Genre}</p>
    <p><b>Plot:</b> ${movie.Plot}</p>
    <p><b>Rating:</b> ⭐ ${movie.imdbRating}</p>
  `;
}
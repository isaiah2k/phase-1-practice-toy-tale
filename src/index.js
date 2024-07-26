let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetchToys()

// Adds event listener for the toy form submission
document.querySelector(".add-toy-form").addEventListener("submit", (event) => {
  event.preventDefault()
  addNewToy()
})

// Fetches toys and renders them to the DOM
function fetchToys() {
fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => {
      renderToy(toy)
    })
  })
  .catch(error => console.error("Error fetching toys:", error))
}

// Renders a single toy card
function renderToy(toy) {
const toyCollection = document.getElementById("toy-collection")
const toyCard = document.createElement("div")
toyCard.className = "card"

toyCard.innerHTML = `
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  <button class="like-btn" id="${toy.id}">Like</button>
`

const likeBtn = toyCard.querySelector(".like-btn")
likeBtn.addEventListener("click", () => {
  increaseLikes(toy)
})

toyCollection.appendChild(toyCard)
}

// Adds a new toy
function addNewToy() {
const toyForm = document.querySelector(".add-toy-form")
const toyName = toyForm.querySelector("input[name='name']").value
const toyImage = toyForm.querySelector("input[name='image']").value

const newToy = {
  name: toyName,
  image: toyImage,
  likes: 0
}

fetch("http://localhost:3000/toys", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(newToy)
})
  .then(response => response.json())
  .then(toy => {
    renderToy(toy)
    toyForm.reset()
  })
  .catch(error => console.error("Error adding toy:", error))
}

// Increases likes for a toy
function increaseLikes(toy) {
const newLikes = toy.likes + 1

fetch(`http://localhost:3000/toys/${toy.id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    likes: newLikes
  })
})
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.querySelector(`.card button[id="${updatedToy.id}"]`).parentElement
    toyCard.querySelector("p").innerText = `${updatedToy.likes} Likes`
    toy.likes = updatedToy.likes
  })
  .catch(error => console.error("Error updating likes:", error))
}
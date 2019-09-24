// HC: great job on the detailed comments that you’ve added in this file!
// constants for eventListeners and data
const hamburger = document.querySelector(".hamburger");
const navigation = document.querySelector("nav");
const selectGame = document.querySelector("#selectGame");
const selectSub = document.querySelector(".sub-menu");
const about = document.getElementById("about");
const learnMore = document.getElementById("learnMore");
const board = document.querySelector("#gameBoard");

// gameBoard arrays
let cardsOnBoard = [];
let inPlay = [];
let arraySelector = "";

// score & turn array
let players = [
  { id: "playerOne", player: "player 1", score: 0 },
  { id: "playerTwo", player: "player 2", score: 0 }
];

// games objects > arrays > objects; possibly change to class for refactor
const games = {
  planets: [
    { name: "Mercury", img: "images/planets/mercury.png" },
    { name: "Venus", img: "images/planets/venus.png" },
    { name: "Earth", img: "images/planets/earth.png" },
    { name: "Mars", img: "images/planets/mars.png" },
    { name: "Jupiter", img: "images/planets/jupiter.png" },
    { name: "Saturn", img: "images/planets/saturn.png" },
    { name: "Uranus", img: "images/planets/uranus.png" },
    { name: "Neptune", img: "images/planets/neptune.png" },
    { name: "Sun", img: "images/planets/sun.png" },
    { name: "Moon", img: "images/planets/moon.png" }
  ],
  stars: [
    { name: "Aquarius", img: "images/constellations/aquarius.png" },
    { name: "Aries", img: "images/constellations/aries.png" },
    { name: "Cancer", img: "images/constellations/cancer.png" },
    { name: "Capricorn", img: "images/constellations/capricorn.png" },
    { name: "Cassiopeia", img: "images/constellations/cassiopeia.png" },
    { name: "Centaurus", img: "images/constellations/centaurus.png" },
    { name: "Gemini", img: "images/constellations/gemini.png" },
    { name: "Leo", img: "images/constellations/leo.png" },
    { name: "Libra", img: "images/constellations/libra.png" },
    { name: "Orion", img: "images/constellations/orion.png" },
    { name: "Pegasus", img: "images/constellations/pegasus.png" },
    { name: "Pisces", img: "images/constellations/pisces.png" },
    { name: "Sagittarius", img: "images/constellations/sagittarius.png" },
    { name: "Scorpius", img: "images/constellations/scorpius.png" },
    { name: "Taurus", img: "images/constellations/taurus.png" },
    { name: "Ursa Major", img: "images/constellations/ursa-major.png" },
    { name: "Ursa Minor", img: "images/constellations/ursa-minor.png" },
    { name: "Virgo", img: "images/constellations/virgo.png" }
  ]
};

// menu open/close event
hamburger.addEventListener("click", openMenu);
// menu switch
let navSwitch = 0;

function openMenu() {
  const bars = hamburger.children;

  if (navSwitch === 0) {
    // HC: consider consolidating lines 69-73 into a helper method and you can re-use the helper function
    // for lines 75-79
    navigation.style.display = "initial";
    bars[0].classList.add("top");
    bars[1].classList.add("middle");
    bars[2].classList.add("bottom");
    navSwitch = 1;
  } else {
    navigation.style.display = "none";
    bars[0].classList.remove("top");
    bars[1].classList.remove("middle");
    bars[2].classList.remove("bottom");
    navSwitch = 0;
  }
}

// navigation menu item events
navigation.addEventListener("mouseover", function(evt) {
  evt.target.style.color = "#FDCB56";
});

navigation.addEventListener("mouseout", function(evt) {
  evt.target.style.color = "#FFFCF1";
});

// on click load new board
selectGame.addEventListener("click", function(evt) {
  evt.preventDefault();
  // selection criteria based on nav link text
  arraySelector = evt.target.innerText;

  // load new board
  loadBoard(arraySelector.toLowerCase());
  // switch menu state to closed
  openMenu(evt);
  inPlay = [];
});

// on click load about or learn more
selectSub.addEventListener("click", function(evt) {
  evt.preventDefault();
  // selection criteria based on nav link text
  arraySelector = evt.target.innerText;

  if (arraySelector === "About") {
    // load about board
    loadAbout();
  } else if (arraySelector === "Learn More") {
    loadLearnMore();
  }
  // switch menu state to closed
  openMenu(evt);
});

// flip card
board.addEventListener("click", evt => {
  evt.preventDefault();
  // Thanks to Kenny for the if statement wrapper idea to stop console log error that didn't affect the game but was annoying me
  if (evt.target.classList.value === "card back" && inPlay.length < 2) {
    // get array location via data-id as set in createCards function
    const card = evt.target.getAttribute("id");
    // create img and title elements
    let frontImg = document.createElement("img");
    let frontTitle = document.createElement("h2");
    // set img and title attributes using data-id from getAttribute^
    frontImg.setAttribute("src", cardsOnBoard[card].img);
    frontTitle.innerHTML = cardsOnBoard[card].name;
    // push new card to inPlay
    inPlay.push(card);
    // flip card/change image
    // remove bg
    evt.target.classList.remove("back");
    // add img and title
    evt.target.appendChild(frontImg);
    evt.target.appendChild(frontTitle);
    // check for match
    if (inPlay.length === 2) {
      checkMatch();
    }
  }
});

// builds new cardsOnBoard array
function loadBoard(arrayQuery) {
  // clear previous board
  clearBoard();
  // temp newBoard based on menu selection & 'games' obj
  const newBoard = games[arrayQuery];
  // push unique card pairs to cardsOnBoard array
  for (let i = 0; cardsOnBoard.length < 8; i++) {
    let randomIndex = Math.floor(Math.random() * newBoard.length);
    // filtered array for testing if card pair already exists
    let testArray = cardsOnBoard.filter(
      card => card.name === newBoard[randomIndex].name
    );
    // first pair auto populates
    if (cardsOnBoard.length < 0) {
      cardsOnBoard.push(newBoard[randomIndex], newBoard[randomIndex]);
      // subsequent pairs test against testArray
    } else if (testArray.length <= 0) {
      cardsOnBoard.push(newBoard[randomIndex], newBoard[randomIndex]);
    }
  }
  // shuffle cardsOnBoard
  shuffle(cardsOnBoard);
  // push cards to View
  createCards(cardsOnBoard);
}

// shuffle gameBoard array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * array.length);

    let upNext = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = upNext;
  }
}

// create & push cards to View from gameBoard Array
function createCards(array) {
  for (let card in array) {
    // define attribute variables
    let newCard = document.createElement("div");

    // build card
    newCard.setAttribute("id", card); // gameBoard[card].name
    newCard.setAttribute("class", "card back");

    // push to board
    document.getElementById("gameBoard").appendChild(newCard);
  }
}

// clear gameBoard in View & cardsOnBoard array
function clearBoard() {
  // empty dom game-board div
  while (board.firstElementChild) {
    board.removeChild(board.firstElementChild);
  }
  // empty gameBoard array
  cardsOnBoard = [];
}

function checkMatch() {
  const firstIndex = inPlay[0];
  const secondIndex = inPlay[1];
  const firstCard = cardsOnBoard[firstIndex].name;
  const secondCard = cardsOnBoard[secondIndex].name;

  if (firstCard === secondCard) {
    // if match iterate point for current player & go again
    document.getElementById(`${players[0].id}`).innerHTML = `${
      players[0].player
    }: ${(players[0].score += 1)}`;
    // check win scenario
    win();
    // change player, could turn this off for more of a challenge
    turn();
    // if no match
  } else if (firstCard != secondCard) {
    // and flip back
    setTimeout(flipBack, 1000);
    // Thanks to Kenny for providing W3S starting point for setTimeout review
  }
}

function turn() {
  // switch next player to first array
  let prevPlayer = players.shift();
  players.push(prevPlayer);
  // switch player emphasize on score board
  document.getElementById(`${players[0].id}`).classList.add("current-player");
  document
    .getElementById(`${players[1].id}`)
    .classList.remove("current-player");
  // clear in play array
  inPlay = [];
}

function flipBack() {
  // find parent elements based on current selections
  let firstCard = board.children[`${inPlay[0]}`];
  let secondCard = board.children[`${inPlay[1]}`];

  // remove images & titles children
  while (firstCard.firstElementChild) {
    firstCard.removeChild(firstCard.firstElementChild);
  }
  while (secondCard.firstElementChild) {
    secondCard.removeChild(secondCard.firstElementChild);
  }

  // add card back class to classList
  firstCard.classList.add("back");
  secondCard.classList.add("back");

  // go to next player
  turn();
}

function win() {
  // HC: nice job using the spread operator to create a copy of the board!
  let boardChildren = [...board.children];
  // Thanks Kenny for showing me HTMLcollection to Array using spread operator
  let testArray = boardChildren.filter(
    card => `${card.classList.value}` === "card"
  );

  // all cards flipped and matched
  if (testArray.length === cardsOnBoard.length) {
    award();
  }
}

function award() {
  // create awards elements
  let award = document.createElement("div");
  award.setAttribute("class", "award winner");
  let announcement = document.createElement("h2");

  // HC: Instead of repeatedly accessing the elements at position 0 and 1 of players, store these in variables
  // i.e., let playerOne = players[0]
  // player with most points wins
  if (players[0].score > players[1].score) {
    announcement.innerText = `${players[0].player} WINS!`;
  } else if (players[1].score > players[0].score) {
    announcement.innerText = `${players[1].player} WINS!`;
  } else if (players[0].score === players[1].score) {
    announcement.innerText = `It's a tie!`;
  }

  // append children
  award.appendChild(announcement);
  document.querySelector("main").appendChild(award);
  setTimeout(fadeOut, 3000);
}

function fadeOut() {
  let award = document.querySelector(".winner");
  award.parentNode.removeChild(award);
  // This approach of self removal comes from https://gomakethings.com/removing-an-element-from-the-dom-with-vanilla-js/
}

function loadAbout() {
  about.style.display = "initial";
  let closer = about.querySelector(".closer");
  closer.addEventListener("click", function() {
    about.style.display = "none";
  });
}

function loadLearnMore() {
  learnMore.style.display = "initial";
  let closer = learnMore.querySelector(".closer");
  closer.addEventListener("click", function() {
    learnMore.style.display = "none";
  });
}

// default start board load
loadBoard("planets");
// HC: remove console.log calls that you used during debugging and don’t need anymore
// console.log(cardsOnBoard);

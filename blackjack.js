// GAME DATA STRUCTURE
// Structure: { Player1: { cards: [], score: function calculateScore }, Dealer: { cards: [], score: function calculateScore }, cardDeck: [] }
let game = {};

// GAME DISPLAY ENTITIES
let gameItems = document.getElementById("game");
let playerArea = document.getElementById("playerCards");
let dealerArea = document.getElementById("dealerCards");

// GAME ACTION BUTTONS
let newGameButton = document.getElementById("newGameButton");
let hitMeButton = document.getElementById("hitMeButton");
let stickButton = document.getElementById("stickButton");

newGameButton.addEventListener("click", startGame);
hitMeButton.addEventListener("click", hitMe);
stickButton.addEventListener("click", stick);

// Initiate Program
document.addEventListener("DOMContentLoaded", main);

function main() {
  // Hide game board on page load
  gameItems.style.display = "none";
}

function startGame() {
  clearGame();
  setUpGame();
  initialDeal(game);
  displayDeal(game);
  displayScore(game.Player1.score(), "Player1");
  // Only show value of first card for dealer at start of game
  let dealerScore = calculateScore([game.Dealer.cards[0]]);
  displayScore(dealerScore, "Dealer");
  determinePlayerOptions(game.Player1.score());
}

function clearGame() {
  game = {};
  gameText.style.display = "none";
  gameText.innerHTML = "";
  hitMeButton.style.display = "none";
  stickButton.style.display = "none";
  hitMeButton.disabled = false;
  stickButton.disabled = false;
  playerArea.innerHTML = "";
  dealerArea.innerHTML = "";
  gameItems.style.display = "";
}

function setUpGame() {
  game = {
    Player1: {
      cards: [],
      score: function () {
        return calculateScore(this.cards);
      },
    },
    Dealer: {
      cards: [],
      score: function () {
        return calculateScore(this.cards);
      },
    },
    cardDeck: shuffleDeck(createDeck()),
  };
  return game;
}

function initialDeal(game) {
  for (i = 0; i < 2; i++) {
    game.Player1.cards.push(dealCard(game.cardDeck));
    game.Dealer.cards.push(dealCard(game.cardDeck));
  }
  return game;
}

function displayDeal() {
  // Show both cards for player 1
  // Show card 1 face up and card 2 face down for the dealer
  let playerOneCards = game.Player1.cards;
  let dealerCards = game.Dealer.cards;
  renderCard(playerOneCards[0], playerArea);
  renderCard(playerOneCards[1], playerArea);
  renderCard(dealerCards[0], dealerArea);
  renderCard(dealerCards[1], dealerArea, false);
}

function calculateScore(playerCards) {
  total = 0;
  let aceCount = 0;
  let hasAce = false;
  for (i = 0; i < playerCards.length; i++) {
    total += getCardScore(playerCards[i].value);
    if (playerCards[i].value === "Ace") {
      hasAce = true;
    }
  }
  if (hasAce && total + 10 <= 21) {
    return total + 10;
  }
  return total;
}

function displayScore(score, player) {
  let playerScoreDisplay = document.getElementById("playerScore");
  let dealerScoreDisplay = document.getElementById("dealerScore");
  if (player === "Dealer") {
    dealerScoreDisplay.innerHTML = score;
  } else {
    playerScoreDisplay.innerHTML = score;
  }
}

function determinePlayerOptions(playerScore) {
  if (playerScore == 21) {
    dealerTurn();
    return false;
  } else if (playerScore < 21) {
    hitMeButton.style.display = "inline";
    stickButton.style.display = "inline";
    return true;
  } else {
    displayGameText("BUST, DEALER WINS!");
    disablePlayerActions();
    return false;
  }
}

// PLAYER ACTION FUNCTIONS
function hitMe() {
  let newCard = dealCard(game.cardDeck);
  game.Player1.cards.push(newCard);
  renderCard(newCard, playerArea);
  displayScore(game.Player1.score(), "Player1");
  determinePlayerOptions(game.Player1.score());
}

function stick() {
  dealerTurn();
}

// CARD DECK FUNCTIONS
function createDeck() {
  // deck = [{suit: "clubs", value: "Ace"}, {suit: "clubs", value: 10}...]
  let deck = [];
  suits = ["clubs", "diamonds", "hearts", "spades"];
  cardValues = [
    "Ace",
    "King",
    "Queen",
    "Jack",
    "ten",
    "nine",
    "eight",
    "seven",
    "six",
    "five",
    "four",
    "three",
    "two",
  ];

  for (i = 0; i < suits.length; i++) {
    for (n = 0; n < cardValues.length; n++) {
      deck.push({
        suit: suits[i],
        value: cardValues[n],
      });
    }
  }
  return deck;
}

function shuffleDeck(cardDeck) {
  let shuffledDeck = [];
  while (cardDeck.length) {
    randomCardIndex = getRandomCardIndex(cardDeck);
    randomCard = cardDeck[randomCardIndex];
    shuffledDeck.push(randomCard);
    cardDeck.splice(randomCardIndex, 1);
  }
  return shuffledDeck;
}

function getRandomCardIndex(cardDeck) {
  let randomCardIndex = Math.trunc(Math.random() * cardDeck.length);
  return randomCardIndex;
}

function dealCard(cardDeck) {
  return cardDeck.pop();
}

function getCardScore(cardValue) {
  switch (cardValue) {
    case "Ace":
      return 1;
    case "King":
    case "Queen":
    case "Jack":
    case "ten":
      return 10;
    case "nine":
      return 9;
    case "eight":
      return 8;
    case "seven":
      return 7;
    case "six":
      return 6;
    case "five":
      return 5;
    case "four":
      return 4;
    case "three":
      return 3;
    case "two":
      return 2;
  }
}

// DEALER ACTION
function dealerTurn() {
  disablePlayerActions();
  // Flip the dealer's second card
  let dealerSecondCard = dealerArea.children[1];
  dealerSecondCard.children[0].classList.remove("face-down");
  displayScore(game.Dealer.score(), "Dealer");
  while (game.Dealer.score() < 17) {
    let newCard = dealCard(game.cardDeck);
    game.Dealer.cards.push(newCard);
    renderCard(newCard, dealerArea);
    displayScore(game.Dealer.score(), "Dealer");
  }
  if (game.Dealer.score() >= 17 && game.Dealer.score() < 22) {
    determineWinner(game.Player1.score(), game.Dealer.score());
    return;
  } else {
    displayGameText("DEALER BUST, YOU WIN!");
    return;
  }
}

// GAME DISPLAY FUNCTIONS
function renderCard(card, location, flipCard = true) {
  // STEPS - PART 1
  // 1. Add new card face down to the DOM and set opacity to 0

  // CARD STRUCTURE
  // <div class="playing-card new-card" id="new-card">
  //   <div class="playing-card-inner face-down">
  //     <div class="playing-card-front">
  //        <h4 class="card-text">card value</h4>
  //     </div>
  //     <div class="playing-card-back"></div>
  //   </div>
  // </div>;

  let cardElement = document.createElement("div");
  cardElement.setAttribute("class", "playing-card new-card");

  let cardInner = document.createElement("div");
  cardInner.setAttribute("class", `playing-card-inner face-down`);

  let cardFront = document.createElement("div");
  cardFront.setAttribute("class", `playing-card-front ${card.suit}`);

  let cardValueText = document.createElement("h4");
  cardValueText.setAttribute("class", "card-text");

  let cardValue = document.createTextNode(card.value);

  let cardBack = document.createElement("div");
  cardBack.setAttribute("class", "playing-card-back");

  cardInner.appendChild(cardBack);
  cardValueText.appendChild(cardValue);
  cardFront.appendChild(cardValueText);
  cardInner.appendChild(cardFront);
  cardElement.appendChild(cardInner);
  location.appendChild(cardElement);

  animateCard(cardElement, flipCard);
}

function animateCard(cardDomElement, flipCard) {
  // STEPS - PART 2
  // 1. Create clone of deck card to enable animation to be applied to all cards
  // 2. Move card from deck pack to new card position (animation only)
  // 3. Remove new card class so opacity is 1 after animation finishes
  // 4. Flip the card to be face up by removing the face-down class

  let deckArea = document.getElementById("deckArea");
  let deckCard = document.getElementById("deckCard");
  let clonedDeckCard = deckCard.cloneNode(true);
  deckArea.appendChild(clonedDeckCard);

  // Set approximate buffer values based on positioning in the .deck-card css class
  // This is to adjust for the difficulty in moving elements to exact positions
  let upBuffer = 10;
  let rightBuffer = 35;

  let moveUp =
    cardDomElement.getBoundingClientRect().top -
    clonedDeckCard.getBoundingClientRect().top -
    upBuffer;

  let moveRight =
    cardDomElement.getBoundingClientRect().right -
    clonedDeckCard.getBoundingClientRect().right +
    rightBuffer;

  let animation = clonedDeckCard.animate(
    [
      {
        transform: "translateX(0) translateY(0) rotate(45deg)",
      },
      {
        transform: `translateX(${moveRight}px) translateY(${moveUp}px) rotate(360deg)`,
      },
    ],
    {
      // https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill
      fill: "auto",
      // https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/direction
      direction: "alternate",
      duration: 400,
      easing: "ease-in-out",
    }
  );

  animation.play();

  animation.onfinish = () => {
    if (flipCard) {
      cardDomElement.children[0].classList.remove("face-down");
    }
    cardDomElement.classList.remove("new-card");
    clonedDeckCard.remove();
  };
}

function displayGameText(message) {
  setTimeout(() => {
    let gameText = document.getElementById("gameText");
    gameText.style.display = "block";
    gameText.innerHTML = message;
  }, 900);
}

function determineWinner(playerScore, dealerScore) {
  let message = "";
  if (playerScore > dealerScore) {
    message = "YOU WIN";
  } else if (playerScore === dealerScore) {
    message = "DRAWN GAME";
  } else {
    message = "DEALER WINS";
  }
  displayGameText(message);
}

function disablePlayerActions() {
  hitMeButton.disabled = true;
  stickButton.disabled = true;
  hitMeButton.style.display = "none";
  stickButton.style.display = "none";
}

// GAME DISPLAY ENTITIES
let playerScoreDisplay = document.getElementById("playerScore");
let dealerScoreDisplay = document.getElementById("dealerScore");
let playerArea = document.getElementById("playerCards");
let dealerArea = document.getElementById("dealerCards");

// GAME ACTION BUTTONS
let newGameButton = document.getElementById("newGameButton");
let hitMeButton = document.getElementById("hitMeButton");
let stickButton = document.getElementById("stickButton");
hitMeButton.style.display = "none";
stickButton.style.display = "none";

newGameButton.addEventListener("click", startGame);

function startGame() {
  clearGame();
  cards = createDeck();
  cards = shuffleDeck(cards);
  players = setUpPlayers();
  initialDeal(players, cards);
  displayDeal(players);
  player1Cards = players.Player1;
  playerScore = calculateScore(player1Cards);
  playerScoreDisplay.innerHTML = playerScore;
  dealerCards = players.Dealer;
  dealerScore = calculateScore([dealerCards[0]]);
  dealerScoreDisplay.innerHTML = dealerScore;
  determinePlayerOptions(playerScore);
}

function displayGameText(message) {
  let gameText = document.getElementById("gameText");
  gameText.style.display = "block";
  gameText.innerHTML = message;
}

// Supporting functions
function getCardScore(cardValue) {
  switch (cardValue) {
    case "Ace":
      return 1;
      break;
    case "King":
    case "Queen":
    case "Jack":
    case "ten":
      return 10;
      break;
    case "nine":
      return 9;
      break;
    case "eight":
      return 8;
      break;
    case "seven":
      return 7;
      break;
    case "six":
      return 6;
      break;
    case "five":
      return 5;
      break;
    case "four":
      return 4;
      break;
    case "three":
      return 3;
      break;
    case "two":
      return 2;
      break;
  }
}

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

function getRandomCardIndex(cardDeck) {
  let randomCardIndex = Math.trunc(Math.random() * cardDeck.length);
  return randomCardIndex;
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

function cardDetails(card) {
  cardText = card.value + " of " + card.suit;
  return cardText;
}

function dealCard(cardDeck) {
  return cardDeck.pop();
}

function renderCard(card, location) {
  let cardPicture = document.createElement("div");
  cardPicture.setAttribute("class", `playing-card ${card.suit}`);
  location.appendChild(cardPicture);
  let cardValueSpan = document.createElement("span");
  cardValueSpan.setAttribute("class", "card-text");
  let cardValue = document.createTextNode(card.value);
  cardValueSpan.appendChild(cardValue);
  cardPicture.appendChild(cardValueSpan);
}

function setUpPlayers() {
  // structure { Player1: [cards stored here], Dealer: [cards stored here] }
  const players = { Player1: [], Dealer: [] };
  return players;
}

function initialDeal(players, cardDeck) {
  for (i = 0; i < 2; i++) {
    players.Player1.push(dealCard(cardDeck));
    players.Dealer.push(dealCard(cardDeck));
  }
  return players;
}

function displayDeal(players) {
  // Show both cards for player 1
  // Only show the first card for the dealer
  // TODO: show second card face down for dealer
  let playerOneCards = players.Player1;
  let dealerCards = players.Dealer;
  renderCard(playerOneCards[0], playerArea);
  renderCard(playerOneCards[1], playerArea);
  renderCard(dealerCards[0], dealerArea);
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

function dealerTurn() {
  disablePlayerActions();
  renderCard(dealerCards[1], dealerArea);
  dealerCards = players.Dealer;
  dealerScore = calculateScore(dealerCards);
  dealerScoreDisplay.innerHTML = dealerScore;
  while (dealerScore < 17) {
    newCard = dealCard(cards);
    dealerCards.push(newCard);
    renderCard(newCard, dealerArea);
    dealerScore = calculateScore(dealerCards);
    dealerScoreDisplay.innerHTML = dealerScore;
  }
  if (dealerScore > 17 && dealerScore < 22) {
    determineWinner();
    return;
  } else {
    displayGameText("DEALER BUST, YOU WIN!");
    return;
  }
}

function determineWinner() {
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

function clearGame() {
  gameText.style.display = "none";
  gameText.innerHTML = "";
  hitMeButton.style.display = "none";
  stickButton.style.display = "none";
  hitMeButton.disabled = false;
  stickButton.disabled = false;
  playerArea.innerHTML = "";
  dealerArea.innerHTML = "";
}

hitMeButton.addEventListener("click", function () {
  newCard = dealCard(cards);
  player1Cards.push(newCard);
  renderCard(newCard, playerArea);
  playerScore = calculateScore(player1Cards);
  playerScoreDisplay.innerHTML = playerScore;
  determinePlayerOptions(playerScore);
});

stickButton.addEventListener("click", function () {
  dealerTurn();
});

function disablePlayerActions() {
  hitMeButton.disabled = true;
  stickButton.disabled = true;
}

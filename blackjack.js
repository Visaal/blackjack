// GAME DISPLAY ENTITIES
let gameText = document.getElementById("gameText");
let playerText = document.getElementById("playerText");
let playerScoreDisplay = document.getElementById("playerScore");
let dealerText = document.getElementById("dealerText");
let dealerScoreDisplay = document.getElementById("dealerScore");
let playerArea = document.getElementById("playerCards");
let dealerArea = document.getElementById("dealerCards");

// GAME ACTION BUTTONS
let newGameButton = document.getElementById("newGameButton");
let hitMeButton = document.getElementById("hitMeButton");
let stickButton = document.getElementById("stickButton");
hitMeButton.style.display = "none";
stickButton.style.display = "none";

newGameButton.addEventListener("click", function () {
  clearGame();
  gameText.innerHTML = "New game has now started.";
  cards = createDeck();
  cards = shuffleDeck(cards);
  players = setUpPlayers();
  gameText.innerHTML += " > Dealing cards";
  playersCards = initialDeal(players, cards);
  displayDeal(playersCards);
  player1Cards = players.Player1;
  playerScore = calculateScore(player1Cards);
  playerScoreDisplay.innerHTML = playerScore;
  gameText.innerHTML += " > Player has " + playerScore;
  dealerCards = players.Dealer;
  dealerScore = calculateScore([dealerCards[0]]);
  dealerScoreDisplay.innerHTML = dealerScore;
  determinePlayerOptions(playerScore);
});

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
  let playerOneCards = players.Player1;
  let dealerCards = players.Dealer;
  playerText.innerHTML += "Player 1 has ";
  playerText.innerHTML += cardDetails(playerOneCards[0]);
  renderCard(playerOneCards[0], playerArea);
  playerText.innerHTML += ", ";
  playerText.innerHTML += cardDetails(playerOneCards[1]);
  renderCard(playerOneCards[1], playerArea);
  dealerText.innerHTML += "Dealer has ";
  dealerText.innerHTML += cardDetails(dealerCards[0]);
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
    gameText.innerHTML += " > Player 1 has Blackjack";
    dealerTurn();
    return false;
  } else if (playerScore < 21) {
    hitMeButton.style.display = "inline";
    stickButton.style.display = "inline";
    return true;
  } else {
    gameText.innerHTML += " > Player 1 is Bust > Dealer WINS";
    disablePlayerActions();
    return false;
  }
}

function dealerTurn() {
  disablePlayerActions();
  renderCard(dealerCards[1], dealerArea);
  dealerCards = players.Dealer;
  dealerText.innerHTML += ", ";
  dealerText.innerHTML += cardDetails(dealerCards[1]);
  dealerScore = calculateScore(dealerCards);
  dealerScoreDisplay.innerHTML = dealerScore;
  gameText.innerHTML += " > Dealer has " + dealerScore;
  while (dealerScore < 17) {
    newCard = dealCard(cards);
    dealerCards.push(newCard);
    renderCard(newCard, dealerArea);
    dealerScore = calculateScore(dealerCards);
    dealerScoreDisplay.innerHTML = dealerScore;
    dealerText.innerHTML += ", ";
    dealerText.innerHTML += cardDetails(newCard);
    gameText.innerHTML += " > Dealer now has " + dealerScore;
  }
  if (dealerScore > 17 && dealerScore < 22) {
    determineWinner();
    return;
  } else {
    gameText.innerHTML += " > Dealer is Bust > Player 1 WINS";
    return;
  }
}

function determineWinner() {
  if (playerScore > dealerScore) {
    gameText.innerHTML += " > Player 1 WINS";
  } else if (playerScore === dealerScore) {
    gameText.innerHTML += " > Game is a draw";
  } else {
    gameText.innerHTML += " > Dealer WINS";
  }
}

function clearGame() {
  gameText.innerHTML = "";
  playerText.innerHTML = "";
  dealerText.innerHTML = "";
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
  playerText.innerHTML += ", ";
  playerText.innerHTML += cardDetails(newCard);
  gameText.innerHTML += " > Player now has " + playerScore;
  determinePlayerOptions(playerScore);
});

stickButton.addEventListener("click", function () {
  dealerTurn();
});

function disablePlayerActions() {
  hitMeButton.disabled = true;
  stickButton.disabled = true;
}

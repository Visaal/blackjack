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

function setUpPlayers() {
  // structure: [["Player 1", [cards stored here]], ["Player 2", [cards stored here]]
  let players = [];
  players.push(["Player 1", []]);
  players.push(["Dealer", []]);
  return players;
}

function initialDeal(players, cardDeck) {
  for (i = 0; i < 2; i++) {
    players[0][1].push(dealCard(cardDeck));
    players[1][1].push(dealCard(cardDeck));
  }
  return players;
}

function displayDeal(players) {
  dealInfo = "";
  playerOneCards = players[0][1];
  playerText.innerHTML += "Player 1 has ";
  playerText.innerHTML += cardDetails(playerOneCards[0]);
  playerText.innerHTML += ", ";
  playerText.innerHTML += cardDetails(playerOneCards[1]);
  dealerCards = players[1][1];
  dealerText.innerHTML += "Dealer has ";
  dealerText.innerHTML += cardDetails(dealerCards[0]);
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
  dealerCards = playersCards[1][1];
  dealerText.innerHTML += ", ";
  dealerText.innerHTML += cardDetails(dealerCards[1]);
  dealerScore = calculateScore(dealerCards);
  dealerScoreDisplay.innerHTML = dealerScore;
  gameText.innerHTML += " > Dealer has " + dealerScore;
  while (dealerScore < 17) {
    newCard = dealCard(cards);
    dealerCards.push(newCard);
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
}

// Show all the in game commentry
let gameText = document.getElementById("gameText");
let playerText = document.getElementById("playerText");
let playerScoreDisplay = document.getElementById("playerScore");
let dealerText = document.getElementById("dealerText");
let dealerScoreDisplay = document.getElementById("dealerScore");

let newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", function () {
  clearGame();
  gameText.innerHTML = "New game has now started.";
  cards = createDeck();
  cards = shuffleDeck(cards);
  players = setUpPlayers();
  gameText.innerHTML += " > Dealing cards";
  playersCards = initialDeal(players, cards);
  displayDeal(playersCards);
  player1Cards = playersCards[0][1];
  playerScore = calculateScore(player1Cards);
  playerScoreDisplay.innerHTML = playerScore;
  gameText.innerHTML += " > Player has " + playerScore;
  determinePlayerOptions(playerScore);
});

let hitMeButton = document.getElementById("hitMeButton");
let stickButton = document.getElementById("stickButton");
hitMeButton.style.display = "none";
stickButton.style.display = "none";

hitMeButton.addEventListener("click", function () {
  newCard = dealCard(cards);
  player1Cards.push(newCard);
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

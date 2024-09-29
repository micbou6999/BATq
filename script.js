const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const valueMap = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 1
};

function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value };
}

function calculatePoints(cards) {
    let total = cards.reduce((sum, card) => sum + valueMap[card.value], 0);
    return total % 10;
}

function dealCards() {
    return [getRandomCard(), getRandomCard()];
}

function generateCardImageFileName(card) {
    let cardName;
    if (card.value === 'A') {
        cardName = 'ace';
    } else if (card.value === 'K') {
        cardName = 'king';
    } else if (card.value === 'Q') {
        cardName = 'queen';
    } else if (card.value === 'J') {
        cardName = 'jack';
    } else {
        cardName = card.value;
    }

    if (['A', 'K', 'Q', 'J'].includes(card.value)) {
        return `card/${cardName}_of_${card.suit}2.svg`;
    } else {
        return `card/${cardName}_of_${card.suit}.svg`;
    }
}

function displayCards(cards, elementId) {
    const cardContainer = document.getElementById(elementId);
    cardContainer.innerHTML = '';  
    cards.forEach(card => {
        const imgElement = document.createElement('img');
        imgElement.src = generateCardImageFileName(card);
        imgElement.classList.add('card');
        cardContainer.appendChild(imgElement);
    });
}

function displayPoints(points, elementId) {
    document.getElementById(elementId).innerHTML = `${points} points`;
}

function displayResult(resultText) {
    document.getElementById('result').innerHTML = resultText;
}

function checkSpecialBets(playerCards, bankerCards) {
    const playerPoints = calculatePoints(playerCards);
    const bankerPoints = calculatePoints(bankerCards);

    let sun7 = false, moon8 = false, supreme7 = false, divine9 = false, eclipse = false;

    // Sun 7: Banker wins with a 3-Card 7
    if (bankerPoints === 7 && bankerCards.length === 3 && bankerPoints > playerPoints) {
        sun7 = true;
    }

    // Moon 8: Player wins with a 3-Card 8
    if (playerPoints === 8 && playerCards.length === 3 && playerPoints > bankerPoints) {
        moon8 = true;
    }

    // Supreme 7: Both Player and Banker have either a 2-Card 7 or a 3-Card 7
    if ((playerPoints === 7 && playerCards.length === 2 && bankerPoints === 7 && bankerCards.length === 2) || 
        (playerPoints === 7 && playerCards.length === 3 && bankerPoints === 7 && bankerCards.length === 3)) {
        supreme7 = true;
    }

    // Divine 9: Either Player or Banker has a 3-Card 9
    if ((playerPoints === 9 && playerCards.length === 3) || (bankerPoints === 9 && bankerCards.length === 3)) {
        divine9 = true;
    }

    // Eclipse: Any of the other four events occur
    if (sun7 || moon8 || supreme7 || divine9) {
        eclipse = true;
    }

    document.getElementById('sun7-result').innerText = `Sun 7: ${sun7 ? 'Yes' : 'No'}`;
    document.getElementById('moon8-result').innerText = `Moon 8: ${moon8 ? 'Yes' : 'No'}`;
    document.getElementById('supreme7-result').innerText = `Supreme 7: ${supreme7 ? 'Yes' : 'No'}`;
    document.getElementById('divine9-result').innerText = `Divine 9: ${divine9 ? 'Yes' : 'No'}`;
    document.getElementById('eclipse-result').innerText = `Eclipse: ${eclipse ? 'Yes' : 'No'}`;
}

function bankerDrawsThirdCard(bankerPoints, playerThirdCard) {
    if (bankerPoints <= 2) return true;
    if (bankerPoints === 3 && playerThirdCard.value !== '8') return true;
    if (bankerPoints === 4 && ['2', '3', '4', '5', '6', '7'].includes(playerThirdCard.value)) return true;
    if (bankerPoints === 5 && ['4', '5', '6', '7'].includes(playerThirdCard.value)) return true;
    if (bankerPoints === 6 && ['6', '7'].includes(playerThirdCard.value)) return true;
    return false;
}

document.getElementById('deal-button').addEventListener('click', function() {
    const playerCards = dealCards();
    const bankerCards = dealCards();

    displayCards(playerCards, 'player-cards');
    displayCards(bankerCards, 'banker-cards');

    const playerPoints = calculatePoints(playerCards);
    const bankerPoints = calculatePoints(bankerCards);

    displayPoints(playerPoints, 'player-points');
    displayPoints(bankerPoints, 'banker-points');

    let playerThirdCard;
    if (playerPoints <= 5) {
        playerThirdCard = getRandomCard();
        playerCards.push(playerThirdCard);
        displayCards(playerCards, 'player-cards');
    }

    let bankerThirdCard;
    if (bankerDrawsThirdCard(bankerPoints, playerThirdCard)) {
        bankerThirdCard = getRandomCard();
        bankerCards.push(bankerThirdCard);
        displayCards(bankerCards, 'banker-cards');
    }

    const finalPlayerPoints = calculatePoints(playerCards);
    const finalBankerPoints = calculatePoints(bankerCards);

    if (finalPlayerPoints > finalBankerPoints) {
        displayResult(`Player wins with ${finalPlayerPoints} points!`);
    } else if (finalBankerPoints > finalPlayerPoints) {
        displayResult(`Banker wins with ${finalBankerPoints} points!`);
    } else {
        displayResult("It's a tie!");
    }

    // Check and display the results of special bets
    checkSpecialBets(playerCards, bankerCards);
});

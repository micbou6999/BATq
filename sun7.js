// Function to initialize the shoe with the given number of decks
function initializeShoe(deckCount) {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const shoe = [];

    for (let i = 0; i < deckCount; i++) {
        suits.forEach(suit => {
            values.forEach(value => {
                shoe.push({ suit, value });
            });
        });
    }

    // Shuffle the shoe
    for (let i = shoe.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
    }

    return shoe;
}

// Function to calculate Baccarat points
function calculatePoints(cards) {
    const valueMap = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 1
    };
    let total = cards.reduce((sum, card) => sum + valueMap[card.value], 0);
    return total % 10;
}

// Function to simulate a single round of Baccarat and track special bets
function simulateRound(shoe) {
    const playerCards = [shoe.pop(), shoe.pop()];
    const bankerCards = [shoe.pop(), shoe.pop()];

    const playerPoints = calculatePoints(playerCards);
    const bankerPoints = calculatePoints(bankerCards);

    let playerThirdCard;
    if (playerPoints <= 5) {
        playerThirdCard = shoe.pop();
        playerCards.push(playerThirdCard);
    }

    let bankerThirdCard;
    if (bankerPoints <= 2 || (bankerPoints === 3 && playerThirdCard && playerThirdCard.value !== '8') ||
        (bankerPoints === 4 && playerThirdCard && ['2', '3', '4', '5', '6', '7'].includes(playerThirdCard.value)) ||
        (bankerPoints === 5 && playerThirdCard && ['4', '5', '6', '7'].includes(playerThirdCard.value)) ||
        (bankerPoints === 6 && playerThirdCard && ['6', '7'].includes(playerThirdCard.value))) {
        bankerThirdCard = shoe.pop();
        bankerCards.push(bankerThirdCard);
    }

    const finalPlayerPoints = calculatePoints(playerCards);
    const finalBankerPoints = calculatePoints(bankerCards);

    let result = {
        winner: finalPlayerPoints > finalBankerPoints ? 'player' : finalBankerPoints > finalPlayerPoints ? 'banker' : 'tie',
        sun7: false,
        moon8: false
    };

    // Sun 7: Banker wins with a 3-Card 7
    if (finalBankerPoints === 7 && bankerCards.length === 3 && finalBankerPoints > finalPlayerPoints) {
        result.sun7 = true;
    }

    // Moon 8: Player wins with a 3-Card 8
    if (finalPlayerPoints === 8 && playerCards.length === 3 && finalPlayerPoints > finalBankerPoints) {
        result.moon8 = true;
    }

    return result;
}

// Function to handle the simulation and display the results
document.getElementById('simulate-button').addEventListener('click', function() {
    const deckCount = parseInt(document.getElementById('deck-count').value);

    if (isNaN(deckCount) || deckCount <= 0) {
        alert('Please enter a valid number of decks.');
        return;
    }

    const totalCards = deckCount * 52;
    document.getElementById('shoe-size').value = totalCards; // Display the total number of cards in the shoe

    const shoe = initializeShoe(deckCount);
    const resultsGrid = document.getElementById('results-grid');
    resultsGrid.innerHTML = ''; // Clear previous results

    let currentRow = 0;
    let currentColumn = 0;

    while (shoe.length >= 6) { // Need at least 6 cards for a round
        const result = simulateRound(shoe);

        const resultElement = document.createElement('div');
        resultElement.classList.add('result');

        if (result.winner === 'player') {
            resultElement.classList.add('player');
            resultElement.textContent = 'Player Wins';
        } else if (result.winner === 'banker') {
            resultElement.classList.add('banker');
            resultElement.textContent = 'Banker Wins';
        } else {
            resultElement.classList.add('tie');
            resultElement.textContent = 'Tie';
        }

        if (result.sun7) {
            resultElement.classList.add('sun7');
            resultElement.textContent = 'Sun 7: Banker Wins with 3-Card 7';
        }

        if (result.moon8) {
            resultElement.classList.add('moon8');
            resultElement.textContent = 'Moon 8: Player Wins with 3-Card 8';
        }

        // Determine the position in the grid
        if (currentRow === 6) {
            currentRow = 0;
            currentColumn++;
        }

        resultsGrid.appendChild(resultElement);
        currentRow++;
    }
});

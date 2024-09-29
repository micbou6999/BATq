// Initialize the shoe with a specified number of decks
let shoe = initializeShoe(8); // Start with 8 decks

// Statistics tracking
let playerWins = 0;
let bankerWins = 0;
let ties = 0;
let sun7Occurrences = 0;
let moon8Occurrences = 0;
let supreme7Occurrences = 0;
let divine9Occurrences = 0;
let eclipseOccurrences = 0;

// Initialize shoe
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

    return shoe;
}

// Parse input cards and remove them from the shoe
function parseAndRemoveCards(input, shoe) {
    const valueMap = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 'jack', 'Q': 'queen', 'K': 'king', 'A': 'ace' };
    const cards = input.trim().split(' ');

    cards.forEach(card => {
        const value = valueMap[card.toUpperCase()];
        const index = shoe.findIndex(c => c.value === value);
        if (index > -1) shoe.splice(index, 1); // Remove the card from the shoe
    });
}

// Calculate the probability of Sun 7 based on remaining cards
function calculateSun7Probability(shoe) {
    const remainingSevens = shoe.filter(card => card.value === '7').length;
    const remainingCards = shoe.length;
    return (remainingSevens / remainingCards) * 100;
}

// Update the statistics section
function updateStatistics() {
    document.getElementById('remaining-cards').innerText = shoe.length;
    document.getElementById('player-wins').innerText = playerWins;
    document.getElementById('banker-wins').innerText = bankerWins;
    document.getElementById('ties').innerText = ties;
    document.getElementById('sun7-occurrences').innerText = sun7Occurrences;
    document.getElementById('moon8-occurrences').innerText = moon8Occurrences;
    document.getElementById('supreme7-occurrences').innerText = supreme7Occurrences;
    document.getElementById('divine9-occurrences').innerText = divine9Occurrences;
    document.getElementById('eclipse-occurrences').innerText = eclipseOccurrences;

    const totalRounds = playerWins + bankerWins + ties;
    if (totalRounds > 0) {
        document.getElementById('player-win-bar').style.width = `${(playerWins / totalRounds) * 100}%`;
        document.getElementById('banker-win-bar').style.width = `${(bankerWins / totalRounds) * 100}%`;
        document.getElementById('tie-bar').style.width = `${(ties / totalRounds) * 100}%`;
    }
}

document.getElementById('add-cards-button').addEventListener('click', function() {
    const input = document.getElementById('sun7-cards-input').value;

    // Parse and remove the input cards from the shoe
    parseAndRemoveCards(input, shoe);

    // Calculate and display Sun 7 probability
    const probability = calculateSun7Probability(shoe);
    document.getElementById('sun7-probability-result').innerText = `Sun 7 Probability: ${probability.toFixed(2)}%`;

    // Update statistics after adding cards
    updateStatistics();

    // Clear the input field for the next input
    document.getElementById('sun7-cards-input').value = '';
});

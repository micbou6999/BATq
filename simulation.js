// Function to initialize the shoe with the given number of decks
function initializeShoe(deckCount) {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const shoe = [];

    // Add all decks' cards to the shoe
    for (let i = 0; i < deckCount; i++) {
        suits.forEach(suit => {
            values.forEach(value => {
                shoe.push({ suit, value });
            });
        });
    }

    // Shuffle the entire shoe (all decks combined) thoroughly
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

    let sun7 = false, moon8 = false, supreme7 = false, divine9 = false, eclipse = false;

    // Sun 7: Banker wins with a 3-Card 7
    if (finalBankerPoints === 7 && bankerCards.length === 3 && finalBankerPoints > finalPlayerPoints) {
        sun7 = true;
        console.log("Sun 7 condition met: Banker 3-card 7 wins!");
    }

    // Moon 8: Player wins with a 3-Card 8
    if (finalPlayerPoints === 8 && playerCards.length === 3 && finalPlayerPoints > finalBankerPoints) {
        moon8 = true;
        console.log("Moon 8 condition met: Player 3-card 8 wins!");
    }

    // Supreme 7: Both Player and Banker have either a 2-Card 7 or a 3-Card 7
    if ((finalPlayerPoints === 7 && playerCards.length === 2 && finalBankerPoints === 7 && bankerCards.length === 2) || 
        (finalPlayerPoints === 7 && playerCards.length === 3 && finalBankerPoints === 7 && bankerCards.length === 3)) {
        supreme7 = true;
        console.log("Supreme 7 condition met: Both hands have 7 points.");
    }

    // Divine 9: Either Player or Banker has a 3-Card 9
    if ((finalPlayerPoints === 9 && playerCards.length === 3) || (finalBankerPoints === 9 && bankerCards.length === 3)) {
        divine9 = true;
        console.log("Divine 9 condition met: A hand has 3-card 9.");
    }

    // Eclipse: Any of the other four events occur
    if (sun7 || moon8 || supreme7 || divine9) {
        eclipse = true;
        console.log("Eclipse condition met: At least one special event occurred.");
    }

    return {
        winner: finalPlayerPoints > finalBankerPoints ? 'player' : finalBankerPoints > finalPlayerPoints ? 'banker' : 'tie',
        sun7,
        moon8,
        supreme7,
        divine9,
        eclipse
    };
}

// Function to simulate multiple rounds
function simulateShoe(deckCount, simulations) {
    let playerWins = 0;
    let bankerWins = 0;
    let roundsPlayed = 0;
    let sun7Wins = 0, moon8Wins = 0, supreme7Wins = 0, divine9Wins = 0, eclipseWins = 0;

    for (let i = 0; i < simulations; i++) {
        let shoe = initializeShoe(deckCount);

        while (shoe.length >= 6) { // Need at least 6 cards for a round
            const result = simulateRound(shoe);
            roundsPlayed++;

            if (result.winner === 'player') {
                playerWins++;
            } else if (result.winner === 'banker') {
                bankerWins++;
            }

            if (result.sun7) sun7Wins++;
            if (result.moon8) moon8Wins++;
            if (result.supreme7) supreme7Wins++;
            if (result.divine9) divine9Wins++;
            if (result.eclipse) eclipseWins++;
        }
    }

    return { roundsPlayed, playerWins, bankerWins, sun7Wins, moon8Wins, supreme7Wins, divine9Wins, eclipseWins };
}

// Event listener for the simulation button
document.getElementById('simulate-button').addEventListener('click', function() {
    const deckCount = parseInt(document.getElementById('deck-count').value);
    const simulations = parseInt(document.getElementById('simulation-count').value);

    if (isNaN(deckCount) || isNaN(simulations) || deckCount <= 0 || simulations <= 0) {
        alert('Please enter valid numbers for both fields.');
        return;
    }

    const totalCards = deckCount * 52;
    document.getElementById('shoe-size').value = totalCards; // Display the total number of cards in the shoe

    const results = simulateShoe(deckCount, simulations);

    document.getElementById('rounds-played').innerText = `Rounds Played: ${results.roundsPlayed}`;
    document.getElementById('player-wins').innerText = `Player Wins: ${results.playerWins}`;
    document.getElementById('banker-wins').innerText = `Banker Wins: ${results.bankerWins}`;
    document.getElementById('sun7-wins').innerText = `Sun 7 Wins: ${results.sun7Wins}`;
    document.getElementById('moon8-wins').innerText = `Moon 8 Wins: ${results.moon8Wins}`;
    document.getElementById('supreme7-wins').innerText = `Supreme 7 Wins: ${results.supreme7Wins}`;
    document.getElementById('divine9-wins').innerText = `Divine 9 Wins: ${results.divine9Wins}`;
    document.getElementById('eclipse-wins').innerText = `Eclipse Wins: ${results.eclipseWins}`;
});

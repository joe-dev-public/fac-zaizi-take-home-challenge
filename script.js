'use strict';

/*

    Possible approach:

        - Generate 1,000 (more? less?) pseudo-random (PR) numbers between 1 and 3, and store them in an array.
        - Show the user (graphically) that the distribution is "approximately uniform".
            (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
        - These PRNs determine which door the player picks, for a number of game simulations.
        - Do different sets of simulations (each time using the entire PRN array).
        - The winning door (car) will naturally be set at the start of each set.
        - You can have 3 different winning positions.
        - You can have 2 different approaches (stick, switch).
        - So you could do at least 6 simulations?
        - Show a graphical representation of the simulation (number of wins for that strategy).


    Notes:

        - Do we actually need to work with the same set of PRNs?
        - Are we doing that to reassure the user about randommness?
        - Will it actually reassure them? :)

*/



function drawChart(stickData, switchData) {

    const myLabels = [];
    for (let i = 1; i <= numberOfGamesToSimulate; i++) {
        myLabels.push(i);
    }

    const data = {
        labels: myLabels,
        datasets: [
            {
                label: '"Stick" strategy',
                backgroundColor: 'rgb(255, 128, 0)',
                data: stickData,
            },
            {
                label: '"Switch" strategy',
                backgroundColor: 'rgb(0, 128, 255)',
                data: switchData,
            },
        ]
    };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            events: [], // Don't need scatter point details on mouse hover
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of games played",
                    },
                },
                y: {
                    beginAtZero: true,
                    suggestedMin: 0,
                    suggestedMax: numberOfGamesToSimulate,
                    title: {
                        display: true,
                        text: 'Number of wins (cumulative)',
                    },
                },
            },
        },
    };

    // Make the text a bit bigger:
    Chart.defaults.font.size = 16;

    if (myChart) {
        // If chart already exists, destroy it before creating a new one:
        myChart.destroy();
    } 

    myChart = new Chart(
        document.getElementById('chart'),
        config
    );



    // Now draw the second chart
    // It'll need new data to be generated: 10 randomised sets of x simulations
    // plus a basic linear regression (Trend line) calc beneath?

/*     const myLabels2 = [];
    for (let i = 1; i <= numberOfSimulationSets; i++) {
        myLabels.push(i);
    }

    const data = {
        labels: myLabels,
        datasets: [
            {
                label: '"Stick" strategy',
                backgroundColor: 'rgb(255, 128, 0)',
                //data: stickData,
            },
            {
                label: '"Switch" strategy',
                backgroundColor: 'rgb(0, 128, 255)',
                //data: switchData,
            },
        ]
    };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            events: [], // Don't need scatter point details on mouse hover
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Simulation set",
                    },
                },
                y: {
                    beginAtZero: true,
                    suggestedMin: 0,
                    //suggestedMax: numberOfGamesToSimulate,
                    title: {
                        display: true,
                        text: 'Total number of switch wins / total number of stick wins',
                    },
                },
            },
        },
    };

    // Make the text a bit bigger:
    Chart.defaults.font.size = 16;

    if (myChart) {
        // If chart already exists, destroy it before creating a new one:
        myChart.destroy();
    } 

    myChart = new Chart(
        document.getElementById('chart'),
        config
    ); */


}



function updateConclusions(stickData, switchData) {

    document.querySelectorAll('.total-number-of-games').forEach((el) => {
        el.innerText = numberOfGamesToSimulate;
    });

    document.querySelectorAll('.total-number-of-stick-wins').forEach((el) => {
        el.innerText = stickData[stickData.length - 1];
    });

    document.querySelectorAll('.total-number-of-switch-wins').forEach((el) => {
        el.innerText = switchData[switchData.length - 1];
    });

    // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    document.querySelectorAll('.switch-vs-stick-calculation').forEach((el) => {
        el.innerText = Math.round(
            ((switchData[switchData.length - 1] / stickData[stickData.length - 1]) + Number.EPSILON) * 100
        ) / 100;
    });

}



// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}



function runSimulationsA() {

    const pseudoRandomNumbers = [];

    for (let i = 0; i < numberOfGamesToSimulate; i++) {
        pseudoRandomNumbers.push(getRandomInt(1, 4));
    }


    // My game-playing loops effectively hard-code the probabilities.
    // Is this a good way of convincing an observer?
    // Maybe not, it feels like it's a logical loop!
    // Does it make more sense to use two different groups for the stick vs stay games?
    // (Or even a different group for every game?)


    // Games 1-3: stick

    // First door wins, second door wins, etc.:
    const game1Setup = [1, 0, 0];
    const game2Setup = [0, 1, 0];
    const game3Setup = [0, 0, 1];

    // Games 4-6: switch
    const game4Setup = [1, 0, 0];
    const game5Setup = [0, 1, 0];
    const game6Setup = [0, 0, 1];


    const stickSetup1Results = [];
    const stickSetup2Results = [];
    const stickSetup3Results = [];
    const switchSetup1Results = [];
    const switchSetup2Results = [];
    const switchSetup3Results = [];


    pseudoRandomNumbers.forEach((playerDoorSelection, index) => {

        const selectedDoor = playerDoorSelection - 1;

        if (game1Setup[selectedDoor] === 1) {
            // The player's initial guess was correct.
            // This is the only case in which the "stick" strategy leads to a win.
            // So, no other branch needs to be handled, we can just tally the win.
            stickSetup1Results.push(true);
        } else {
            stickSetup1Results.push(false);
        }

        // The two other games naturally play out the same way:
        if (game2Setup[selectedDoor] === 1) {
            stickSetup2Results.push(true);
        } else {
            stickSetup2Results.push(false);
        }
        if (game3Setup[selectedDoor] === 1) {
            stickSetup3Results.push(true);
        } else {
            stickSetup3Results.push(false);
        }


        if (game4Setup[selectedDoor] === 1) {
            // The player's initial guess was correct.
            // This is the only case in which the "switch" strategy leads to a loss.
            // (Do nothing.)
            switchSetup1Results.push(false);
        } else {
            // The player's initial guess was incorrect. A losing door is opened.
            // The remaining (unopened) door is the winning one.
            // As the switch strategy is being used, the player now wins.
            switchSetup1Results.push(true);
        }

        /*  In other words: at the start of the game, you've got 1/3 chance of picking the car,
            and 2/3 chance of picking a goat.
            If you pick a goat and switch, you're guaranteed to win.
            If you pick the car and switch, you're guaranteed to lose.
            (This is approaching a complete listing of the sample space, but neverthless
            it feels like a neat way to explain the logic of the solution :)

            If you pick a goat and stick, you're guaranteed to lose.
            If you pick the car and stick, you're guaranteed to win.
        */

        if (game5Setup[selectedDoor] === 0) {
            switchSetup2Results.push(true);
        } else {
            switchSetup2Results.push(false);
        }

        if (game6Setup[selectedDoor] === 0) {
            switchSetup3Results.push(true);
        } else {
            switchSetup3Results.push(false);
        }

    });


    // Scatter plot game results and a trend line will naturally emerge.
    // x-axis: number of games played. y-axis: number of wins (cumulative)

    const stickSetup1CumulativeResults = [];
    const switchSetup1CumulativeResults = [];

    for (const result of stickSetup1Results) {
        const previousVal = stickSetup1CumulativeResults[stickSetup1CumulativeResults.length - 1] || 0;
        if (result === true) {
            stickSetup1CumulativeResults.push(previousVal + 1);
        } else {
            stickSetup1CumulativeResults.push(previousVal);
        }
    }

    for (const result of switchSetup1Results) {
        const previousVal = switchSetup1CumulativeResults[switchSetup1CumulativeResults.length - 1] || 0;
        if (result === true) {
            switchSetup1CumulativeResults.push(previousVal + 1);
        } else {
            switchSetup1CumulativeResults.push(previousVal);
        }
    }


    // OK, that's a reasonable first pass "proof".
    // To be more convincing, maybe it should "play the game" more than it currently does.

    drawChart(stickSetup1CumulativeResults, switchSetup1CumulativeResults);

    updateConclusions(stickSetup1CumulativeResults, switchSetup1CumulativeResults);

}
// End of function runSimulationsA



function runSimulationsB() {

    const playerInitialGuesses = [];
    const winningDoors = [];

    // A different set of PRNs, 1-3 inclusive, in each array:
    for (let i = 0; i < numberOfGamesToSimulate; i++) {
        playerInitialGuesses.push(getRandomInt(1, 4));
        winningDoors.push(getRandomInt(1, 4));
    }

    const stickResults = [];
    const switchResults = [];

    // Simulation approach A logic, but tidied up:
    playerInitialGuesses.forEach((playerInitialGuess, index) => {
        if (winningDoors[index] === playerInitialGuess) {
            // The player's initial guess was correct. (1/3 probability)
            // This is the only case in which the "stick" strategy leads to a win.
            // So we can immediately tally a win to the stick results:
            stickResults.push(true);
            // Conversely, this is the only case where the "switch" strategy leads to a loss.
            // So we can immediately tally a loss to the switch results:
            switchResults.push(false);
        } else {
            // The player's initial guess was incorrect. (2/3 probability)
            // Sticking with an incorrect guess obviously means a loss is guaranteed.
            // So we can immediately tally a loss to the stick results:
            stickResults.push(false);
            // Because the host must open a losing door, the "switch" strategy leads to a win.
            // So we can immediately tally a win to the switch results:
            switchResults.push(true);
        }
    });

    // Set up cumulative data for scatter plot:

    const stickCumulativeResults = [];
    const switchCumulativeResults = [];

    for (const result of stickResults) {
        const previousVal = stickCumulativeResults[stickCumulativeResults.length - 1] || 0;
        if (result === true) {
            stickCumulativeResults.push(previousVal + 1);
        } else {
            stickCumulativeResults.push(previousVal);
        }
    }

    for (const result of switchResults) {
        const previousVal = switchCumulativeResults[switchCumulativeResults.length - 1] || 0;
        if (result === true) {
            switchCumulativeResults.push(previousVal + 1);
        } else {
            switchCumulativeResults.push(previousVal);
        }
    }

    drawChart(stickCumulativeResults, switchCumulativeResults);

    updateConclusions(stickCumulativeResults, switchCumulativeResults);

}
// End of function runSimulationsB



let myChart = undefined;

// Set a default number of games to simulate, and also let the user change this
// (which will hopefully help convince them! :)
let numberOfGamesToSimulate = 100;

let numberOfSimulationSets = 10;

const formEl = document.querySelector('form');
const formRangeEl = document.querySelector('input[type=range]');
const formSubmitEl = document.querySelector('input[type=submit]');

formRangeEl.value = numberOfGamesToSimulate;
formSubmitEl.value = `Simulate ${numberOfGamesToSimulate} games`;

formRangeEl.addEventListener('input', (event) => {
    formSubmitEl.value = `Simulate ${event.target.value} games`;
});

formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    numberOfGamesToSimulate = formRangeEl.value;
    //runSimulationsA();
    runSimulationsB();
});

//runSimulationsA();

runSimulationsB();

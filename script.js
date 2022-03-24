'use strict';

/*

    Approach:
    ---------
        - Generate two sets of 10-1000 pseudo-random (PR) numbers, 1-3 inclusive.
        - Store them in an array.
        - These PRN sets determine:
            - Which door the player initially picks.
            - Which is the winning door.
        - Run a simulation using the full PRN arrays.
        - Show a graphical representation of the simulation (number of wins for that strategy).


    Stretch goals?
    --------------
        - Reinforce the result with multiple sets:
            - Do multiple sets of 10-1000 simulations.
            - Store the results each time.
            - Calculate the ratio switch wins/stick wins for each run of simulations.
            - Show the user a scatter plot of these to reinforce that the switch strategy is
                roughly 2x more successful than the stick strategy.

        - Reassure the user about the nature of the PRNs used:
            - Show the user (bar graph?) that the distribution of PRNs used is "approx. uniform".
                (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)


    A breakdown of the probabilities/solution for my own sake :)
    ------------------------------------------------------------
        - At the start of the game, you've got:
            - 1/3 chance of picking the car, and
            - 2/3 chance of picking a goat.
        - If you pick a goat (2/3) and switch, you're guaranteed to win.
        - If you pick the car (1/3) and switch, you're guaranteed to lose.
        - (So if you use the switch strategy, you'll win 2/3 of the time.)
        - If you pick a goat (2/3) and stick, you're guaranteed to lose.
        - If you pick the car (1/3) and stick, you're guaranteed to win.
        - (So if you use the stick strategy, you'll win 1/3 of the time.)

*/



function drawChart(stickData, switchData) {

    // Scatter plot game results and a trend line should emerge to the viewer.
    // x-axis: number of games played. y-axis: number of wins (cumulative)

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

    document.querySelectorAll('.total-number-of-simulation-sets').forEach((el) => {
        el.innerText = numberOfSimulationSets;
    });
    

}



function storeResults(totalNumberOfStickWins, totalNumberOfSwitchWins) {

    allStickResults.push(totalNumberOfStickWins);
    allSwitchResults.push(totalNumberOfSwitchWins);

}
// End of function storeResults



// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}



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

    // Store just the final cumulative score (number of wins)
    storeResults(stickCumulativeResults[stickCumulativeResults.length - 1], switchCumulativeResults[switchCumulativeResults.length - 1]);

    // That's a reasonable "proof".
    // To be more convincing, could the code "play the game" more than it currently does?

}
// End of function runSimulationsB


function drawAggregateChart(myData) {

    // Now draw the second chart
    // It'll need new data to be generated: 10 randomised sets of x simulations
    // plus a basic linear regression (Trend line) calc beneath?

    const myLabels = [];
    for (let i = 1; i <= numberOfSimulationSets; i++) {
        myLabels.push(i);
    }

    const data = {
        labels: myLabels,
        datasets: [
            {
                label: 'Success of "switch" vs "stick" strategy',
                backgroundColor: 'rgb(128, 200, 0)',
                data: myData,
            },
        ]
    };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            events: [],
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
                    suggestedMax: 5,
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

    if (myChart2) {
        // If chart already exists, destroy it before creating a new one:
        myChart2.destroy();
    } 

    myChart2 = new Chart(
        document.getElementById('chart2'),
        config
    );

}



function runMultipleSimulationSets() {

    // Stop at -1 because the initial page load gives us our first set of results (graphed)
    for (let i = 0; i < numberOfSimulationSets - 1; i++) {

        runSimulationsB();

    }

    // Do the ratio calculations, put these in an array, and draw the relevant chart:

    const ratios = [];

    allSwitchResults.forEach((el, idx) => {
        const ratio = Math.round(((el / allStickResults[idx]) + Number.EPSILON) * 100) / 100;
        ratios.push(ratio);
    });

    console.log(ratios);

    drawAggregateChart(ratios);

}



let allStickResults = [];
let allSwitchResults = [];


let myChart = undefined;
let myChart2 = undefined;

// Set a default number of games to simulate, and also let the user change this
// (which will hopefully help convince them! :)
let numberOfGamesToSimulate = 100;

let numberOfSimulationSets = 50;

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
    runSimulationsB();
});

runSimulationsB();

runMultipleSimulationSets();

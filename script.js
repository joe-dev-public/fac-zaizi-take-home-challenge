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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


const pseudoRandomNumbers = [];

//const labels = [];

for (let i = 0; i < 100; i++) {
    pseudoRandomNumbers.push(getRandomInt(1, 4));
    //labels.push(i);
}

/* const pseudoRandomNumberCount = {
    '1': 0,
    '2': 0,
    '3': 0
}; */

const pseudoRandomNumberCount = [0, 0, 0];

for (const number of pseudoRandomNumbers) {
    //document.querySelector('main').innerHTML += `${number}, `;

    // If using an object:
    //pseudoRandomNumberCount[number]++;

    pseudoRandomNumberCount[number - 1]++;

}

/* const labels1 = ['1', '2', '3'];

const data1 = {
    labels: labels1,
    datasets: [{
        label: 'Pseudo-random number distribution',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: pseudoRandomNumberCount,
    }]
};

const config1 = {
    type: 'bar',
    data: data1,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 1000,
            }
        }
    }
};

const chart1 = new Chart(
    document.getElementById('chart1'),
    config1
); */


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

let game1Wins = 0;
let game2Wins = 0;
let game3Wins = 0;
let game4Wins = 0;
let game5Wins = 0;
let game6Wins = 0;



/* const results = {
    'stick': {},
    'switch': {},
}; */

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
        game1Wins++;

        stickSetup1Results.push(true);
/*         results['stick'][index + 1] = {
            'guess': playerDoorSelection,
            'win': true,
        }; */
    } else {
        stickSetup1Results.push(false);
/*         results['stick'][index + 1] = {
            'guess': playerDoorSelection,
            'win': false,
        }; */
    }

    // The two other games naturally play out the same way:
    if (game2Setup[selectedDoor] === 1) {
        game2Wins++;
        stickSetup2Results.push(true);
    } else { stickSetup2Results.push(false); }
    if (game3Setup[selectedDoor] === 1) {
        game3Wins++;
        stickSetup3Results.push(true);
    } else { stickSetup3Results.push(false); }


    if (game4Setup[selectedDoor] === 1) {
        // The player's initial guess was correct.
        // This is the only case in which the "switch" strategy leads to a loss.
        // (Do nothing.)
        switchSetup1Results.push(false);
    } else {
        // The player's initial guess was incorrect. A losing door is opened.
        // The remaining (unopened) door is the winning one.
        // As the switch strategy is being used, the player now wins.
        game4Wins++;
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
        game5Wins++;
        switchSetup2Results.push(true);
    } else {
        switchSetup2Results.push(false);
    }

    if (game6Setup[selectedDoor] === 0) {
        game6Wins++;
        switchSetup3Results.push(true);
    } else {
        switchSetup3Results.push(false);
    }

});

//console.log(results);



/* const stickWins = [game1Wins, game2Wins, game3Wins];
const switchWins = [game4Wins, game5Wins, game6Wins];

const data2 = {
    labels: ['Door 1 wins', 'Door 2 wins', 'Door 3 wins'],
    datasets: [
        {
            label: 'Number of wins using stick strategy',
            backgroundColor: 'hsl(0, 0%, 30%)',
            borderColor: 'hsl(0, 0%, 100%)',
            data: stickWins,
        },
        {
            label: 'Number of wins using switch strategy',
            backgroundColor: 'hsl(0, 0%, 60%)',
            borderColor: 'hsl(0, 0%, 100%)',
            data: switchWins,
        }
    ]
};

const config2 = {
    type: 'bar',
    data: data2,
    options: {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 1000,
            }
        }
    }
};

const chart2 = new Chart(
    document.getElementById('chart2'),
    config2
); */


// OK, the above works, but it doesn't look super convincing.
// It might be better to plot each game result and then get a line of best fit.
// x-axis: number of games played. y-axis: number of wins (cumulative)

const stickSetup1CumulativeResults = [];
const stickSetup2CumulativeResults = [];
const stickSetup3CumulativeResults = [];
const switchSetup1CumulativeResults = [];
const switchSetup2CumulativeResults = [];
const switchSetup3CumulativeResults = [];

for (const result of stickSetup1Results) {
    const previousVal = stickSetup1CumulativeResults[stickSetup1CumulativeResults.length - 1] || 0;
    if (result === true) {
        stickSetup1CumulativeResults.push(previousVal + 1);
    } else {
        stickSetup1CumulativeResults.push(previousVal);
    }
}
/* for (const result of stickSetup2Results) {
    const previousVal = stickSetup2CumulativeResults[stickSetup2CumulativeResults.length - 1] || 0;
    if (result === true) {
        stickSetup2CumulativeResults.push(previousVal + 1);
    } else {
        stickSetup2CumulativeResults.push(previousVal);
    }
}
for (const result of stickSetup3Results) {
    const previousVal = stickSetup3CumulativeResults[stickSetup3CumulativeResults.length - 1] || 0;
    if (result === true) {
        stickSetup3CumulativeResults.push(previousVal + 1);
    } else {
        stickSetup3CumulativeResults.push(previousVal);
    }
} */
for (const result of switchSetup1Results) {
    const previousVal = switchSetup1CumulativeResults[switchSetup1CumulativeResults.length - 1] || 0;
    if (result === true) {
        switchSetup1CumulativeResults.push(previousVal + 1);
    } else {
        switchSetup1CumulativeResults.push(previousVal);
    }
}
/* for (const result of switchSetup2Results) {
    const previousVal = switchSetup2CumulativeResults[switchSetup2CumulativeResults.length - 1] || 0;
    if (result === true) {
        switchSetup2CumulativeResults.push(previousVal + 1);
    } else {
        switchSetup2CumulativeResults.push(previousVal);
    }
}
for (const result of switchSetup3Results) {
    const previousVal = switchSetup3CumulativeResults[switchSetup3CumulativeResults.length - 1] || 0;
    if (result === true) {
        switchSetup3CumulativeResults.push(previousVal + 1);
    } else {
        switchSetup3CumulativeResults.push(previousVal);
    }
} */



//console.log(allResults);

//console.log(cumulativeResults);

const myLabels = [];
for (let i = 1; i <= 100; i++) {
    myLabels.push(i);
}

const data3 = {
    labels: myLabels,
    datasets: [
        {
            label: 'Stick (door 1 wins)',
            backgroundColor: 'rgb(255, 0, 0)',
            data: stickSetup1CumulativeResults,
        },
/*         {
            label: 'Stick (door 2 wins)',
            backgroundColor: 'rgb(0, 255, 0)',
            data: stickSetup2CumulativeResults,
        },
        {
            label: 'Stick (door 3 wins)',
            backgroundColor: 'rgb(0, 0, 255)',
            data: stickSetup3CumulativeResults,
        }, */
        {
            label: 'Switch (door 1 wins)',
            backgroundColor: 'rgb(255, 255, 0)',
            data: switchSetup1CumulativeResults,
        },
/*         {
            label: 'Switch (door 2 wins)',
            backgroundColor: 'rgb(0, 255, 255)',
            data: switchSetup2CumulativeResults,
        },
        {
            label: 'Switch (door 3 wins)',
            backgroundColor: 'rgb(255, 0, 255)',
            data: switchSetup3CumulativeResults,
        }, */
    ]
};

const config3 = {
    type: 'scatter',
    data: data3,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 100,
            }
        }
    }
};

const chart3 = new Chart(
    document.getElementById('chart3'),
    config3
);

// OK, that's a reasonable first pass "proof".
// To be more convincing, maybe it should "play the game" more than it currently does.

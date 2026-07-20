const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const game = {
    goal: {
        x: 250,
        y: 60,
        width: 400,
        height: 90
    },

    keeper: {
        x: canvas.width / 2,
        y: 175,
        radius: 18
    },

    ball: {
        x: canvas.width / 2,
        y: 590,
        radius: 12,

        moving: false,

        velocityX: 0,
        velocityY: 0,

        curve: 0,
        progress: 0
    },

    shot: {
        aiming: false,

        mouseX: 0,
        mouseY: 0,

        startX: 0,
        startY: 0,

        targetX: 0,
        targetY: 0,

        power: 0,
        curveAmount: 0
    },

    wall: [],

    freeKick: {
        x: canvas.width / 2,
        y: 590,
        wallDistance: 300
    },

    freeKickPositions: [
        {
            x: canvas.width / 2,
            y: 590,
            wallDistance: 300,
            wallPlayers: 5
        },
        {
            x: canvas.width / 2 - 80,
            y: 570,
            wallDistance: 280,
            wallPlayers: 5
        },
        {
            x: canvas.width / 2 + 90,
            y: 610,
            wallDistance: 320,
            wallPlayers: 5
        }
    ],

    positionBag: [],

    currentPosition: null
};

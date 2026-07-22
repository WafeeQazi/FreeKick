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
        radius: 18,

        velocityX: 0,
        targetX: canvas.width / 2,
        acceleration: 0.35,
        maxSpeed: 6,

        state: "idle",
        reactionTime: 220,
        reactionTimer: 0,
        reacted: false,

        predictedX: canvas.width / 2,

        diving: false,
        diveDirection: 0,
        diveSpeed: 10,
        diveDuration: 20,
        diveTimer: 0,

        reach: 42,
        hasTouchedBall: false
    },

    ball: {
        x: canvas.width / 2,
        y: 590,
        z: 0,

        radius: 12,

        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,

        spin: 0,

        moving: false,
        rotating: 0
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
        maxPower: 18
    },

    physics: {
        gravity: 0.28,
        airResistance: 0.995,
        groundFriction: 0.985,
        spinStrength: 0
    },

    wall: [],

    freeKick: {
        x: canvas.width / 2,
        y: 590,
        wallDistance: 300
    },

    freeKickPositions: [
        { x: canvas.width / 2, y: 590, wallDistance: 300, wallPlayers: 5 },
        { x: canvas.width / 2 - 80, y: 570, wallDistance: 280, wallPlayers: 5 },
        { x: canvas.width / 2 + 90, y: 610, wallDistance: 320, wallPlayers: 5 },
        { x: canvas.width / 2 - 140, y: 600, wallDistance: 315, wallPlayers: 4 },
        { x: canvas.width / 2 + 140, y: 600, wallDistance: 315, wallPlayers: 4 },
        { x: canvas.width / 2, y: 545, wallDistance: 255, wallPlayers: 6 },
        { x: canvas.width / 2, y: 625, wallDistance: 340, wallPlayers: 5 },
        { x: canvas.width / 2 - 110, y: 560, wallDistance: 290, wallPlayers: 5 },
        { x: canvas.width / 2 + 110, y: 560, wallDistance: 290, wallPlayers: 5 },
        { x: canvas.width / 2, y: 575, wallDistance: 275, wallPlayers: 5 }
    ],

    positionBag: [],

    currentPosition: null,

    score: {
        goals: 0,
        shots: 0,
        saves: 0
    }
};

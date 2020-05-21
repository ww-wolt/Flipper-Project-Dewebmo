
import {CollisionDetection} from './CollisionDetection.mjs';
import {Ball} from './Ball.mjs';
import {Bumper} from './Bumper.mjs';
import { Line } from './line.mjs';


const table = document.getElementById('table');
const ball = new Ball(table, new Victor(100,100), 20.0);
const bumper = new Bumper(table, new Victor(90,300), 40.0);
const wall1 = new Line(table, new Victor(200, 400), new Victor(400, 300), 4)
const wall2 = new Line(table, new Victor(170, 400), new Victor(50, 300), 4)

const wall3 = new Line(table, new Victor(100, 500), new Victor(500, 600), 4)

const cd = new CollisionDetection();


ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
    ball.reflect(collisionPoint, normal, object.bounciness);
});

cd.addMovingObject(ball);
cd.addStaticObject(bumper);
cd.addStaticObject(wall1);
cd.addStaticObject(wall2);
cd.addStaticObject(wall3);



// Old Code (to be tidied up)


const flipperLeft = {
    flipper: document.getElementById('flipper-left'),
    up: function(){
        turnFlipper(this.flipper, "32deg", "-10deg");
    },
    down: function(){
        turnFlipper(this.flipper, "-10deg", "32deg");
    }
}

const flipperRight = {
    flipper: document.getElementById('flipper-right'),
    up: function(){
        turnFlipper(this.flipper, "-32deg", "10deg");
    },
    down: function(){
        turnFlipper(this.flipper, "10deg", "-32deg");
    }
}


function turnFlipper(flipper, from, to){
    flipper.animate([   
        {transform: 'rotateZ('+from+')'},
        {transform: 'rotateZ('+to+')'},
    ], 
    {duration: 50,  fill: 'both'});
}


function turnClockwise(flipper){
    flipper.animate([   
        {transform: 'rotateZ(32deg)'},
        {transform: 'rotateZ(-10deg)'},
    ], 
    {duration: 50,  fill: 'both'}
    );
}

function turnAnticlockwise(flipper){
    flipper.animate([   
        {transform: 'rotateZ(-10deg)'},
        {transform: 'rotateZ(32deg)'},
    ], 
    {duration: 50,  fill: 'both'}
    );
}


let rightWasUp = true;
let leftWasUp = true;

document.addEventListener("keydown", function(event){
    if (event.key === "ArrowRight" && rightWasUp){
        console.log("Right pressed")
        flipperRight.up();
        rightWasUp = false;
    } else if (event.key === "ArrowLeft" && leftWasUp){
        console.log("Left pressed")
        flipperLeft.up();
        leftWasUp = false;
    }
});

document.addEventListener("keyup", function(event){
    if (event.key === "ArrowRight" && !rightWasUp){
        console.log("Right released")
        flipperRight.down();
        rightWasUp = true;
    } else if (event.key === "ArrowLeft" && !leftWasUp){
        console.log("Left released")
        flipperLeft.down();
        leftWasUp = true;
    }
});
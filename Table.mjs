
import {CollisionDetection, CollisionLine} from './CollisionDetection.mjs';
import {Ball} from './Ball.mjs';
import {Bumper} from './Bumper.mjs';
import { Line } from './line.mjs';
import { Polygon } from './Polygon.mjs';
import { RightFlipper, LeftFlipper} from './flipper.mjs';

export class Table{
    constructor(parent, width, height){

        this._width = width;
        this._height = height;
        this._collisionDetection = new CollisionDetection();

        // Create DOM-Element
        this.elem = document.createElement('DIV');

        this.elem.style.width = width +'px';
        this.elem.style.height = height +'px';
        this.elem.classList.add("table");

        // Append DOM-Element
        parent.appendChild(this.elem);


        // Add table lines to Collision Detection
        const lines = [
            new CollisionLine("Table-Line", new Victor(0,0),  new Victor(width, 0)), 
            new CollisionLine("Table-Line", new Victor(width, 0),  new Victor(width, height)),
            new CollisionLine("Table-Line", new Victor(width, height),  new Victor(0, height)),
            new CollisionLine("Table-Line", new Victor(0, height),  new Victor(0, 0)) ];
        
            for(let line of lines){
            this._collisionDetection.addStaticShape(line);
        }

        
        this.setUpPlayground();
    }



    setUpPlayground(){

        // Set up Ball & Ball Collision Detection & Reflection
        const ball = new Ball(this.elem, new Victor(100,100), 20.0);
        ball.getCollisionShape().addCollisionListener((shape, collisionPoint, normal) => {
                ball.reflect(collisionPoint, normal, shape.bounciness);
        });
        this._collisionDetection.addDynamicObject(ball);


        const rightFlipper = new RightFlipper(this.elem, new Victor(140,550), 100);
        rightFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(rightFlipper.isKicking){
                ball.applyForce(normal.multiplyScalar(20))
                console.log("Kicked Ball");
            }
        });
        this._collisionDetection.addKinematicObject(rightFlipper);

        const leftFlipper = new LeftFlipper(this.elem, new Victor(40,550), 100);
        leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(leftFlipper.isKicking){
                ball.applyForce(normal.multiplyScalar(20))
                console.log("Kicked Ball");
            }
        });
        this._collisionDetection.addKinematicObject(leftFlipper);

        // Create Static Elements
        const staticObjects = [
            new Bumper(this.elem, new Victor(90,300), 40.0),
            new Line(this.elem, new Victor(200, 400), new Victor(400, 300), 4),
            new Line(this.elem, new Victor(150, 400), new Victor(50, 300), 4),
            new Polygon(this.elem, new Victor(200, 175), new Victor(300, 175), new Victor(300, 275), new Victor(200, 275)),
            new Line(this.elem, new Victor(100, 700), new Victor(500, 800), 4)
        ];

        staticObjects.forEach(obj => this._collisionDetection.addStaticObject(obj));


    }
}
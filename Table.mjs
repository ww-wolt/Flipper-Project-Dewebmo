
import {CollisionDetection, CollisionLine} from './CollisionDetection.mjs';
import {Ball} from './Ball.mjs';
import {Bumper} from './Bumper.mjs';
import { Line } from './line.mjs';
import { Path } from './Path.mjs';
import { RightFlipper, LeftFlipper} from './flipper.mjs';
import { HorizontalCurve } from './Curve.mjs';
import { Polygon } from './Polygon.mjs';
import { Circle } from './Circle.mjs';
import { BlackHole } from './BlackHole.mjs';

export class Table{
    constructor(parent, width, height){

        this._width = width;
        this._height = height;
        this._collisionDetection = new CollisionDetection();

        this.bounciness = 1.0;

        // Create DOM-Element
        this.elem = document.createElement('DIV');

        this.elem.style.width = width +'px';
        this.elem.style.height = height +'px';
        this.elem.classList.add("table");

        // Append DOM-Element
        parent.appendChild(this.elem);

        this._walllsPath = new Path(this.elem, true, new Victor(0,0), new Victor(width, 0), new Victor(width, height), new Victor(0, height))


        // // Add table lines to Collision Detection
        // const lines = [
        //     new CollisionLine(this, new Victor(0,0),  new Victor(width, 0)), 
        //     new CollisionLine(this, new Victor(width, 0),  new Victor(width, height)),
        //     new CollisionLine(this, new Victor(width, height),  new Victor(0, height)),
        //     new CollisionLine(this, new Victor(0, height),  new Victor(0, 0)) ];
        
        //     for(let line of lines){
        //     this._collisionDetection.addStaticShape(line);
        // }

        
        this.setUpPlayground();
    }

    getCollisionShape(){
        return this._walllsPath.getCollisionShape();
    }



    setUpPlayground(){

        // Set up Ball & Ball Collision Detection & Reflection
        const ball = new Ball(this.elem, new Victor(100,100), 25.0);
        ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
            object.handleBallCollision(ball, collisionPoint, normal);
        });
        this._collisionDetection.addDynamicObject(ball);


        //setInterval()

        ball.getCollisionShape().addMoveListener(() =>{

            window.scroll({
                top: ball.getPos().y - (window.innerHeight/3),
                left: 0,
                behavior: 'smooth'
            });

            console.log('Table -> setUpPlayground -> window.innnerHeight', window.innnerHeight)
        })


        const leftFlipper = new LeftFlipper(this.elem, new Victor(365,1300));
        leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(leftFlipper.isKicking){
                ball.applyForce(normal.multiplyScalar(30))
                console.log("Kicked Ball");
            }
        });
        this._collisionDetection.addStaticObject(leftFlipper);

        const rightFlipper = new RightFlipper(this.elem, new Victor(535,1300));
        rightFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(rightFlipper.isKicking){
                ball.applyForce(normal.multiplyScalar(30))
                console.log("Kicked Ball");
            }
        });
        this._collisionDetection.addStaticObject(rightFlipper);

        const blackHole = new BlackHole(this.elem, new Victor(500,1450), 100)



        // const curve = new HorizontalCurve(this.elem, 0, 1000, 10, x => {
        //     // Circle Segment
        //     const r = 500 // Radius
        //     x = x % (2*r) - r;
        //     return Math.sqrt(r*r - x*x) + r
        // });

        //constructor(parent, pos, radius, edges, drawnEdges, edgesOffset)

        



        // Create Static Elements
        const staticObjects = [
            new Bumper(this.elem, new Victor(90,300), 40.0),
            new Line(this.elem, new Victor(200, 400), new Victor(400, 300), 4),
            new Line(this.elem, new Victor(100, 400), new Victor(50, 300), 4),
            //new Path(this.elem, true, new Victor(200, 175), new Victor(300, 175), new Victor(300, 275), new Victor(200, 275)),
            new Line(this.elem, new Victor(100, 700), new Victor(500, 800), 4),
            new Polygon(this.elem, new Victor(500, 500), 200, 100, 50, 0),
            new Line(this.elem, new Victor(0, 1000), new Victor(380, 1335), 4), // Flipperguidingline
            new Line(this.elem, new Victor(610, 1340), new Victor(1000, 1000), 4), // Flipperguidingline
            blackHole,
            this
        ];

        staticObjects.forEach(obj => this._collisionDetection.addStaticObject(obj));


    }
}
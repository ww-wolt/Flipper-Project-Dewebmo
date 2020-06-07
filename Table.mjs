
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
import { Rocket } from './Rocket.mjs';

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

        //this._walllsPath = new Path(this.elem, true, new Victor(100,4), new Victor(width-100, 4), new Victor(width-100, height-300), new Victor(100, height-300))

        
        this.setUpPlayground();

        this.startMusic();
    }

    getCollisionShape(){
        return this._walllsPath.getCollisionShape();
    }

    startMusic(){
        new Howl({
            src: ['/Sounds/race-car.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.5,
        });
    }



    setUpPlayground(){

        // Set up Ball & Ball Collision Detection & Reflection
        const ball = new Ball(this.elem, new Victor(200,300), 25.0);
        ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
            object.handleBallCollision(ball, collisionPoint, normal);
        });
        this._collisionDetection.addDynamicObject(ball);


        
        // Autoscroll
        ball.getCollisionShape().addMoveListener(() =>{
            window.scroll({
                top: Math.min(ball.getPos().y-250, 1700-window.innerHeight),
                behavior: 'smooth'
            });
        })


        const leftFlipper = new LeftFlipper(this.elem, new Victor(465,1300));
        leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(leftFlipper.isKicking){
                ball.applyForce(normal.multiplyScalar(30))
                console.log("Kicked Ball");
            }
        });
        this._collisionDetection.addStaticObject(leftFlipper);

        const rightFlipper = new RightFlipper(this.elem, new Victor(635,1300));
        rightFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(rightFlipper.isKicking){
                ball.applyForce(normal.multiplyScalar(30))
                console.log("Kicked Ball");
            }
        });
        this._collisionDetection.addStaticObject(rightFlipper);


        const rocket = new Rocket(this.elem, new Victor(1040, 1550))

        const blackHole = new BlackHole(this.elem, new Victor(500,1450), 100)
        blackHole.listener = function() {
            rocket.prepare(ball);
        };


        



        // const curve = new HorizontalCurve(this.elem, 0, 1000, 10, x => {
        //     // Circle Segment
        //     const r = 500 // Radius
        //     x = x % (2*r) - r;
        //     return Math.sqrt(r*r - x*x) + r
        // });

        //constructor(parent, pos, radius, edges, drawnEdges, edgesOffset)

         // Create Static Elements
         const staticObjects = [
            new Line(this.elem, new Victor(100, this._height-300), new Victor(100, 430)),
            new Line(this.elem, new Victor(1100, this._height-300), new Victor(1100, 430)),
            new Polygon(this.elem, new Victor(330, 430), 230, 60, 23, 7),
            new Polygon(this.elem, new Victor(870, 430), 230, 60, 23, 0),
            new Line(this.elem, new Victor(501, 276), new Victor(600, 375)),
            new Line(this.elem, new Victor(699, 276), new Victor(600, 375)),

            new Bumper(this.elem, new Victor(90,300), 40.0),
            //new Line(this.elem, new Victor(200, 400), new Victor(400, 300), 4),
            //new Line(this.elem, new Victor(100, 400), new Victor(50, 300), 4),
            //new Path(this.elem, true, new Victor(200, 175), new Victor(300, 175), new Victor(300, 275), new Victor(200, 275)),
            new Line(this.elem, new Victor(200, 700), new Victor(500, 800), 4),
            new Line(this.elem, new Victor(0, 1000), new Victor(380, 1300), 4), // Flipperguidingline
            new Line(this.elem, new Victor(610, 1300), new Victor(850, 1000), 4), // Flipperguidingline
            blackHole,
            this
        ];



        // // Create Static Elements
        // const staticObjects = [
        //     new Bumper(this.elem, new Victor(90,300), 40.0),
        //     //new Line(this.elem, new Victor(200, 400), new Victor(400, 300), 4),
        //     //new Line(this.elem, new Victor(100, 400), new Victor(50, 300), 4),
        //     //new Path(this.elem, true, new Victor(200, 175), new Victor(300, 175), new Victor(300, 275), new Victor(200, 275)),
        //     new Line(this.elem, new Victor(200, 700), new Victor(500, 800), 4),
        //     new Polygon(this.elem, new Victor(800, 200), 200, 60, 23, 0),
        //     new Line(this.elem, new Victor(0, 1000), new Victor(380, 1300), 4), // Flipperguidingline
        //     new Line(this.elem, new Victor(610, 1300), new Victor(850, 1000), 4), // Flipperguidingline
        //     blackHole,
        //     this
        // ];

        staticObjects.forEach(obj => this._collisionDetection.addStaticObject(obj));


    }
}


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
import { HighscoreList } from './HighscoreList.mjs';
import { Score } from './Score.mjs';
import { Satellite } from './Satellite.mjs';

export class Table{
    constructor(parent, width, height){

        this._width = width;
        this._height = height;


        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.style.width = width +'px';
        this.elem.style.height = height +'px';
        this.elem.classList.add("table");
        parent.appendChild(this.elem);

        this._collisionDetection = new CollisionDetection();

        this._highscoreList = new HighscoreList(parent);
        this._score = new Score(parent);
        this._lives = 3;

        this._ball = null;
        this._door = null;
        this._rocket = null;

        this._music = null;

        this._lastBumperTime = 0;

        
        this.setUpPlayground();
        this.askName();
        this.startMusic();
        this.startGame();
    }

    askName(){
        const name = window.prompt('Dein Name: ');
        this._playerName = name ? name : 'Anonymous Lama'
    }

    startMusic(){
        this._music = new Howl({
            src: ['/Sounds/race-car.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.4,
        });
    }

    startGame(){
        if(this._lives > 0){
            setTimeout(this.openDoor.bind(this), 1000)
            this._rocket.prepare(this._ball);
            window.setTimeout(this.closeDoor.bind(this), 5300)
            this._lives--;
        }else{
            this.gameOver();
        }
    }

    gameOver(){
        this._music.pause();
        
        new Howl({
            src: ['/Sounds/gameover.wav'],
            autoplay: true,
            volume: 5.0,
        });

        setTimeout(() => {
            window.alert('Game Over! \n\nDein Score: ' + this._score.score + ' Punkte')
            this._score.resetScore();
            this._lives = 3;
            this.askName();
            this.startGame();
            this.startMusic();
        }, 1500)

        
    }



    setUpPlayground(){

        this._inBoostMode = false;

        // Set up Ball & Ball Collision Detection & Reflection
        this._ball = new Ball(this.elem, new Victor(-300,-300), 25.0);
        this._ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
            object.handleBallCollision(this._ball, collisionPoint, normal);
            
            if(object instanceof Circle){
                const points = Math.min(Math.ceil(this._ball.velocity.length()*0.2), 5)
                this._score.addPoints(points);

                const now = new Date().getTime();
                if(now - this._lastBumperTime < 500){
                    if(!this._inBoostMode){
                        this._inBoostMode = true;
                        this._score.addPoints(10);
                        this.blink();
                        new Howl({
                            src: ['Sounds/boost.wav'],
                            autoplay: true,
                            volume: 0.5,
                        });
                        setTimeout(() => {
                            this._inBoostMode = false;
                        }, 400);
                    }
                }
                this._lastBumperTime = now;
            }
        });
        this._collisionDetection.addDynamicObject(this._ball);


        
        // Autoscroll
        const updateScroll = () =>{
            window.scroll({
                top: '' + Math.min(this._ball.getPos().y-350, 1700-window.innerHeight),
                behavior: 'smooth'
            });
            window.requestAnimationFrame(updateScroll)
        }
        window.requestAnimationFrame(updateScroll)

        
        // this._ball.getCollisionShape().addMoveListener(() =>{
        //     window.scroll({
        //         top: '' + Math.min(this._ball.getPos().y-350, 1700-window.innerHeight),
        //         behavior: 'smooth'
        //     });
        // })


        const leftFlipper = new LeftFlipper(this.elem, new Victor(565,1500));
        leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(leftFlipper.isKicking){
                this._ball.applyForce(normal.multiplyScalar(25))
                new Howl({
                    src: ['Sounds/flipper.wav'],
                    autoplay: true,
                    volume: 0.5,
                });
            }
        });
        this._collisionDetection.addStaticObject(leftFlipper);

        const rightFlipper = new RightFlipper(this.elem, new Victor(735,1500));
        rightFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        
            if(rightFlipper.isKicking){
                this._ball.applyForce(normal.multiplyScalar(25))
                new Howl({
                    src: ['Sounds/flipper.wav'],
                    autoplay: true,
                    volume: 0.5,
                });
            }
        });
        this._collisionDetection.addStaticObject(rightFlipper);


        this._rocket = new Rocket(this.elem, new Victor(1140, 1550))
        this._door = new Line(this.elem, new Victor(830, 1487), new Victor(1200, 1200)) // Flipper guiding line rechts
        

        const blackHole = new BlackHole(this.elem, new Victor(700,1635), 100)
        blackHole.listener = this.startGame.bind(this);

        
        

        
        


        



        // const curve = new HorizontalCurve(this.elem, 0, 1000, 10, x => {
        //     // Circle Segment
        //     const r = 500 // Radius
        //     x = x % (2*r) - r;
        //     return Math.sqrt(r*r - x*x) + r
        // });


        const jupiter = new Bumper(this.elem, new Victor(700,520), 45, 'jupiter')
        const mars = new Bumper(this.elem, new Victor(535,710), 45, 'mars')
        const earth = new Bumper(this.elem, new Victor(865,710), 45, 'earth')
        const saturn = new Bumper(this.elem, new Victor(700,930), 65, 'saturn')
        saturn.setCollisionShapeRadius(45)

        // for(let planet of [jupiter, mars, earth]){
        //     //animation = 
        //     planet.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        //         console.log('Bumper blink');
        //         planet.blink();
        //     });
        // }


         // Create Static Elements
         const staticObjects = [
            new Line(this.elem, new Victor(200, 1200), new Victor(200, 430)), //Wall Line links
            new Line(this.elem, new Victor(1200, 1200), new Victor(1200, 430)), //Wall Line rechts
            new Polygon(this.elem, new Victor(430, 430), 230, 60, 23, 7, 0), // Ecke oben links
            new Polygon(this.elem, new Victor(970, 430), 230, 60, 23, 0, 0), // Ecke oben rechts
            new Line(this.elem, new Victor(601, 276), new Victor(700, 375)), // Spitz oben mitte
            new Line(this.elem, new Victor(799, 276), new Victor(700, 375)), // Spitz oben mitte
            new Line(this.elem, new Victor(200, 1200), new Victor(570, 1487)), // Flipper guiding line links
            this._door, // Flipper guiding line rechts
            new Polygon(this.elem, new Victor(975, 400), 65, 3, 3, 7, -10), // Dreieck oben rechts
            new Polygon(this.elem, new Victor(425, 400), 65, 3, 3, 7, 65), // Dreieck oben links
            new Line(this.elem, new Victor(290, 550), new Victor(400, 630)), // Little line oben links
            new Line(this.elem, new Victor(1110, 550), new Victor(1000, 630)), // Little line oben rechts
            new Line(this.elem, new Victor(350, 800), new Victor(450, 900)), // Little line mitte links
            new Line(this.elem, new Victor(1050, 800), new Victor(950, 900)), // Little line mitte rechts
            new Satellite(this.elem, new Victor(700,1170), 80),
            jupiter,
            mars,
            earth,
            saturn,
            blackHole,
        ];

        //new Satellite(this.elem, new Victor(700,1170), 80),
            //new Polygon(this.elem, new Victor(700, 970), 60, 3, 2, 0, -30), // Dreieck mitte
            // new Line(this.elem, new Victor(330, 720), new Victor(420, 1000)), // Little line links
            // new Line(this.elem, new Victor(1070, 720), new Victor(980, 1000)), // Little line rechts
            //new Line(this.elem, new Victor(400, 1300), new Victor(1000, 1300)), // horizontal Line

        staticObjects.forEach(obj => this._collisionDetection.addStaticObject(obj));
    }

    async blink(){

        let sheet = null;

        function add(){
            sheet = document.createElement('style')
            sheet.innerHTML = '.line{box-shadow: 0 0 4px 2px #FF45B5}';
            document.body.appendChild(sheet);
        }

        function remove(){
            const sheetParent = sheet.parentNode;
            sheetParent.removeChild(sheet);
        }

        for(let i = 0; i < 3; i++){
            setTimeout(add, i * 300)
            setTimeout(remove, i * 300 + 150)
        }
    }

  



    openDoor(){
        const b = this._door.a.clone().add(this._door.getLineVector().multiplyScalar(0.63))
        this._door.setCoordinates(this._door.a, b)
    }

    closeDoor(){
        this._door.setCoordinates(this._door.a, new Victor(1200, 1200))
    }

}
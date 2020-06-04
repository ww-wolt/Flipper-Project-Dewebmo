
import {CollisionCircle} from './CollisionDetection.mjs';
import { ComplexCollisionShape } from './CollisionDetection.mjs';
import { CollisionLine } from './CollisionDetection.mjs';
import { Line } from './Line.mjs';

export class BlackHole{

    constructor(parent, pos, radius){

        this._pos = pos;
        this._radius = radius;

         // Create DOM-Element
        this.img = document.createElement('IMG');
        this.img.src = 'Assets/space1/galaxy.png';
        this.img.style.width = radius + 'px';
        this.img.style.height = 'auto';
        this.img.style.position = 'absolute';
        this.img.style.transformOrigin = '50% 50%'
        this.img.style.transform = 'translate('+ (pos.x - 0.5 * radius) + 'px,'+ (pos.y - 0.5 * radius) +'px)' + 'rotateZ(45deg)';
        this.img.classList.add('black-hole');

        this._animation = this.img.animate([   
            {transform: 'translate('+ (pos.x - 0.5 * radius) + 'px,'+ (pos.y - 0.5 * radius) +'px)' + 'scale(2) rotateZ(45deg)'},
            {transform: 'translate('+ (pos.x - 0.5 * radius) + 'px,'+ (pos.y - 0.5 * radius) +'px)' + 'rotateZ(45deg)'},
        ], 
        {duration: 3000,  fill: 'both'}); 
        this._animation.pause();
        this._animation.currentTime = 3000;
        this._animationPlaying = false;

        // Append DOM-Element
        parent.appendChild(this.img);

        this._collisionShape = new CollisionCircle(this, radius*0.4, pos);
        //new Line(parent, new Victor(0,pos.y-radius*0.2), new Victor(1000,pos.y-radius*0.2), 4);
        new ComplexCollisionShape(this, [new CollisionCircle(this, radius*0.6, pos), new CollisionLine(this, new Victor(0,pos.y - radius*0.3), new Victor(1000,pos.y - radius*0.3))])
    }

    getCollisionShape(){
        return this._collisionShape;
    }

    handleBallCollision(ball, collisionPoint, normal){

        if(!this._animationPlaying){
            this._animation.reverse();
            this._animationPlaying = true;
            const audio = new Audio('Sounds/black-hole.wav');
            audio.play();
        }
        this._animation.onfinish = function() {
            this._animationPlaying = false;
        }.bind(this)
        
        ball.gravityOn = false;
        const dirVec = this._pos.clone().subtract(ball.getPos());
        const newVelocity = dirVec.clone().normalize().multiplyScalar(1);
        ball.velocity = newVelocity;

        
        
        if (dirVec.length() < (0.01 * this._radius)){
            console.log('BlackHole -> handleBallCollision -> dirVec.length()', dirVec.length())
            ball.setVisible(false)

            // supress Collision
            ball.setPos(new Victor(500, 200))
            ball.velocity = new Victor(0,0)

            this._animation.reverse();

            window.setTimeout(startRocket, 2000)
        }

        function startRocket(){
            ball.setVisible(true)
            ball.gravityOn = true;
        }
    }

    
   
}


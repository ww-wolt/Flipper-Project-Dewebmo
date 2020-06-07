
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
        this.img.style.transform = 'translate('+ (pos.x - 0.5 * radius) + 'px,'+ (pos.y - 0.5 * radius) +'px)' + 'rotateZ(45deg)';
        this.img.classList.add('black-hole');

        this._animationPlaying = false;

        // Append DOM-Element
        parent.appendChild(this.img);

        this._collisionShape = new ComplexCollisionShape(this, [
            new CollisionCircle(this, radius*0.6, pos), 
            new CollisionLine(this, new Victor(0,pos.y - radius*0.3), new Victor(1000,pos.y - radius*0.3))
        ])

        this.listener = null;

        //new CollisionCircle(this, radius*0.4, pos);
        //new Line(parent, new Victor(0,pos.y-radius*0.2), new Victor(1000,pos.y-radius*0.2), 4);
        
    }

    getCollisionShape(){
        return this._collisionShape;
    }

    handleBallCollision(ball, collisionPoint, normal){

        if(!this._animationPlaying){

            this._animationPlaying = true;

            const animationScaleUp = this.img.animate([
                {transform: 'translate('+ (this._pos.x - 0.5 * this._radius) + 'px,'+ (this._pos.y - 0.5 * this._radius) +'px)' + 'rotateZ(45deg)'},
                {transform: 'translate('+ (this._pos.x - 0.5 * this._radius) + 'px,'+ (this._pos.y - 0.5 * this._radius) +'px)' + 'scale(2) rotateZ(45deg)'}
            ], 
            {duration: 1000,  fill: 'both'}); 

            new Howl({
                src: ['Sounds/black-hole.wav'],
                autoplay: true,
                volume: 0.2,
            });

            animationScaleUp.onfinish = function() {
                this._animationPlaying = false;
            }.bind(this)
        }
        
        ball.gravityOn = false;
        const dirVec = this._pos.clone().subtract(ball.getPos());
        const newVelocity = dirVec.clone().normalize().multiplyScalar(1);
        ball.velocity = newVelocity;

        
        
        if (dirVec.length() < (0.01 * this._radius)){
        
            new Howl({
                src: ['Sounds/explosion.wav'],
                autoplay: true,
                volume: 2.0,
            });

        
            this.img.animate([   
                {transform: 'translate('+ (this._pos.x - 0.5 * this._radius) + 'px,'+ (this._pos.y - 0.5 * this._radius) +'px)' + 'scale(2) rotateZ(45deg)'},
                {transform: 'translate('+ (this._pos.x - 0.5 * this._radius) + 'px,'+ (this._pos.y - 0.5 * this._radius) +'px)' + 'rotateZ(45deg)'},
            ], 
            {duration: 400,  fill: 'both'}); 

            
            ball.setVisible(false)
            window.setTimeout(this.notifyRocket.bind(this), 1000, ball)
        }
        
    }

    // Listener (Rocket) benachrichtigen
    notifyRocket(ball){  
        if(this.listener){
            this.listener();
        }
    }

    
   
}


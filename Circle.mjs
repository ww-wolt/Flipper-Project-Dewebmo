import {CollisionCircle} from './CollisionDetection.mjs';

export class Circle{
    constructor(parent, pos, radius, cssClass){
        this._pos = pos; // Position of the center of the circle
        this._radius = radius;
        this._collisionShape = new CollisionCircle(this, this._radius, this._pos);
        this.bounciness = 1.0;

        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.style.position = 'absolute';
        this.elem.style.left = -this._radius+'px';
        this.elem.style.top = -this._radius+'px';
        this.elem.style.width = (2*this._radius)+'px';
        this.elem.style.height = (2*this._radius)+'px';
        this.elem.style.borderRadius = '50%';
        this.elem.style.transform = 'translate('+this._pos.x+'px,'+this._pos.y+'px)';

        this.elem.classList.add(cssClass);

        this._soundPlaying = false;

        // Append DOM-Element
        parent.appendChild(this.elem);
    }

    addCssClass(cssClass){
        this.elem.classList.add(cssClass);
    }

    setPos(pos){
        this._pos = pos;
        this._collisionShape.pos = pos;
        this.elem.style.transform = 'translate('+this._pos.x+'px,'+this._pos.y+'px)';
    }

    getCollisionShape(){
        return this._collisionShape;
    }

    handleBallCollision(ball, collisionPoint, normal){
        ball.reflect(collisionPoint, normal, this.bounciness);

        if(!this._soundPlaying){
            this._soundPlaying = true;
            new Howl({
                src: ['/Sounds/bumper.wav'],
                autoplay: true,
                volume: 3.0,
            });

            setTimeout(() => {
                this._soundPlaying = false;
            }, 300)
        }
    }

}
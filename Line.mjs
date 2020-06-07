import { CollisionLine } from "./CollisionDetection.mjs";

export class Line{
    constructor(parent, a, b, cssClass){

        this._collisionShape = new CollisionLine(this, a, b)
        this.bounciness = 1.0;

        // Create DOM-Element
        this.line = document.createElement('DIV');
        this.line.style.position = 'absolute';
        this.setCoordinates(a,b);
        this.line.classList.add('line');
        this.line.classList.add(cssClass);
        this.line.style.transformOrigin = '0% 50%'
    
        // Append DOM-Element
        parent.appendChild(this.line)
    }

    setCoordinates(a, b){

        this.a = a
        this.b = b

        // Transformation
        const vec = b.clone().subtract(a)
        const angle = vec.horizontalAngleDeg()
        
        this.line.style.transform = 'translate('+this.a.x + 'px,'+this.a.y +'px)' + ' rotate('+angle+'deg)';
        this.line.style.width = vec.length()-2 + 'px';

        this._collisionShape.a = this.a;
        this._collisionShape.b = this.b;
        this._collisionShape.hasMoved();
    }


    getCollisionShape(){
        return this._collisionShape;
    }

    setBackground(backgroundString){
        this.line.background = backgroundString;
    }

    setName(name){
        this._collisionShape.name = name;
    }

    handleBallCollision(ball, collisionPoint, normal){
        ball.reflect(collisionPoint, normal, this.bounciness);
    }



}
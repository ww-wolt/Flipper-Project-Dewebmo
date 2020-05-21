import {CollisionCircle} from './CollisionDetection.mjs';
import { Arrow } from './Arrow.mjs';

export class Ball{
    constructor(parent, pos, radius){
        this._pos = pos; // Position of the center of the circle
        this._NewPos = pos; 
        this._radius = radius;
        this._velocity = new Victor(0,0);
        this._gravitiy = new Victor(0,0.5);
        this._ms = 15;
        this._collisionShape = new CollisionCircle("Ball", this._radius, this._NewPos);
        this._bounciness = 0.7;

        this._velocityArrow = new Arrow(table, 10);
        this._velocityArrow.setEnabled(true);

        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.style.position = 'absolute';
        this.elem.style.left = -this._radius+'px';
        this.elem.style.top = -this._radius+'px';
        this.elem.style.width = (2*this._radius)+'px';
        this.elem.style.height = (2*this._radius)+'px';
        this.elem.style.backgroundColor = 'coral';
        this.elem.style.borderRadius = '50%';
        this.elem.style.transform = 'translate('+this._pos.x+'px,'+this._pos.y+'px)';

        // Append DOM-Element
        parent.appendChild(this.elem)

        // Initialize Animation
        this._animation = this.elem.animate({},{duration: this._ms});
        this._keyframes = [];

        // Animation Loop
        this._animation.onfinish = this.updatePhysics.bind(this);
    }

    reflect(collisionPoint, normal, bounce){
    

        // Formula  𝑟=𝑑−2(𝑑⋅𝑛)𝑛
        const dotP = this._velocity.clone().dot(normal);
        const rightSide = normal.multiplyScalar(2*dotP)
        let reflect = this._velocity.subtract(rightSide);
        
        // Verkettung funktioniert aus unergründlichen Gründen leider nicht!
        // reflect = this._velocity.subtract(normal.multiplyScalar(2*this._velocity.clone().dot(normal)))

        this._velocity = reflect.multiplyScalar(this._bounciness * bounce);

        
        // calculate new position
        this._NewPos = collisionPoint.add(this._velocity);
        this._collisionShape.pos = this._NewPos;

        //this._NewPos = this._newPos.add(this._velocity);
    }

    applyForce(){

    }

    updatePhysics(){

        // calculate new position
        this._velocity = this._velocity.add(this._gravitiy);
        this._NewPos = this._pos.clone().add(this._velocity);
        this._collisionShape.pos = this._NewPos;

        // notify Collision Detection
        this._collisionShape.hasMoved();

        this._velocityArrow.setVector(this._pos, this._velocity);

        this.animate();

        // After Animation set pos to new
        this._pos = this._NewPos;
    }

    animate(){
        this._keyframes = [
            {transform: `translate(${this._pos.x}px, ${this._pos.y}px)`},
            {transform: `translate(${this._NewPos.x}px, ${this._NewPos.y}px)`}];
        this._animation.effect.setKeyframes(this._keyframes);
        this._animation.play();
    }

    getCollisionShape(){
        return this._collisionShape;
    }

}
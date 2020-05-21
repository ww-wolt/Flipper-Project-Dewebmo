import {CollisionCircle} from './CollisionDetection.mjs';
import { Arrow } from './Arrow.mjs';
import { Circle } from './Circle.mjs';

export class Ball{
    constructor(parent, pos, radius){
        this._circle = new Circle(parent, pos, radius);

        this._newPos = pos; 
        this._velocity = new Victor(0,0);
        this._gravitiy = new Victor(0,0.5);
        this._ms = 15;
        this._bounciness = 0.7;

        this._velocityArrow = new Arrow(parent, 10);
        this._velocityArrow.setEnabled(false);

        // Initialize Animation
        this._animation = this._circle.elem.animate({},{duration: this._ms});
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
        this._newPos = collisionPoint.add(this._velocity);
        this._circle._collisionShape.pos = this._newPos;
    }

    applyForce(){

    }

    updatePhysics(){

        // calculate new position
        this._velocity = this._velocity.add(this._gravitiy);
        this._newPos = this._circle._pos.clone().add(this._velocity);
        this._circle._collisionShape.pos = this._newPos;

        // notify Collision Detection
        this._circle._collisionShape.hasMoved();

        this._velocityArrow.setVector(this._circle._pos, this._velocity);

        this.animate();

        // After Animation set pos to new
        this._circle._pos = this._newPos;
    }

    animate(){
        this._keyframes = [
            {transform: `translate(${this._circle._pos.x}px, ${this._circle._pos.y}px)`},
            {transform: `translate(${this._newPos.x}px, ${this._newPos.y}px)`}];
        this._animation.effect.setKeyframes(this._keyframes);
        this._animation.play();
    }

    getCollisionShape(){
        return this._circle.getCollisionShape();
    }

}
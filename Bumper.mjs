import {CollisionCircle} from './CollisionDetection.mjs';
import { Circle } from './Circle.mjs';

export class Bumper{
    constructor(parent, pos, radius){
        this._circle = new Circle(parent, pos, radius);
        this.getCollisionShape().bounciness = 1.4;
    }

    getCollisionShape(){
        return this._circle.getCollisionShape();
    }
}
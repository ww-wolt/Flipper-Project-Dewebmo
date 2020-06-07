import {CollisionCircle} from './CollisionDetection.mjs';
import { Circle } from './Circle.mjs';

export class Bumper{
    constructor(parent, pos, radius){
        this._circle = new Circle(parent, pos, radius, 'bumper');
        this._circle.bounciness = 2.0;

    }

    getCollisionShape(){
        return this._circle.getCollisionShape();
    }
}
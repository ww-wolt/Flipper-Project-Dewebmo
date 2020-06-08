
import { Circle } from './Circle.mjs';

export class Bumper{
    constructor(parent, pos, radius, cssClass){

        this._parent = parent;
        this._pos = pos;
    

        this._circle = new Circle(parent, pos, radius, cssClass);
        this._circle.addCssClass('bumper');
        this._circle.bounciness = 1.6;

    }

    setCollisionShapeRadius(radius){
        this._circle.getCollisionShape().radius = radius;
        // new Circle(this._parent, this._pos, radius, 'colored-circle');
    }

    getCollisionShape(){
        return this._circle.getCollisionShape();
    }

    blink(){

        this._animation = this._circle.elem.animate([   
            {boxShadow: '0 0 0 0 #B4AAA7'},
            {boxShadow: '0 0 50px 0.1px #B4AAA7'},
        ], 
        {duration: 200,  iterations: 1}); 

    }
}
import { Circle } from './Circle.mjs';

export class Satellite{
    constructor(parent, pos, radius){


        this._pos = pos;
        this._radius = radius;

        //new Circle(parent, pos, radius*0.5, 'colored-circle');
        this._circle = new Circle(parent, pos, radius, 'satellite');
        this._circle.getCollisionShape().radius = radius * 0.5;
        this._circle.bounciness = 1.2;

        this._duration = 6000;
        this._distance = 540;
        this._ms = 33
        this._currentXPos = 0;

        this._animation = this._circle.elem.animate([   
            {transform: 'translate('+(this._pos.x - this._distance/2) + 'px,'+this._pos.y +'px)'},
            {transform: 'translate('+(this._pos.x + this._distance/2) + 'px,'+this._pos.y +'px)'},
        ], 
        {duration: this._duration,  fill: 'both'}); 

        this._animation.onfinish = () => {
            this._animation.reverse();
        }

        //const updateFunc = setInterval(this.updateAngle.bind(this), this._ms);

        setInterval(this.updateCollisionShape.bind(this), this._ms);
    }

    updateCollisionShape(){
        const currentXPos = (this._animation.currentTime / this._duration) * this._distance - this._distance/2 + this._pos.x;
        this.getCollisionShape().pos = new Victor(currentXPos, this._pos.y);
    }

    getCollisionShape(){
        return this._circle.getCollisionShape();
    }
}
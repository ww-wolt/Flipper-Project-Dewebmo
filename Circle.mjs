import {CollisionCircle} from './CollisionDetection.mjs';

export class Circle{
    constructor(parent, pos, radius){
        this._pos = pos; // Position of the center of the circle
        this._radius = radius;
        this._collisionShape = new CollisionCircle("Circle", this._radius, this._pos);

        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.style.position = 'absolute';
        this.elem.style.left = -this._radius+'px';
        this.elem.style.top = -this._radius+'px';
        this.elem.style.width = (2*this._radius)+'px';
        this.elem.style.height = (2*this._radius)+'px';
        this.elem.style.backgroundColor = 'greenyellow';
        this.elem.style.borderRadius = '50%';
        this.elem.style.transform = 'translate('+this._pos.x+'px,'+this._pos.y+'px)';

        // Append DOM-Element
        parent.appendChild(this.elem);
    }

    setPos(pos){
        this._pos = pos;
        this._collisionShape.pos = pos;
        this.elem.style.transform = 'translate('+this._pos.x+'px,'+this._pos.y+'px)';
    }

    getCollisionShape(){
        return this._collisionShape;
    }

}
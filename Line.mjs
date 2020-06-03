import { CollisionLine } from "./CollisionDetection.mjs";

export class Line{
    constructor(parent, a, b, stroke){

        // Create DOM-Element
        this.line = document.createElement('DIV');
        this.line.style.position = 'absolute';
        this.line.style.width = '1px';
        this.line.style.height = stroke+'px';
        this.line.style.background = 'linear-gradient(90deg, rgba(255,24,0,1) 0%, rgba(77,69,252,0.7) 100%)';
        //this.line.classList.add('neon-glow');
        this.line.style.transformOrigin = '0% 50%'
    
        // Append DOM-Element
        parent.appendChild(this.line)

        this._collisionShape = new CollisionLine('Line', a, b)
        this.setCoordinates(a,b);

    }

    setCoordinates(a, b){

        this.a = a
        this.b = b

        // Transformation
        const vec = b.clone().subtract(a)
        const angle = vec.horizontalAngleDeg()
        
        this.line.style.transform = 'translate('+this.a.x + 'px,'+this.a.y +'px)' + ' rotate('+angle+'deg)'+ ' scale('+vec.length()+', 1)';
        this._collisionShape.a = this.a;
        this._collisionShape.b = this.b;

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



}
export class Arrow{

    constructor(parent, factor){

        this._factor = factor

        // Create DOM-Element
        this.line = document.createElement('DIV');
        this.line.style.position = 'absolute';

        this.line.style.width = '1px';
        this.line.style.height = '10px';
        this.line.style.backgroundColor = 'blue';
        this.line.style.transformOrigin = '0% 50%'
        this.line.style.zIndex = 100;
        this.line.style.clipPath = 'polygon(0 37%, 87% 37%, 87% 0, 100% 50%, 87% 100%, 87% 63%, 0 63%)'

        this.line.style.background = 'linear-gradient(90deg, rgba(255,24,0,1) 0%, rgba(77,69,252,0.7) 100%)';

        // Append DOM-Element
        parent.appendChild(this.line)
    }

    setVector(point, vector){

        const length = vector.length() * this._factor
        const angle = vector.horizontalAngleDeg()
        this.line.style.transform = 'translate('+point.x + 'px,'+point.y +'px)' + ' rotate('+angle+'deg)'+ ' scale('+length+', 1)';
    }

    setEnabled(enabled){
        if(enabled){
            this.line.style.display = 'block';
        }else{
            this.line.style.display = 'none';
        }
    }


}
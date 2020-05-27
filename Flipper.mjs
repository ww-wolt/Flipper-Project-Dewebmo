
//const DaysEnum = Object.freeze({"monday":1, "tuesday":2, "wednesday":3, ...})

export class Flipper{

    constructor(parent, assetSrc, cssClass, pos, width, key){


        this._pos = pos;
        this._key = key;

        this._ms = 5;
        this._duration = 1000;
        this.angle = -32;
        this.isKicking = false;

        this._currentTime = 0;

        // Create DOM-Element
        this.img = document.createElement('IMG');
        this.img.src = assetSrc;
        this.img.alt = 'Flipper';
        this.img.style.width = width + 'px';
        this.img.style.height = 'auto';
        this.img.style.position = 'absolute';
        this.img.classList.add(cssClass);
        this.img.style.transform = 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ('+this.angle+'deg)';

        // Append DOM-Element
        parent.appendChild(this.img);

         // Initialize Animation
         this._animation = this.img.animate({},{duration:0});

         // Animation Loop
         //this._animation.onfinish = this.updatePhysics.bind(this);


        let isPressed = false;
        document.addEventListener('keydown', event => {
            if(event.key == this._key & !isPressed){ 
                console.log(this._key + " pressed")
                isPressed = true;
                this.up();
            }})
        
        document.addEventListener('keyup', event => {
            if(event.key == this._key & isPressed){ 
                console.log(this._key + " released")
                isPressed = false;
                this.down();
            }})

    }

    up(){
        this.turnFlipper("-32deg", "10deg");

        this.isKicking = true;
        const updateFunc = setInterval(this.updateAngleUp.bind(this), this._ms);

        var onAnimFinishFunc = function(){
            this.isKicking = false;
            clearInterval(updateFunc)
            //this._ms = 0;
        };
        this._animation.onfinish = onAnimFinishFunc.bind(this);
    }

    down(){

        //this._animation.pause();
        //this._animation.reverse();
        this.turnFlipper("10deg", "-32deg");

        const updateFunc = setInterval(this.updateAngleDown.bind(this), this._ms);

        var onAnimFinishFunc = function(){
            clearInterval(updateFunc)
            //this._ms = 0;
        };
        this._animation.onfinish = onAnimFinishFunc.bind(this);
    }

    logAnimationState(){
        console.log('Animation State: ' + this._animation.currentTime );
        
    }

    turnFlipper(from, to){
        this._animation = this.img.animate([   
            {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ('+from+')'},
            {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ('+to+')'},
        ], 
        {duration: this._duration,  fill: 'both'});
  
        //this.logAnimationState();
        //this._animation.onfinish = this.logAnimationState.bind(this);
        
    }

    getAngleFromAnimationState(){
        console.log('Animation State: ' + this._animation.currentTime );
        const angle = (this._animation.currentTime / this._duration) * 42 -32;
        //console.log('Flipper -> getAngleFromAnimationState -> angle', angle)
        return angle;
    }

    updateAngleUp(){
        this.angle = (this._currentTime / this._duration) * 42 -32;
        console.log('Flipper -> updateAngleUp -> this.angle', this.angle)
        this._currentTime += this._ms;

        //this.angle = (this._animation.currentTime / this._duration) * 42 -32;
    }

    updateAngleDown(){
        this.angle = (this._currentTime / this._duration) * -42 + 10;
        console.log('Flipper -> updateAngleDown -> this.angle', this.angle)
        this._currentTime += this._ms;
    }
    
}

export class RightFlipper extends Flipper{
    constructor(parent, pos, width){
        super(parent, 'Assets/flipper-right.png', 'flipper-right', pos, width, 'ArrowRight')
    }

}

export class LeftFlipper extends Flipper{
    constructor(parent, pos, width){

    }

}

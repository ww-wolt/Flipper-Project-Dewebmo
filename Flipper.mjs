
//const DaysEnum = Object.freeze({"monday":1, "tuesday":2, "wednesday":3, ...})

export class Flipper{

    constructor(parent, assetSrc, cssClass, pos, width, key){


        this._pos = pos;
        this._key = key;

        this._ms = 15;
        this._duration = 60;

        // Create DOM-Element
        this.img = document.createElement('IMG');
        this.img.src = assetSrc;
        this.img.alt = 'Flipper';
        this.img.style.width = width + 'px';
        this.img.style.height = 'auto';
        this.img.style.position = 'absolute';
        this.img.classList.add(cssClass);
        this.img.style.transform = 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ('+'-32deg'+')';

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
        setInterval(this.getAngleFromAnimationState.bind(this), this._ms);

    }

    down(){
        this.turnFlipper("10deg", "-32deg");
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

    updateAngle(){
        
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

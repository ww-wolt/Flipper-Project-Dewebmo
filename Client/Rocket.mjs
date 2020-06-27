export class Rocket{
    constructor(parent, pos){

        this._pos = pos;

        this._isReady = false;
        this._width = 120;

        this._flightDistance = 700;
        this._duration = 180;


        // Create DOM-Element
        this.rocket = document.createElement('DIV');
        this.rocket.style.position = 'absolute';
        this.rocket.style.left = -this._width/2+'px';
        this.rocket.style.top = -this._width/2+'px';
        this.rocket.style.width = this._width + 'px';
        this.rocket.style.height = this._width + 'px';
        this.rocket.style.transform = 'translate('+ (pos.x) + 'px,'+ (pos.y) +'px)';
        this.rocket.classList.add('rocket');
        parent.appendChild(this.rocket);

        // Create DOM-Element
        this.flame = document.createElement('DIV');
        this.flame.style.position = 'absolute';
        this.flame.style.left = -this._width/2+'px';
        this.flame.style.top = -this._width/2+'px';
        this.flame.style.width = this._width + 'px';
        this.flame.style.height = this._width + 'px';
        this.flame.style.transform = 'translate('+ (pos.x) + 'px,'+ (pos.y + 50) +'px)';
        this.flame.classList.add('flame');
        parent.appendChild(this.flame);
    }

    setReady(isReady){
        this._isReady = isReady;
    }

    prepare(ball){
        window.setTimeout(this.startCountdown.bind(this), 1000, ball)
    }

    startCountdown(ball){
        ball.gravityOn = false;
        ball.velocity = new Victor(0,0);
        ball.setPos(this._pos.clone().add(new Victor(0,-86)));
        ball.setVisible(true);

        new Howl({
            src: ['Sounds/countdown.wav'],
            autoplay: true,
            volume: 0.5, 
        });

        window.setTimeout(this.launch.bind(this), 3300, ball)
    }

    launch(ball){

        const duration = this._duration + Math.random() * this._duration;
        
        const speed = (this._flightDistance / duration) * ball._ms * 1.1;
        ball.velocity = new Victor(0, -speed)


        const animationUp = this.rocket.animate([   
            {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)'},
            {transform: 'translate('+this._pos.x + 'px,'+ (this._pos.y - this._flightDistance) + 'px)'},
        ], 
        {duration: duration,  fill: 'both'});

        new Howl({
            src: ['Sounds/rocket-launch.m4a'],
            autoplay: true,
            volume: 2.0,
        });
       
        animationUp.onfinish = () => {
            ball.gravityOn = true;
            this.rocket.animate([   
                {transform: 'translate('+this._pos.x + 'px,'+ (this._pos.y - this._flightDistance) + 'px)'},
                {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)'},
            ], 
            {duration: duration * 4,  fill: 'both'});
        }
    }


}
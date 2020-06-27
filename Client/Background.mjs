export class Background{

    constructor(parent){

         // Create DOM-Element
        this.img = document.createElement('IMG');
        this.img.src = 'Assets/background.png';
        this.img.classList.add('background');

        // Append DOM-Element
        parent.appendChild(this.img);

        new simpleParallax(this.img, {
            delay: 0.0,
            scale: 1.3,
            transition: 'linear',
        });
    }
}
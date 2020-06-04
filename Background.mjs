export class Background{

    constructor(parent){

         // Create DOM-Element
        this.img = document.createElement('IMG');
        this.img.src = 'Assets/background.jpg';
        this.img.classList.add('background');

        // Append DOM-Element
        parent.appendChild(this.img);

        new simpleParallax(this.img, {
            delay: 0.0,
            scale: 1.4,
            transition: 'linear'
        });
    }
}
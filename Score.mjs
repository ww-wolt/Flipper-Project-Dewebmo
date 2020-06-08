export class Score{

    constructor(parent){

        this.score = 0;

        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.classList.add('score');

        this.updateView();

        // Append DOM-Element
        parent.appendChild(this.elem);
    }

    resetScore(){
        this.score = 0;
        this.updateView()
    }

    addPoints(points){
        this.score += points;
        this.updateView()
    }

    updateView(){
        this.elem.innerHTML =  '<p>Score<br>' + this.score + '</p>';
    }

}
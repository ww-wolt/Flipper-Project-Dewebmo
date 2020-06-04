import { Path } from './Path.mjs';

export class Polygon{
    

    // segments 8 = 8-Eck
    // n = wiviele davon zeichnen

    constructor(parent, pos, radius, edges, drawnEdges, edgesOffset){

        const points = [];

        const incAlpha = (2 * Math.PI) / edges;
        let alpha = edgesOffset * incAlpha;

        for(let i  = 0; i <= drawnEdges; i++){
            const x = Math.cos(alpha) * radius + pos.x;
            const y = -Math.sin(alpha) * radius + pos.y;
            points.push(new Victor(x,y));

            alpha += incAlpha;
        }

        this._path = new Path(parent, false, ...points)


    

        // function drawPolygon(segments, radius, pos){
  
        //     const increment = TWO_PI/segments;
            
        //     for(let a = 0; a < TWO_PI; a += increment){
              
        //       const x = cos(a) * radius + pos.x;
        //       const y = sin(a) * radius + pos.y;
        //       const nextX = cos(a + increment) * radius + pos.x;
        //       const nextY = sin(a + increment) * radius + pos.y;
              
        //       line(x,y,nextX,nextY);
        //     }
        //   }

        // // in loop
        
    }
    
    
    getCollisionShape(){
        return this._path.getCollisionShape();
    }
}
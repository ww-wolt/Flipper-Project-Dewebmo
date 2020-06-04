
import { Path } from './Path.mjs';

export class HorizontalCurve{
    
    constructor(parent, startX, endX, segments, func){
        const stepWidth = (endX - startX) / segments;
        const points = [];

        for(let x = startX; x <= endX+1; x+= stepWidth){
            const y = func(x);
            points.push(new Victor(x,y));
        }

        this._path = new Path(parent, false, ...points)
    }
    
    
    getCollisionShape(){
        return this._path.getCollisionShape();
    }
}
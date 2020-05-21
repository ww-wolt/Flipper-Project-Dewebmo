
import { ComplexCollisionShape } from './CollisionDetection.mjs';
import { Line } from './line.mjs';

export class Polygon{
    constructor(parent, ...points){
        this._lines = [];
        let lastPoint = points[points.length-1];
        for(let point of points){
            this._lines.push(new Line(parent, lastPoint, point, 4));
            lastPoint = point;
            
        }
        
        const collisionShapes = this._lines.map(line => line.getCollisionShape());
        this._collisionShape = new ComplexCollisionShape("Polygon", collisionShapes);
    }

    getCollisionShape(){
        return this._collisionShape;
    }
}
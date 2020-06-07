
import { ComplexCollisionShape } from './CollisionDetection.mjs';
import { Line } from './line.mjs';

export class Path{
    constructor(parent, join, ...points) {
        this._lines = [];
        if (join) points.push(points[0]);

        for(let i = 0; i < points.length -1; i++){
            this._lines.push(new Line(parent, points[i], points[i+1]));
        }
        
        const collisionShapes = this._lines.map(line => line.getCollisionShape());
        this._collisionShape = new ComplexCollisionShape("Path", collisionShapes);
    }

    getCollisionShape(){
        return this._collisionShape;
    }
}
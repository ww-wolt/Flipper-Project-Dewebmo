import { Circle } from './Circle.mjs';

export class CollisionDetection{

    constructor(){
        this._movingObjects = [];
        this._staticObjects = [];

        // const table = document.getElementById('table');
        // this._debugPoint = new Circle(table, new Victor(0,0), 10);
    }


    addMovingObject(collidableObj){
        const collisionShape = collidableObj.getCollisionShape();
        collisionShape.addMoveListener(this.update.bind(this));
        this._movingObjects.push(collisionShape);
    }

    addStaticObject(collidableObj){
        this._staticObjects.push(collidableObj.getCollisionShape());
    }

    // does Collision Detection Stuff
    update(){
        this._movingObjects.forEach((movingItem) =>{
            this._staticObjects.forEach((staticItem) => {
                this.collide(movingItem, staticItem)
            })
        })
    }


    // collides 2 objects
    collide(movingItem, staticItem){

        // check first for Bounding Box Collision
        // only do detail Collision if necessary
        if(this.boundingBoxesCollision(movingItem, staticItem)){
            
            // Circle-Circle Collision
            if( movingItem instanceof CollisionCircle && staticItem instanceof CollisionCircle){
                this.collideCircleCircle(movingItem, staticItem);

            // Circle-Line Collision
            }else if(movingItem instanceof CollisionCircle && staticItem instanceof CollisionLine){
                this.collideCircleLine(movingItem, staticItem);
            }
        }
    }

    boundingBoxesCollision(movingItem, staticItem){
        const bb1 = movingItem.getBoundingBox();
        const bb2 = staticItem.getBoundingBox();

        return ( 
            bb1.minX < bb2.maxX && 
            bb1.maxX > bb2.minX && 
            bb1.minY < bb2.maxY && 
            bb1.maxY > bb2.minY );


        // return ! (
        //     (bb1.maxY < bb2.minY) ||
        //     (bb1.minY > bb2.maxY) ||
        //     (bb1.minX > bb2.maxX) ||
        //     (bb1.maxX < bb2.minX) 
        // );
            
    }
    
    collideCircleCircle(movingItem, staticItem){
        const distX = movingItem.pos.x - staticItem.pos.x;
        const distY = movingItem.pos.y - staticItem.pos.y;
        const distSquared = Math.pow(distX,2) + Math.pow(distY,2);
        const maxRadiusSquared = Math.pow(movingItem.radius + staticItem.radius,2);

        if(distSquared < maxRadiusSquared){

            // Normalenvektor (für Reflektion) berechnen
            const normal = movingItem.pos.subtract(staticItem.pos).normalize();

            // Collisionspunkte für beide Objekte berechnen
            const collisionPointStaticItem = staticItem.pos;
            const vec = normal.clone().multiplyScalar(staticItem.radius + movingItem.radius);
            const collisionPointMovingItem = staticItem.pos.clone().add(vec);
            
            movingItem.hasCollided(staticItem, collisionPointMovingItem, normal);
            staticItem.hasCollided(movingItem, collisionPointStaticItem, normal);
        }
    }

    collideCircleLine(movingItem, staticItem){

        const circle = movingItem; 
        const line = staticItem; 

        const p = circle.pos; // Middle Point of Circle
        const g = line.getLineVector(); // Geradenvektor
        const r = line.a; // Geradenpunkt
        
        // Minimalstelle berechnen
        const t = (g.x * (p.x - r.x) + g.y * (p.y - r.y)) / (g.x*g.x + g.y*g.y); 

        // nearest Point
        const nearestPoint = new Victor(r.x + t * g.x, r.y + t * g.y);

        //this._debugPoint.setPos(nearestPoint);
        
        console.log("CircleLine: Before if")

        // liegt Punkt zwischen Anfang und Endpunkt der Linie ?
        if(this.pMiddleOfAB(nearestPoint.x, line.a.x, line.b.x) && this.pMiddleOfAB(nearestPoint.y, line.a.y, line.b.y)){
        
            console.log("CircleLine: After if")

            const connectionVector = p.clone().subtract(nearestPoint);
            const distSquared = Math.pow(connectionVector.length(), 2)
            const maxRadiusSquared = Math.pow(circle.radius,2)

            if(distSquared < maxRadiusSquared){

                // Normalenvektor (für Reflektion) berechnen
                const normal = connectionVector.normalize();

                // Collisionspunkte für beide Objekte berechnen
                const collisionPointStaticItem = nearestPoint;
                const vec = normal.clone().multiplyScalar(circle.radius);
                const collisionPointMovingItem = nearestPoint.clone().add(vec);
                
                movingItem.hasCollided(staticItem, collisionPointMovingItem, normal);
                staticItem.hasCollided(movingItem, collisionPointStaticItem, normal);
            }

        }
    }

    pMiddleOfAB(p,a,b){
        const arr = [p,a,b];
        arr.sort((a, b) => a - b);
        return arr[1] === p;
    }

}



export class CollisionShape{

    constructor(name){
        this.name = name;
        this._collisionListeners = [];
        this._moveListeners = [];
        this.bounciness = 1;
        this.boundingBox = null;
    }

    addMoveListener(callback){
        this._moveListeners.push(callback);
    }

    notifyMoveListeners(){
        this._moveListeners.forEach(callback => callback());
    }

    hasMoved(){
        this.notifyMoveListeners();
    }
    
    addCollisionListener(callback){
        this._collisionListeners.push(callback);
    }

    notifyCollisionListeners(otherObject, collisionPoint, normal){
        this._collisionListeners.forEach(callback => callback(otherObject, collisionPoint, normal));
    }

    hasCollided(otherObject, collisionPoint, normal){
        this.notifyCollisionListeners(otherObject, collisionPoint, normal);
    }
}

export class CollisionCircle extends CollisionShape{
    
    constructor(name, radius, pos){
        super(name);
        this.radius = radius;
        this.pos = pos;
    }

    getBoundingBox() {
        const minX = this.pos.x - this.radius;
        const maxX = this.pos.x + this.radius;
        const minY = this.pos.y - this.radius;
        const maxY = this.pos.y + this.radius;
        return new BoundingBox(minX, maxX, minY, maxY);
    }
}

export class CollisionLine extends CollisionShape{
    
    constructor(name, a, b){
        super(name);
        this.a = a;
        this.b = b;
    }

    getBoundingBox() {
        const minX = Math.min(this.a.x, this.b.x);
        const maxX = Math.max(this.a.x, this.b.x);
        const minY = Math.min(this.a.y, this.b.y);
        const maxY = Math.max(this.a.y, this.b.y);
        return new BoundingBox(minX, maxX, minY, maxY);
    }

    getLineVector(){
        return this.b.clone().subtract(this.a);
    }
}


export class ComplexCollisionShape extends CollisionShape{
    
    constructor(name, ...collisionShapes){
        super(name);
        this.collisionShapes = collisionShapes;
    }

    get boundingBox(){
        
        const boundingBoxes = this.collisionShapes.map(shape => shape.getBoundingBox());
        const minX = Math.min(...boundingBoxes.map(bb => bb.minX));
        const maxX = Math.max(...boundingBoxes.map(bb => bb.maxX));
        const minY = Math.min(...boundingBoxes.map(bb => bb.minY));
        const maxY = Math.max(...boundingBoxes.map(bb => bb.maxY));

        return new BoundingBox(minX, maxX, minY, maxY);
    }
}

export class BoundingBox {
    constructor(minX, maxX, minY, maxY){
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }
}

import { Circle } from './Circle.mjs';

export class CollisionDetection{

    constructor(){
        this._movingObjects = [];
        this._staticObjects = [];

        // const table = document.getElementById('table');
        // this._debugPoint = new Circle(table, new Victor(0,0), 10);
    }

    addMovingObject(collidableObj){
        this.addMovingShape(collidableObj.getCollisionShape());
    }

    addMovingShape(collisionShape){
        collisionShape.addMoveListener(this.update.bind(this));
        this._movingObjects.push(collisionShape);
    }

    addStaticObject(collidableObj){
        this.addStaticShape(collidableObj.getCollisionShape());
    }

    addStaticShape(collisionShape){
        this._staticObjects.push(collisionShape);
    }



    // does Collision Detection Stuff
    update(){
        this._movingObjects.forEach((movingShape) =>{
            this._staticObjects.forEach((staticShape) => {
                this.collide(movingShape, staticShape)
            })
        })
    }

    // collides 2 objects
    collide(movingShape, staticShape){

        // check first for Bounding Box Collision
        // only do detail Collision if necessary
        if(this.boundingBoxesCollision(movingShape, staticShape)){

            if(movingShape instanceof CollisionCircle){
                
                // Circle-Circle Collision
                if(staticShape instanceof CollisionCircle){
                    this.collideCircleCircle(movingShape, staticShape);

                // Circle-Line Collision
                }else if(staticShape instanceof CollisionLine){
                    this.collideCircleLine(movingShape, staticShape);
                
                 // Circle-ComplexShape Collision
                }else if(staticShape instanceof ComplexCollisionShape){
                    this.collideCircleComplexShape(movingShape, staticShape);
                }
            }
        }
    }

    boundingBoxesCollision(movingShape, staticShape){
        const bb1 = movingShape.getBoundingBox();
        const bb2 = staticShape.getBoundingBox();

        return ( 
            bb1.minX < bb2.maxX && 
            bb1.maxX > bb2.minX && 
            bb1.minY < bb2.maxY && 
            bb1.maxY > bb2.minY );        
    }

    collideCircleComplexShape(movingShape, staticShape){

        // staticShape is complex, so iterate over every (simple) collision shape
        staticShape.collisionShapes.forEach((shape) => {
            this.collide(movingShape, shape)
        });
    }

    collideCircleCircle(movingShape, staticShape){
        const distX = movingShape.pos.x - staticShape.pos.x;
        const distY = movingShape.pos.y - staticShape.pos.y;
        const distSquared = Math.pow(distX,2) + Math.pow(distY,2);
        const maxRadiusSquared = Math.pow(movingShape.radius + staticShape.radius,2);

        if(distSquared < maxRadiusSquared){

            // Normalenvektor (für Reflektion) berechnen
            const normal = movingShape.pos.subtract(staticShape.pos).normalize();

            // Collisionspunkte für beide Objekte berechnen
            const collisionPointStaticShape = staticShape.pos;
            const vec = normal.clone().multiplyScalar(staticShape.radius + movingShape.radius);
            const collisionPointMovingShape = staticShape.pos.clone().add(vec);
            
            movingShape.hasCollided(staticShape, collisionPointMovingShape, normal);
            staticShape.hasCollided(movingShape, collisionPointStaticShape, normal);
        }
    }

    collideCircleLine(movingShape, staticShape){

        const circle = movingShape; 
        const line = staticShape; 

        const p = circle.pos; // Middle Point of Circle
        const g = line.getLineVector(); // Geradenvektor
        const r = line.a; // Geradenpunkt
        
        // Minimalstelle berechnen
        const t = (g.x * (p.x - r.x) + g.y * (p.y - r.y)) / (g.x*g.x + g.y*g.y); 

        // Punkt auf Linie ausrechnen
        const nearestPoint = new Victor(r.x + t * g.x, r.y + t * g.y);

        const connectionVector = p.clone().subtract(nearestPoint);
        const distSquared = Math.pow(connectionVector.length(), 2)
        const maxRadiusSquared = Math.pow(circle.radius,2)

        // Handelt es sich effektiv um Kollision?
        if(distSquared < maxRadiusSquared){

            // Normalenvektor (für Reflektion) berechnen
            const normal = connectionVector.normalize();

            // Collisionspunkte für beide Objekte berechnen
            const collisionPointStaticShape = nearestPoint;
            const vec = normal.clone().multiplyScalar(circle.radius);
            const collisionPointMovingShape = nearestPoint.clone().add(vec);

            // Notify Listeners
            movingShape.hasCollided(staticShape, collisionPointMovingShape, normal);
            staticShape.hasCollided(movingShape, collisionPointStaticShape, normal);
        }
    }
}

export class CollisionShape{

    constructor(name){
        this.name = name;
        this._collisionListeners = [];
        this._moveListeners = [];
        this.bounciness = 1;
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
    
    constructor(name, collisionShapes){
        super(name);
        this.collisionShapes = collisionShapes;
    }

    getBoundingBox(){
        
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

import {Vector2} from "three";

export class MadMath {

    constructor(){

    }

    public static degreesToRadians(degrees:number):number {
        return degrees * Math.PI / 180;
    }

    public static  radiandsToDegrees(radians:number):number {
        return radians * 180 / Math.PI;
    }

    public static radialPosition(center:Vector2, radius:number, angle:number): Vector2 {
        const rad: number = Math.PI * (angle) / 180;
        const cos: number = Math.cos(rad);
        const sin: number = Math.sin(rad);
        const x:number = center.x+(radius*cos);
        const y:number = center.y+(radius*sin);
        return new Vector2(x, y);
    }
}
import { UnderscoreStatic } from "underscore";

export class Utils {
    public static negate(value: boolean): boolean {
        return !value;
    }

    public static deepExtend(target: any, source: any): any {
        for (var prop in source) {
            if(prop in target && typeof target[prop] === 'object') {
                Utils.deepExtend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
        return target;
    }

    public static toRadians = (degrees: any): Number => {
        return degrees * Math.PI / 180
    }

    public static toDegrees = (radians: any): Number => {
        return radians * 180 / Math.PI
    }
}

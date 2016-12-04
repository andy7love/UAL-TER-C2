/// <reference path="../../typings/globals/underscore/index.d.ts" />
let _: UnderscoreStatic = require('underscore');

export class Utils {
    public static negate(value: boolean): boolean {
        return !value;
    } 
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParser = void 0;
class AbstractParser {
    constructor() {
        this.name = '';
    }
    parse(url) {
        console.log("WARNING: AbstractParser - parse called");
        return undefined;
    }
    startModule() {
    }
}
exports.AbstractParser = AbstractParser;

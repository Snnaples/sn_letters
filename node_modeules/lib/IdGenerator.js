"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdGenerator {
    constructor() {
        this._max = 0;
        this._ids = [];
    }
    gen() {
        var _a;
        return (_a = this._ids.pop()) !== null && _a !== void 0 ? _a : this._max++;
    }
    free(id) {
        this._ids.push(id);
    }
    clear() {
        this._max = 0;
        this._ids = [];
    }
}
exports.default = IdGenerator;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindInterface = exports.getInterface = void 0;
const IdGenerator_1 = require("./IdGenerator");
function getInterface(name, identifier = GetCurrentResourceName()) {
    const ids = new IdGenerator_1.default();
    const callbacks = {};
    onNet(`${name}:${identifier}:tunnel_res`, (id, payloads) => {
        const callback = callbacks[id];
        if (callback) {
            delete callbacks[id];
            ids.free(id);
            callback(payloads.length <= 1 ? payloads[0] : payloads);
        }
    });
    function generateHandler(memberName) {
        return (target, ...args) => {
            if (target === -1 || memberName.startsWith('_')) {
                return emitNet(`${name}:tunnel_req`, target, memberName.substring(1), args, identifier, -1);
            }
            return new Promise(resolve => {
                const id = ids.gen();
                callbacks[id] = resolve;
                emitNet(`${name}:tunnel_req`, target, memberName, args, identifier, id);
            });
        };
    }
    return new Proxy({}, {
        get(target, member) {
            const memberName = member.toString();
            if (!target[memberName]) {
                target[memberName] = generateHandler(memberName);
            }
            return target[memberName];
        },
        set() {
            throw new Error("set isn't supported on Tunnel access");
        },
    });
}
exports.getInterface = getInterface;
function bindInterface(name, handlers) {
    onNet(`${name}:tunnel_req`, (member, args, identifier, id) => __awaiter(this, void 0, void 0, function* () {
        const source = global.source;
        const handler = handlers[member];
        let payload;
        if (handler) {
            try {
                payload = yield handler(...args);
            }
            catch (err) {
                console.error(err);
            }
        }
        if (id >= 0) {
            emitNet(`${name}:${identifier}:tunnel_res`, source, id, [payload]);
        }
    }));
}
exports.bindInterface = bindInterface;

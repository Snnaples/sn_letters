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
exports.addInterface = exports.getInterface = void 0;
const IdGenerator_1 = require("./IdGenerator");
function getInterface(name, identifier = GetCurrentResourceName()) {
    const ids = new IdGenerator_1.default();
    const callbacks = {};
    on(`${name}:${identifier}:proxy_res`, (id, payloads) => {
        const callback = callbacks[id];
        if (callback) {
            delete callbacks[id];
            ids.free(id);
            callback(payloads.length <= 1 ? payloads[0] : payloads);
        }
    });
    function generateHandler(memberName) {
        return (...args) => {
            if (memberName.startsWith('_')) {
                return emit(`${name}:proxy`, memberName.substring(1), args, identifier, -1);
            }
            let responseReady = false;
            let response;
            const promise = new Promise(resolve => {
                const id = ids.gen();
                callbacks[id] = value => {
                    responseReady = true;
                    response = value;
                    resolve(response);
                };
                emit(`${name}:proxy`, memberName, args, identifier, id);
            });
            return responseReady ? response : promise;
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
            throw new Error('cannot set values on proxy access interface');
        },
    });
}
exports.getInterface = getInterface;
function addInterface(name, handlers) {
    on(`${name}:proxy`, (member, args, identifier, id) => __awaiter(this, void 0, void 0, function* () {
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
        else {
            console.log(`error: proxy call ${name}:${member} not found`);
        }
        if (id >= 0) {
            emit(`${name}:${identifier}:proxy_res`, id, [payload]);
        }
    }));
}
exports.addInterface = addInterface;

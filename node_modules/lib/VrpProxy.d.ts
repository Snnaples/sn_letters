export declare type Handler = (...args: any[]) => Promise<unknown> | unknown;
export interface Handlers {
    [member: string]: Handler;
}
export declare function getInterface(name: string, identifier?: string): Handlers;
export declare function addInterface(name: string, handlers: Handlers): void;

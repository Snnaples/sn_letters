export declare type CallHandler = (target: number | string, ...args: any[]) => Promise<unknown> | void;
export interface CallHandlers {
    [member: string]: CallHandler;
}
export declare type BindHandler = (...args: any[]) => Promise<unknown> | unknown;
export interface BindHandlers {
    [member: string]: BindHandler;
}
export declare function getInterface(name: string, identifier?: string): CallHandlers;
export declare function bindInterface(name: string, handlers: BindHandlers): void;

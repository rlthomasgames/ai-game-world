declare module "stream-browserify" {
    export interface IWriter {
        write(chunk: any, encodingOrCB?: string | Function, cb?: Function): boolean;
    }

    export class Transform implements IWriter{
        constructor(opts?: any);
        write(chunk: any, encodingOrCB?: string | Function, cb?: Function): boolean;
    }
}
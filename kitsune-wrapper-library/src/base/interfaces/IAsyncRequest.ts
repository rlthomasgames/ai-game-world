export default interface IAsyncRequest {
    request(valuedObject?: unknown, gzipped?: boolean): Promise<unknown> | undefined | void;
}

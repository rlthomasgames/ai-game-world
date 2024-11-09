export type MsgObject = {
    readonly type: string;
};

export type AuthMsg = MsgObject & {
    auth_token: string
};

export type SOCK_FLAG<s extends String> = s;
declare interface ISOCK {
    readonly CONNECT: SOCK_FLAG<'connect'>;
    readonly AUTH_TOKEN: SOCK_FLAG<'AUTH_TOKEN'>;
    readonly KICK: SOCK_FLAG<'disconnect'>;
    readonly SOCK_ID: SOCK_FLAG<'SOCK_ID'>;
    readonly GZIPPED_EVENT: SOCK_FLAG<'GZIP'>;
    readonly AP_REQ: SOCK_FLAG<'assetPackREQ'>;
    readonly CONNECTION: SOCK_FLAG<'connection'>;
    readonly AP_RES: SOCK_FLAG<'assetPackRES'>;
    readonly PY_REQ: SOCK_FLAG<'pythonREQ'>;
    readonly PY_RES: SOCK_FLAG<'pythonRES'>;
}

export const SOCK:ISOCK = {
    CONNECT: "connect",
    AUTH_TOKEN: "AUTH_TOKEN",
    KICK: "disconnect",
    SOCK_ID: "SOCK_ID",
    GZIPPED_EVENT: "GZIP",
    AP_REQ: "assetPackREQ",
    CONNECTION: 'connection',
    AP_RES: 'assetPackRES',
    PY_REQ: "pythonREQ",
    PY_RES: "pythonRES",
}

export interface APResponseData {
    data: ArrayBuffer
    index: number
    assetPackUUID: string
    total: number
    fileIndex: number
    filePacketIndex:number
}
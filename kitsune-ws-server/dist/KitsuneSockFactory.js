"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitsuneSock = exports.KitsuneSockFactory = exports.defaultEventHandler = void 0;
const colors = require("colors");
const socket_io_1 = require("socket.io");
const jwt = __importStar(require("jsonwebtoken"));
const http = __importStar(require("http"));
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const fflate = __importStar(require("fflate"));
const fflate_1 = require("fflate");
const fs = __importStar(require("fs"));
const KVerboseLog_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KVerboseLog"));
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const child_process_1 = require("child_process");
colors.enable();
let socketUsed;
const defaultEventHandler = (event, next) => {
    console.log(`server received ${event}`);
    const eventMap = event.map((value, index, array) => {
        console.log(`map: ${value} | index: ${index} | array: ${array}`);
    });
    switch (event[0]) {
        case kitsune_wrapper_library_1.SOCK.GZIPPED_EVENT:
            const data = event[1];
            console.log(KVerboseLog_1.default.log(`${kitsune_wrapper_library_1.SOCK.GZIPPED_EVENT} recieved data gzipped :  `)); //${data}
            const unzipped = fflate.decompressSync(data);
            const blob = new Blob([unzipped], { type: 'text/plain' });
            blob.arrayBuffer().then((arrayBuf) => {
                const asString = (0, fflate_1.strFromU8)(new Uint8Array(arrayBuf));
                console.log(`UNZIPPED:`);
                console.log(`${KVerboseLog_1.default.log("as Uint8Array :") + "\n"}${KVerboseLog_1.default.log(unzipped + "") + "\n"}
                    ${KVerboseLog_1.default.log("as String :") + "\n"}${KVerboseLog_1.default.log(`${asString}`) + "\n"}
                    ${KVerboseLog_1.default.log("as JSON object :")}`);
                const object = JSON.parse(`${asString}`);
                console.log('current object', object);
                const assetReq = object[kitsune_wrapper_library_1.SOCK.AP_REQ] != undefined;
                const pyReq = object['PY_REQ'] != undefined;
                let completeBuffer = '';
                if (assetReq) {
                    const arrayPaks = object[kitsune_wrapper_library_1.SOCK.AP_REQ];
                    if (arrayPaks) {
                        console.log('trying to load : ', arrayPaks);
                        arrayPaks.forEach((pak, index) => {
                            const relativePath = `../kitsune-asset-store/packets/${pak}`;
                            console.log('trying to open : ', relativePath, index);
                            if (fs.existsSync(relativePath)) {
                                console.log('path exists...', relativePath);
                                fs.readdir(relativePath, (err, files) => {
                                    files.forEach((value, index, packetsArr) => {
                                        const packetPath = relativePath + '/' + value;
                                        const fd = fs.openSync(packetPath, 'r');
                                        if (fd) {
                                            const fileNo = value.split('p')[1].split('|')[0];
                                            const filePacketNo = value.split('|')[1].split('.')[0];
                                            //KitsuneHelper.getInstance().debugObject(value, [fileNo])
                                            //KitsuneHelper.getInstance().debugObject(value.split('p'), value.split('|'))
                                            const buffer = fs.readFileSync(packetPath);
                                            const sendPromise = sendWhenPromised({
                                                data: buffer,
                                                index: index + 1,
                                                assetPackUUID: pak,
                                                total: packetsArr.length,
                                                fileIndex: parseInt(fileNo),
                                                filePacketIndex: parseInt(filePacketNo)
                                            });
                                            //console.log(`sent packet ${index+1} of ${packetsArr.length} for asset pak ${pak} buffer: ${buffer}`)
                                        }
                                    });
                                });
                            }
                            else {
                                console.log(colors.bgYellow.red("UNABLE TO FIND ASSET PACK... " + relativePath + ""));
                            }
                        });
                    }
                    else {
                        console.log('received erroneous asset pak request: IGNORING1 ' + JSON.stringify(eventMap) + '');
                    }
                }
                if (pyReq) {
                    if (socketUsed) {
                        socketUsed.socket.emit(kitsune_wrapper_library_1.SOCK.PY_RES, 'grape');
                        const pythonProcess = (0, child_process_1.spawn)('python3', ['https://localhost:8080/random_string2.py']);
                        console.log('snding grape');
                        console.log('process', pythonProcess);
                        //const pythonProcess = spawn('python', ['./public/random_string2.py', 'test']);
                        pythonProcess.stdout.on('data', (data) => {
                            console.log('data ---', data);
                            const randomString = data.toString().trim();
                            console.log('got random string', randomString);
                            if (socketUsed) {
                                socketUsed.socket.emit(kitsune_wrapper_library_1.SOCK.PY_RES, randomString);
                                console.log('generate', randomString);
                            }
                        });
                        pythonProcess.emit('spawn');
                    }
                    /*
                    const promiseOfPy = new Promise<string>((resolve, reject) => {
                        console.log('got py request', pyReq);
                        let generateVal: string | null = object['PY_REQ'].GENERATE.value;
                        if(generateVal){
                            console.log('ready to send prompt to python BE GEMINI', generateVal);
                            const pythonProcess = spawn('python', ['./public/random_string2.py', generateVal]);
                            //const pythonProcess = spawn('python', ['./public/random_string2.py', 'test']);
                            pythonProcess.stdout.on('data', (data:unknown) => {
                                const randomString = (data as any).toString().trim();
                                console.log('got random string', randomString);
                                if(socketUsed){
                                    socketUsed.socket.emit(SOCK.PY_RES, randomString);
                                    resolve(randomString);
                                }
                            });
                        }
                    })
                    const randomString = promiseOfPy.then((value)=>{
                        return value;
                    });
                    return randomString;
                    */
                }
            });
            next();
            return;
        default:
            //console.log('check what events come in??', event, eventMap);
            next();
            return;
    }
};
exports.defaultEventHandler = defaultEventHandler;
const sendWhenPromised = (payload) => {
    if (socketUsed) {
        if (payload instanceof Promise) {
            socketUsed.socket.emit(kitsune_wrapper_library_1.SOCK.AP_RES, KitsuneHelper_1.default.asyncAwait(payload));
        }
        else {
            socketUsed.socket.emit(kitsune_wrapper_library_1.SOCK.AP_RES, payload);
        }
    }
    return { socket: socketUsed, payload: payload };
};
class KitsuneSockFactory {
    async createServer(express, eventHandler) {
        const promise = new Promise((resolve, reject) => {
            const secretKey = this.generateSecretFromCookie();
            const httpServer = http.createServer();
            const server = new socket_io_1.Server(httpServer, {
                cookie: true,
                transports: ["websocket", "polling"],
                cors: {
                    origin: 'http://localhost:3000',
                    methods: ["GET", "POST"]
                }
            });
            server.on(kitsune_wrapper_library_1.SOCK.CONNECTION, async (socket) => {
                if (socket.handshake.auth && socket.handshake.auth.token) {
                    const jwtToken = jwt.sign({
                        id: socket.handshake.auth.sessionId,
                    }, secretKey, {
                        expiresIn: '1h'
                    });
                    socket.emit(`${kitsune_wrapper_library_1.SOCK.AUTH_TOKEN}`, { auth_token: jwtToken });
                    // socket.send({ type:MsgType.AUTH_TOKEN, auth_token: jwtToken });
                    // console.log(`generated jwt token ${jwtToken} and sent to ${socket.client}`);
                    const sockets = await server.fetchSockets();
                    // console.log('check sockets.. ', sockets);
                    sockets.forEach((sock) => {
                        console.log(`client ${sock.id} found in sockets`);
                    });
                    console.log('connection handshake', socket.handshake);
                    socket.use(eventHandler);
                    socket.on("error", (err) => {
                        if (err && err.message === "unauthorized event") {
                            socket.disconnect();
                        }
                    });
                    resolve(socketUsed = new KitsuneSock(secretKey, server, socket));
                }
                else {
                    socket.emit(kitsune_wrapper_library_1.SOCK.KICK, {});
                }
            });
            server.on(kitsune_wrapper_library_1.SOCK.GZIPPED_EVENT, async (socket) => {
                console.log('ready to send the asset data r0', socket);
            });
            server.on(kitsune_wrapper_library_1.SOCK.AP_REQ, async (socket) => {
                console.log('ready to send the asset data r1', socket);
            });
            server.on(kitsune_wrapper_library_1.SOCK.PY_REQ, async (socket) => {
                console.log('ready to send the py request data r2', socket);
            });
            server.listen(3000);
        });
        return await promise;
    }
    generateSecretFromCookie() {
        return 'SECRET_KEY';
    }
}
exports.KitsuneSockFactory = KitsuneSockFactory;
class KitsuneSock {
    constructor(secret_key, server, socket) {
        this.secretKey = secret_key;
        this.server = server;
        this.socket = socket;
    }
}
exports.KitsuneSock = KitsuneSock;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const KitsuneSockFactory_1 = require("../kitsune-ws-server/src/KitsuneSockFactory");
const { spawn } = require('child_process');
const express = require('express');
const httpCs = require('http');
const socketio = require('socket.io');
const KVerboseLog_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KVerboseLog"));
const app = express();
const httpServer = httpCs.createServer(app);
const io = new socketio.Server(httpServer);
let promisedSServer = null;
let oauth2Client = {};
let accessToken = {};
let oauth2 = {};
let kSockConn = null;
const clientId = '936515445243-9l90bt6f4kg7c6nvmp6mpkub24r57a3g.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:3000/auth/google/callback';
function createSock() {
    return __awaiter(this, void 0, void 0, function* () {
        console.info('createSock - function to generate backend service');
        let factory = new KitsuneSockFactory_1.KitsuneSockFactory();
        console.log('factory creating socket connection');
        console.log(`using ${factory}`);
        kSockConn = yield factory.createServer(express, KitsuneSockFactory_1.defaultEventHandler);
        console.log('promised server..', kSockConn);
        kSockConn.socket.on('connection', (socket) => {
            console.log('a user connected');
        });
    });
}
const handleCallback = (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log('got authorization', tokens);
    }
    catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).send('Error exchanging code for tokens');
    }
};
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        let authUrl;
        try {
            authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/userinfo.email'],
            });
            console.log('Authorize:', authUrl);
            const response = yield fetch(authUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            });
            console.log('authorized :', response);
            const userinfo = yield getUserInfo(response);
            console.log('responded with :', userinfo);
            //const userinfo = await getUserInfo(response)
        }
        catch (error) {
            console.log(error);
            console.error('Error exchanging authorize');
            console.info(authUrl);
        }
    });
}
function getUserInfo(auth_res) {
    return __awaiter(this, void 0, void 0, function* () {
        //accessToken = await oauth2Client.getAccessToken();
        let body = auth_res.body;
        console.log('accessToken:', body);
        const bodyData = yield (new Response(body)).text();
        console.log('data:', bodyData);
        return bodyData;
    });
}
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/auth/google/callback', (req, res) => {
    handleCallback(req, res);
});
app.get('/wrapper', (req, res) => {
    res.sendFile(__dirname + '../kitsune-wrapper/dist/index.html');
    const pythonProcess = spawn('python', ['./public/random_string2.py', 'test']);
    pythonProcess.stdout.on('data', (data) => {
        var _a;
        const randomString = data.toString().trim();
        (_a = kSockConn === null || kSockConn === void 0 ? void 0 : kSockConn.socket) === null || _a === void 0 ? void 0 : _a.emit(randomString);
        console.log('object = ', kSockConn === null || kSockConn === void 0 ? void 0 : kSockConn.socket, kSockConn === null || kSockConn === void 0 ? void 0 : kSockConn.socket.id);
    });
});
app.get('/config/lobby.json', (req, res) => {
    res.sendFile(__dirname + '/public/config/lobby.json');
});
httpServer.listen(9029, () => {
    console.log('Frontend server listening on port 9029');
    process.title = 'kws-server';
});
KVerboseLog_1.default.VERBOSE_LOG = true;
createSock();

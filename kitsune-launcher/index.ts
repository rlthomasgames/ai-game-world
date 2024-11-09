import {defaultEventHandler, KitsuneSock, KitsuneSockFactory} from "../kitsune-ws-server/src/KitsuneSockFactory";
const { spawn } = require('child_process');
const express = require('express');
const httpCs = require('http');
const socketio = require('socket.io');
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import KVerboseLog from "kitsune-wrapper-library/dist/base/helper/KVerboseLog";

const app = express();
const httpServer = httpCs.createServer(app);
const io = new socketio.Server(httpServer);
let promisedSServer: KitsuneSock | Promise<KitsuneSock> | null = null
let oauth2Client:any = {};
let accessToken:any = {};
let oauth2:any = {};
let kSockConn: KitsuneSock | null = null
const clientId = '936515445243-9l90bt6f4kg7c6nvmp6mpkub24r57a3g.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:3000/auth/google/callback';

async function createSock()
{
    console.info('createSock - function to generate backend service')
    let factory: KitsuneSockFactory | null = new KitsuneSockFactory();
    console.log('factory creating socket connection');
    console.log(`using ${factory}`)
    kSockConn = await (factory as KitsuneSockFactory).createServer(express, defaultEventHandler)
    console.log('promised server..', kSockConn)
    kSockConn.socket.on('connection', (socket:unknown) => {
        console.log('a user connected');
    });
}

const handleCallback = (req: unknown, res: unknown)=>{
    const code = (req as any).query.code as string;
    try {
        const { tokens } = oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log('got authorization', tokens)
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        (res as any).status(500).send('Error exchanging code for tokens');
    }
}

async function authorize() {
    let authUrl
    try {
        authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.email'],
        });

        console.log('Authorize:', authUrl);
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} });

        console.log('authorized :', response);
        const userinfo = await getUserInfo(response);
        console.log('responded with :', userinfo);
        //const userinfo = await getUserInfo(response)

    } catch (error) {
        console.log(error)
        console.error('Error exchanging authorize');
        console.info(authUrl);
    }
}

async function getUserInfo(auth_res: unknown) : Promise<any> {
    //accessToken = await oauth2Client.getAccessToken();
    let body = (auth_res as any).body
    console.log('accessToken:', body)
    const bodyData = await (new Response(body)).text();
    console.log('data:', bodyData)
    return bodyData
}

app.use(express.static('public'));
app.get('/', (req: Object, res: Object) => {
    (res as any).sendFile(__dirname + '/public/index.html');
});
app.get('/auth/google/callback', (req: Object, res: Object) => {
    handleCallback(req, res)
});

app.get('/wrapper', (req: Object, res: Object) => {
    (res as any).sendFile(__dirname + '../kitsune-wrapper/dist/index.html');

    const pythonProcess = spawn('python', ['./public/random_string2.py', 'test']);
    pythonProcess.stdout.on('data', (data:unknown) => {
        const randomString = (data as any).toString().trim();
        kSockConn?.socket?.emit(randomString)
        console.log('object = ', kSockConn?.socket, kSockConn?.socket.id)

    });
});

app.get('/config/lobby.json', (req: Object, res: Object) => {
    (res as any).sendFile(__dirname + '/public/config/lobby.json');
});

httpServer.listen(9029, () => {
    console.log('Frontend server listening on port 9029');
    process.title = 'kws-server';
});

KVerboseLog.VERBOSE_LOG = true;

createSock()


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
exports.AssetVendorService = exports.default = void 0;
exports.startAssetVendorService = startAssetVendorService;
exports.asyncAwait = asyncAwait;
process.title = 'kasset-store';
const FlushAssetStoreService_1 = __importDefault(require("./FlushAssetStoreService"));
const BuildPacketsFromUploadsService_1 = __importDefault(require("./BuildPacketsFromUploadsService"));
const UploadRoutes_1 = require("./routes/UploadRoutes");
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const formidable_1 = require("formidable");
const Base64_1 = require("./encoding/Base64");
const fflate_1 = require("fflate");
const fs = __importStar(require("fs"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const routes = [];
const crypto_1 = __importDefault(require("crypto"));
const port = 8081;
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const colors_1 = __importDefault(require("colors"));
colors_1.default.enable();
const startExpress = () => {
    app.listen(port, () => {
        //app
        console.log('listening port', port);
        routes.forEach((route) => {
            console.log(`Routes configured for ${route.getName()}`);
        });
    });
    return true;
};
class AssetVendorService {
    //1 : clear any assets stored for time being, so work on uploader and gzipper can be carried out.
    constructor() {
        console.log('CLEARING STORE'.green.bgMagenta.bold);
        const build = () => { new BuildPacketsFromUploadsService_1.default(); };
        const chained = [() => { new FlushAssetStoreService_1.default(); }, () => { setTimeout(build, 6000); setTimeout(startExpress, 12500); }];
        while (chained[0] !== undefined) {
            chained[0].call(null);
            chained.splice(0, 1);
            //KitsuneHelper.getInstance().debugObject(this as unknown, Object.values(this))
        }
    }
    storeFileFromUint8(files, cb, incomingMessage) {
        console.log('storing !');
        incomingMessage ? console.log(incomingMessage) : null;
        const uploadedFile = files;
        const tempDirectory = "../uploaded/incoming";
        if (!fs.existsSync(tempDirectory)) {
            fs.mkdirSync(tempDirectory, { recursive: true });
        }
        const uID = crypto_1.default.randomUUID();
        const uShortID = (uID.slice(uID.length - 12, uID.length - 1));
        const hashHex = hexUtil(uShortID, 6, false);
        const tempName = tempDirectory + `/incoming${hashHex}.tmp`;
        fs.writeFileSync(tempName, uploadedFile);
        // @ts-ignore
        process.stdout.write(`${KitsuneHelper_1.default.kChar} < wrote file :  ${tempName} \n\n`);
        const stringZip = (0, fflate_1.strFromU8)(uploadedFile);
        const arr = stringZip.split('Kitsune Wrapper Asset ')[1].split('|');
        const assetPackUUID = arr[1];
        const directory = "../uploaded/" + assetPackUUID + "";
        const filename = arr[2].split(' ')[2];
        // @ts-ignore
        process.stdout.write(`${KitsuneHelper_1.default.kChar} Almost Finished ... \n`);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        const fullPath = `${directory}/${filename}.zip`;
        fs.renameSync(tempName, fullPath);
        const successOut = (finial) => {
            // @ts-ignore
            process.stdout.write(`${KitsuneHelper_1.default.kChar} ~ ~ ~ ~ asset pack \n` +
                assetPackUUID.zebra + '\n' +
                `|......includes....<- ` +
                `${filename}\n`.rainbow +
                `|...length zipped..<- `.bgGreen +
                `${uploadedFile.length}\n`.rainbow +
                `|....temp file.....<- \n`.bgGreen +
                `${tempName.replace(tempDirectory, '')}`.rainbow + `\n\n`.bgYellow.black.italic);
            finial();
        };
        const failOut = () => {
            console.log('something went horribly wrong...\n', `${tempName}\n${fullPath}\n${uploadedFile.length}\n${fullPath}\n${filename}\n${assetPackUUID}\n`);
        };
        fs.stat(fullPath, (err, stats) => {
            const success = stats.isFile() && fullPath.toString().split('/').pop() === filename + '.zip';
            success ? (successOut(cb)) : failOut();
        });
        const moveSuccess = filename + `.zip`;
        return moveSuccess;
    }
}
exports.default = AssetVendorService;
exports.AssetVendorService = AssetVendorService;
function startAssetVendorService() { return new AssetVendorService(); }
;
//this is our entry into AssetServices
const assetVendorService = startAssetVendorService();
app.use((0, cors_1.default)({ origin: 'https://localhost:8080' }));
// default options
app.use((0, express_fileupload_1.default)());
const hexUtil = (str, reduceSize, pad) => {
    console.log('hexing string: ' + str);
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << reduceSize - 1) - hash);
    });
    let hex = '';
    for (let i = 0; i < Math.floor(reduceSize / 2); i++) {
        const value = (hash >> (i * 8)) & 0xff;
        hex += value.toString(16);
    }
    return (pad ? hex.padStart(3, '00x') : hex);
};
routes.push(new UploadRoutes_1.UploadRoutes(app, 'UploadRoutes'));
app.route('/upload').post((req, res, next) => {
    let form = new formidable_1.IncomingForm();
    form.once("end", () => {
        process.stdout.write(`END =) \n`);
    });
    process.stdout.write('incoming form has events ... ' + form.eventNames() + '');
    form.on("fileBegin", (formName, file) => {
        process.stdout.write("\r\x1b[k");
        // @ts-ignore
        process.stdout.write(`${KitsuneHelper_1.default.kChar} > file begin :  `.bgGreen.black.italic);
        process.stdout.write(`\n`);
    });
    form.on("file", (formName, file) => {
        process.stdout.write("\r\x1b[k");
        // @ts-ignore
        process.stdout.write(`${KitsuneHelper_1.default.kChar} > file :  `.bgGreen.black.italic);
        process.stdout.write(`\n`);
    });
    form.on("progress", (bytesReceived, bytesExpected) => {
        process.stdout.write("\r\x1b[k");
        // @ts-ignore
        process.stdout.write(`${KitsuneHelper_1.default.kChar} > progress :  `.bgGreen.black.italic);
        process.stdout.write(`${(Math.floor(100 / (bytesExpected * bytesReceived))).toString()} %`.rainbow);
        if (Math.floor(100 / bytesExpected * bytesReceived) === 100) {
            process.stdout.write(`\n -> complete\n`);
        }
    });
    form.on("error", (err) => {
        process.stdout.write("\r\x1b[k");
        // @ts-ignore
        process.stdout.write(`${KitsuneHelper_1.default.kChar} > incoming data :  `.bgGreen.black.italic);
        console.log('|||||||||||||| Error  |||||||||||||'.zebra.underline);
        console.log(`Error: ${err.name} : ${err}  \n`.bgRed.underline);
        err.stack != undefined ? console.log(err.stack.bgYellow) : console.log(`... missing stack trace ... \n`.bgRed.underline);
        process.stdout.write(`\n`);
        process.stdout.write(`\n`);
        res.sendStatus(500);
        next();
    });
    form.parse(req, (err, fields) => {
        process.stdout.write(`debugging asset fail - fields! ${fields.files}`);
        if (err) {
            // @ts-ignore
            process.stdout.write(`${KitsuneHelper_1.default.kChar} we got error`, err);
            return;
        }
        // @ts-ignore
        process.stdout.write(`\n`.reset + `${KitsuneHelper_1.default.kChar} < some request info: \n`.bgYellow.green);
        if (fields.files) {
            const files = fields.files;
            const uploadedFile = (0, Base64_1.base64ToBytes)(files);
            const storedName = assetVendorService.storeFileFromUint8(uploadedFile, () => {
                // @ts-ignore
                process.stdout.write(`${KitsuneHelper_1.default.kChar} > FINISHED ${storedName}\n\n`);
                // @ts-ignore
                process.stdout.write(`\n${KitsuneHelper_1.default.kChar} moved file to asset pack successfully\n\n`.bgCyan.black.italic);
                new BuildPacketsFromUploadsService_1.default();
                //res.sendStatus(200);
                next();
            }, req);
        }
        else {
            process.stdout.write(`\n`.reset + `${KitsuneHelper_1.default.kChar} < some request info: \n`.bgYellow.green);
        }
        next(err);
    });
});
app.route('/pack').post((req, res, next) => {
    console.log('pack', req);
    res.sendStatus(200);
    next();
});
//export {T as AssetVendorService.T, T};
function asyncAwait(p) {
    return p.then(value => value);
}

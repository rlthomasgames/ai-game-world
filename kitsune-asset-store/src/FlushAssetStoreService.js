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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
class FlushAssetStoreService {
    constructor() {
        const cleaned = new Promise(resolve => {
            const directory = "../packets";
            fs.readdir(directory, (err, files) => {
                if (err) {
                    console.log('ERROR: ??Cant find "packets" folder?? ' + err + '');
                    console.error(err);
                    callBack(false);
                    //throw err;
                }
                else {
                    console.log('FILES: ' + files + '');
                    if (files.length > 0) {
                        for (const file of files) {
                            fs.existsSync(Path.join(directory, file)) ? fs.rm(Path.join(directory, file), { recursive: true, force: true }, () => { callBack(); }) : null;
                        }
                    }
                    else {
                        callBack();
                    }
                }
            });
            const callBack = (overrideResult) => {
                return Promise.resolve(overrideResult ? overrideResult : true);
            };
        });
        return cleaned;
    }
}
exports.default = FlushAssetStoreService;

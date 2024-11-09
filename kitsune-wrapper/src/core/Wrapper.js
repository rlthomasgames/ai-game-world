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
exports.Wrapper = void 0;
const ioc_mapping_1 = __importDefault(require("./ioc/ioc_mapping"));
const CoreState_1 = __importDefault(require("./constants/CoreState"));
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const fflate_1 = require("fflate");
const Base64_1 = require("./encoding/Base64");
const stream_browserify_1 = require("stream-browserify");
process.title = 'kwrapper';
class Wrapper {
    constructor() {
        this.storedFileUploads = {};
        new KitsuneHelper_1.default();
        const startUpCommand = ioc_mapping_1.default.get(CoreState_1.default.INIT);
        startUpCommand.run();
        this.handleHTMLButtonEvents();
    }
    handleHTMLButtonEvents() {
        const kMenu = document.getElementById('kitsuneMenuContainer');
        const logo = document.getElementById('logo');
        const uploadButton = document.getElementById('uploadButton');
        const backClickDiv = document.getElementById('backCli');
        const fileInput = document.getElementById('fileInput');
        const buttonActions = {
            closemenu: () => {
                logo.removeEventListener('click', buttonActions.closemenu);
                logo.addEventListener('click', buttonActions.openMenu);
                kMenu.classList.remove('default');
                kMenu.classList.remove('active');
                backClickDiv.classList.remove('active');
                kMenu.classList.add('inactive');
                uploadButton.removeEventListener('click', buttonActions.submitAssets);
            },
            openMenu: () => {
                logo.removeEventListener('click', buttonActions.openMenu);
                logo.addEventListener('click', buttonActions.closemenu);
                kMenu.classList.remove('default');
                kMenu.classList.remove('inactive');
                kMenu.classList.add('active');
                backClickDiv.classList.add('active');
                uploadButton.addEventListener('click', buttonActions.submitAssets);
            },
            submitAssets: () => __awaiter(this, void 0, void 0, function* () {
                console.log('submitting');
                this.storedFileInput = fileInput;
                this.storedFileInput.files ? this.uploadAllFiles(this.storedFileInput.files) : console.log('no files selected');
            })
        };
        console.log('document loaded???', logo, kMenu);
        logo.addEventListener('click', buttonActions.openMenu);
    }
    onZipInputData(err, data, final) {
        console.log('ondata from whole zip', err, data, final);
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const objectPackage = { files: KitsuneHelper_1.default.kChar };
            let injectableString = JSON.stringify(objectPackage);
            // @ts-ignore
            injectableString = injectableString.replace(KitsuneHelper_1.default.kChar, file);
            const inoutStream = new stream_browserify_1.Transform({
                transform(chunk, encoding, callback) {
                    this.push(chunk);
                    callback();
                },
            });
            inoutStream.write(injectableString, undefined, () => {
                // @ts-ignore
                console.log(`${KitsuneHelper_1.default.kChar}`, ` ....writing chunk ${injectableString.length}`);
            });
            console.log(`sending ${file}`);
            return fetch(`http://localhost:8081/upload`, {
                method: "POST",
                body: inoutStream.read(),
                headers: {
                    'Content-Type': 'application/json'
                }, mode: "cors" /* ... */
            });
        });
    }
    fileNameFromPath(path) {
        let arr = path.split('/');
        return arr[arr.length - 1].split('.')[0];
    }
    uploadAllFiles(inputFiles) {
        //let zippedData: Uint8Array = new Uint8Array();
        const totalFiles = inputFiles.length;
        const all_files = new fflate_1.Zip();
        all_files.ondata = this.onZipInputData;
        const collectedZippedData = [];
        this.loadFilesAsArrayofBuffers(inputFiles, (buffers) => {
            const assetPackUID = crypto.randomUUID();
            console.log('sending with assetpack id ', assetPackUID);
            buffers.forEach((bufferAndPath, index) => {
                // 1 . create zip header info
                const zipInput = {
                    size: bufferAndPath.file.size,
                    crc: 0,
                    filename: this.fileNameFromPath(bufferAndPath.path),
                    compression: 0,
                    mtime: Date.now(),
                    ondata: (err, data, final) => {
                        return data ? data : null;
                    }
                };
                all_files.add(zipInput);
                const zipData = new Uint8Array(bufferAndPath.data);
                const fileStructure = { [bufferAndPath.path]: zipData };
                (0, fflate_1.zip)(fileStructure, {
                    comment: `Kitsune Wrapper Asset |${assetPackUID}| : ${bufferAndPath.path} `,
                    mtime: Date.now(),
                    mem: 12,
                    level: 0,
                    consume: true,
                }, (err, data) => {
                    if (err) {
                        console.log('error??', err);
                    }
                    if (data) {
                        //console.log('this is the zipped bytearray for file ', bufferAndPath.file.name, data);
                        collectedZippedData.push(data);
                        if (collectedZippedData.length === totalFiles) {
                            const currentStore = [];
                            collectedZippedData.forEach((zippedFile) => {
                                //console.log('now converting each zipped ')
                                const base64String = (0, Base64_1.bytesToBase64)(zippedFile);
                                currentStore.push(base64String);
                            });
                            if (currentStore.length === totalFiles) {
                                this.storeStrings(assetPackUID, currentStore);
                                this.uploadAllData(assetPackUID);
                                all_files.end();
                            }
                        }
                    }
                });
                if (index == buffers.length - 1) {
                    //console.log('ready to send zip', all_files);
                    //console.log('collected data might need concatting into one', collectedZippedData);
                }
            });
        });
    }
    uploadAllData(uid) {
        const allDatas = this.storedFileUploads[uid];
        const totalFiles = allDatas.length;
        let finalResp = 0;
        allDatas.forEach((data) => {
            const uploadResponse = KitsuneHelper_1.default.asyncAwait(this.uploadFile(data));
            uploadResponse.finally(() => {
                finalResp++;
                console.log('got finally?', uploadResponse);
                if (finalResp == totalFiles) {
                    // @ts-ignore
                    console.log(`\n\n\n${KitsuneHelper_1.default.kChar} < UPLOAD VERIFIED ${finalResp} / ${totalFiles}\n`);
                    this.storedFileInput.value = '';
                }
            });
        });
    }
    storeStrings(id, zippedStrings) {
        this.storedFileUploads[id] = zippedStrings;
    }
    loadFilesAsArrayofBuffers(files, cb) {
        const fileItems = [];
        const totalFiles = files.length;
        let index = 1;
        while (index <= totalFiles) {
            const item = files.item(index - 1);
            fileItems.push(item);
            console.log(item);
            index++;
        }
        const fileBuffers = [];
        while (fileItems[0] !== undefined) {
            const file = fileItems[0];
            const filePath = file.name;
            const fileReader = new FileReader();
            let fileByteArray;
            let fileBuffer;
            fileReader.onload = (e) => {
                // @ts-ignore
                console.log(`${KitsuneHelper_1.default.kChar} | Loading file ${filePath} - `, `${Math.floor(e.loaded * (100 / e.total))}%`);
                if (e.target)
                    fileBuffer = e.target.result;
                fileByteArray = new Uint8Array(e.target.result);
                const keys = Object.keys(e);
                const vals = [];
                keys.forEach((p) => {
                    vals.push((JSON.stringify(e).split(';').join('').split(':').join(',')));
                });
                //KitsuneHelper.getInstance().debugObject(e.target, vals.concat(Object.keys(e.target!)))
                file.arrayBuffer = KitsuneHelper_1.default.asyncAwait(Promise.resolve(fileBuffer));
                const blobbed = new Blob([fileByteArray], { type: 'binary' });
                file.stream = blobbed.stream;
                fileBuffers.push({ path: filePath, data: fileBuffer, file: file, index: fileBuffers.length - 1 });
                if (e.total == e.loaded) {
                    //maybe
                }
                if (fileBuffers.length == totalFiles) {
                    console.log('ready to make zip', fileBuffers);
                    cb(fileBuffers);
                }
            };
            fileReader.onerror = (e) => {
                console.log('file read error', e);
            };
            fileReader.readAsArrayBuffer(file);
            fileItems.splice(0, 1);
        }
    }
}
exports.Wrapper = Wrapper;

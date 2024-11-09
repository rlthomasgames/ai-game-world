import container from "./ioc/ioc_mapping";
import CoreState from "./constants/CoreState";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";
import {FlateError, Zip, ZipInputFile, zip, AsyncZippableFile, AsyncZippable} from "fflate";
import {bytesToBase64} from "./encoding/Base64";
import {IWriter, Transform} from "stream-browserify";
process.title = 'kwrapper';
type PathAndData = {path:string, data:ArrayBuffer, file:File, index:number};

export class Wrapper {
    storedFileInput : HTMLInputElement;
    storedFileUploads : {[x:string]: Array<string>|null} = {};
    constructor() {
        new KitsuneHelper();
        const startUpCommand = container.get<ICommand>(CoreState.INIT);
        startUpCommand.run();
        this.handleHTMLButtonEvents();
    }

    handleHTMLButtonEvents() {
        const kMenu = document.getElementById('kitsuneMenuContainer');
        const logo = document.getElementById('logo');
        const uploadButton = document.getElementById('uploadButton');

        const  backClickDiv = document.getElementById('backCli')
        const aiGen = document.getElementsByClassName('ai-prompt')[0] as HTMLDivElement;
        const aiImages = document.getElementsByClassName('images')[0] as HTMLDivElement;

        const promptInput = document.getElementById('prompt-input') as HTMLInputElement;

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const generateOpt = document.getElementById('generateOpt');

        const buttonActions = {
            closemenu: () => {
                logo!.removeEventListener('click', buttonActions.closemenu);
                logo!.addEventListener('click', buttonActions.openMenu);
                kMenu!.classList.remove('default');
                kMenu!.classList.remove('active');
                backClickDiv!.classList.remove('active');
                kMenu!.classList.add('inactive');
                uploadButton!.removeEventListener('click', buttonActions.submitAssets);
            },
            openMenu: () => {
                logo!.removeEventListener('click', buttonActions.openMenu);
                logo!.addEventListener('click', buttonActions.closemenu);
                kMenu!.classList.remove('default');
                kMenu!.classList.remove('inactive');
                kMenu!.classList.add('active');
                backClickDiv!.classList.add('active');
                uploadButton!.addEventListener('click', buttonActions.submitAssets);

                generateOpt!.addEventListener('click', buttonActions.openGenerate);

            },
            submitAssets: async () => {
                console.log('submitting')
                this.storedFileInput = fileInput;
                this.storedFileInput.files ? this.uploadAllFiles(this.storedFileInput.files) : console.log('no files selected');
            },
            closeGenerate: () => {
                buttonActions.closemenu();
                aiGen!.classList.remove('visible');
                aiGen!.classList.add('hidden');
                uploadButton!.removeEventListener('click', buttonActions.submitAssets);
            },
            openGenerate: () => {
                const generateButton = document.getElementById('generate') as HTMLButtonElement;
                console.log('ai gen ->', aiGen, aiImages, generateButton, promptInput);
                logo!.removeEventListener('click', buttonActions.closemenu);
                logo!.addEventListener('click', buttonActions.openMenu);
                generateButton!.addEventListener('click', buttonActions.generateFunc);
                kMenu!.classList.remove('default');
                kMenu!.classList.remove('active');
                backClickDiv!.classList.remove('active');
                kMenu!.classList.add('inactive');
                uploadButton!.removeEventListener('click', buttonActions.submitAssets);
                aiGen!.classList.remove('hidden');
                aiGen!.classList.add('visible');
            },
            generateFunc: () => {
                buttonActions.closeGenerate();
                console.log('init generate.?')
                console.log(promptInput.value)
            }
        }

        console.log('document loaded???', logo, kMenu);

        logo!.addEventListener('click', buttonActions.openMenu);

    }

    onZipInputData(err:FlateError, data:Uint8Array, final:boolean) {
        console.log('ondata from whole zip', err, data, final);
    }
    async uploadFile(file:string) {
        // @ts-ignore
        const objectPackage = {files: KitsuneHelper.kChar};
        let injectableString = JSON.stringify(objectPackage);
        // @ts-ignore
        injectableString = injectableString.replace(KitsuneHelper.kChar, file);
        const inoutStream: IWriter = new Transform({
            transform(chunk: any, encoding: any, callback: Function) {
                this.push(chunk);
                callback();
            },
        });
        inoutStream.write(injectableString, undefined, () => {
            // @ts-ignore
            console.log(`${KitsuneHelper.kChar}`, ` ....writing chunk ${injectableString.length}`)
        });
        console.log(`sending ${file}`);
        return fetch(`http://localhost:8081/upload`, {
            method:"POST",
            body:(inoutStream as unknown as any).read(),
            headers: {
                'Content-Type': 'application/json'
            }, mode:"cors" /* ... */ });
    }

    fileNameFromPath(path: string)  {
        let arr = path.split('/');
        return arr[arr.length - 1].split('.')[0] as string
    }

    uploadAllFiles(inputFiles:FileList) {
        //let zippedData: Uint8Array = new Uint8Array();
        const totalFiles = inputFiles.length;
        const all_files = new Zip();
        all_files.ondata = this.onZipInputData;
        const collectedZippedData:Array<Uint8Array> = [];
        this.loadFilesAsArrayofBuffers(inputFiles!, (buffers)=>{
            const assetPackUID = crypto.randomUUID();
            console.log('sending with assetpack id ', assetPackUID)
            buffers.forEach((bufferAndPath, index)=>{
                // 1 . create zip header info
                const zipInput: ZipInputFile = {
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
                const fileStructure: {[x:string] : string} | AsyncZippable = {[bufferAndPath.path as string]: zipData as AsyncZippableFile};
                zip(fileStructure, {
                    comment:`Kitsune Wrapper Asset |${assetPackUID}| : ${bufferAndPath.path} `,
                    mtime: Date.now(),
                    mem:12,
                    level:0,
                    consume:true,
                }, (err, data)=>{
                    if(err){
                        console.log('error??', err);
                    }
                    if(data){
                        //console.log('this is the zipped bytearray for file ', bufferAndPath.file.name, data);
                        collectedZippedData.push(data);
                        if(collectedZippedData.length === totalFiles){
                            const currentStore:Array<string> = [];
                            collectedZippedData.forEach((zippedFile)=>{
                                //console.log('now converting each zipped ')
                                const base64String = bytesToBase64(zippedFile);
                                currentStore.push(base64String);
                            })
                            if(currentStore.length === totalFiles) {
                                this.storeStrings(assetPackUID, currentStore);
                                this.uploadAllData(assetPackUID);
                                all_files.end();
                            }
                        }
                    }
                })
                if(index == buffers.length-1){

                    //console.log('ready to send zip', all_files);
                    //console.log('collected data might need concatting into one', collectedZippedData);
                }
            })
        });
    }

    uploadAllData(uid:string){
        const allDatas = this.storedFileUploads[uid]!;
        const totalFiles = allDatas.length;
        let finalResp = 0;
        allDatas.forEach((data)=> {
            const uploadResponse = <Awaited<Response>>KitsuneHelper.asyncAwait(this.uploadFile(data)) as unknown as Promise<Response>;
            uploadResponse.finally(()=>{
                finalResp++;
                console.log('got finally?', uploadResponse);
                if(finalResp == totalFiles) {
                    // @ts-ignore
                    console.log(`\n\n\n${KitsuneHelper.kChar} < UPLOAD VERIFIED ${finalResp} / ${totalFiles}\n`);
                    this.storedFileInput.value = '';
                }
            })
        })
    }

    storeStrings(id:string, zippedStrings:Array<string>|null){
        this.storedFileUploads[id] = zippedStrings;
    }

    loadFilesAsArrayofBuffers(files:FileList, cb:(buffers:Array<PathAndData>)=>void){
        const fileItems:Array<File> = [];
        const totalFiles = files.length;
        let index = 1;
        while(index <= totalFiles)
        {
            const item = files.item(index-1)!;
            fileItems.push(item as File);
            console.log(item)
            index++;
        }
        const fileBuffers:Array<PathAndData> = [];
        while (fileItems[0] !== undefined) {
            const file: File = fileItems[0] ;
            const filePath = file.name;
            const fileReader = new FileReader();
            let fileByteArray: Uint8Array;
            let fileBuffer: ArrayBuffer;
            fileReader.onload = (e:ProgressEvent<FileReader>) => {
                // @ts-ignore
                console.log(`${KitsuneHelper.kChar} | Loading file ${filePath} - `, `${Math.floor(e.loaded*(100/e.total))}%`);
                if(e.target)
                    fileBuffer = (e.target! as unknown as any).result as ArrayBuffer;
                fileByteArray = new Uint8Array((e.target! as unknown as any).result as ArrayBuffer);
                const keys = Object.keys(e)
                const vals:Array<string> = [];
                keys.forEach((p)=>{
                    vals.push((JSON.stringify(e).split(';').join('').split(':').join(',')))
                })
                //KitsuneHelper.getInstance().debugObject(e.target, vals.concat(Object.keys(e.target!)))
                file.arrayBuffer = KitsuneHelper.asyncAwait(Promise.resolve(fileBuffer));
                const blobbed = new Blob([fileByteArray], {type:'binary'})
                file.stream=blobbed.stream;
                fileBuffers.push({path:filePath, data:fileBuffer, file:file, index:fileBuffers.length-1} as PathAndData);

                if(e.total == e.loaded){
                    //maybe
                }

                if((fileBuffers as Array<PathAndData>).length == totalFiles){
                    console.log('ready to make zip', fileBuffers)
                    cb(fileBuffers);
                }
            };
            fileReader.onerror = (e) => {
                console.log('file read error', e)
            };
            fileReader.readAsArrayBuffer(file);
            fileItems.splice(0, 1);
        }
    }
}

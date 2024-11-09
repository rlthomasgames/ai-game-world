import * as fs from "fs";
import * as Path from "path";
import {Zip, strToU8} from "fflate";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";
import {exec} from "node:child_process";
import colors from "colors";
export type DebugInfoObject0 = {
    parts:number,
    remainders:number,
    concreteParts:number,
    fileSize:number
}
colors.disable();
setTimeout(()=>{
    colors.enable()
}, 3500);

export default class BuildPacketsFromUploadsService {
    constructor() {
        console.log('constructed builder')
        //console.log('check path', Path.dirname('../../'));
        //delete all asset packs generated from uploads, dont delete original uploads!

        const directory = "./../uploaded";

        fs.readdir(directory, (err, uploadedFolders) => {
            if (err) {
                console.log('ERRORS: ' + err + ''.red.bold);
                console.error(err);
                //throw err;
            } else {
                if (uploadedFolders.length == 0) {
                    console.log('nothing to build');
                }
                uploadedFolders.forEach(assePackUUID => {
                    const assetPackPath = Path.join(directory, assePackUUID);
                    fs.readdir(assetPackPath, (errP, uploadedFiles) => {
                        uploadedFiles.forEach((uploadedFile, findex, array)=>{
                            const filePath = `${Path.join(assetPackPath, uploadedFile)}`;
                            console.log('building...', filePath)
                            fs.stat(filePath, (err, stats) => {
                                if (err) {
                                    // @ts-ignore
                                    process.stdout.write(`${KitsuneHelper.kChar} > error on stat ${err}` + err.stack + `${filePath}`);

                                } else {
                                    // @ts-ignore
                                    process.stdout.write(`${KitsuneHelper.kChar} ${filePath} got stats :\n ${stats} = ${JSON.stringify(stats)} \n` + stats.size + '' + stats.isFile())

                                    const fileSize = stats.size;
                                    this.loadFilesAndSplit(filePath, assePackUUID, fileSize, directory, findex);
                                    // move on with file load and split...
                                }
                            });
                        })
                    })
                })
            }
        });
    }

    loadFilesAndSplit(filePath:string, assetPackUUID:string, fileSize:number, directory:string, fileNum:number) {
        const ALREADY_COMPRESSED = [
            'zip', 'gz', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx',
            'ppt', 'pptx', 'xls', 'xlsx', 'heic', 'heif', '7z', 'bz2',
            'rar', 'gif', 'webp', 'webm', 'mp4', 'mov', 'mp3', 'aifc'
            // Add whatever extensions you don't want to compress
        ];
        const zip = new Zip();
        let packetNum = 0;
        const file = filePath;
        // If file is a File object, use this:
        const ext = file.slice(file.lastIndexOf('.') + 1);
        //const defl = new ZipPassThrough(filePath);
        //zip.add(defl);


        const ind = 262144*4; //8x8x8x8x8x8x4
        const splitFileName = file.split('/');
        const filename = splitFileName[splitFileName.length-1];
        console.log('splitting file', filename, 'at path containing ', fs.readdirSync('./'));
        !fs.existsSync(`../packets/${assetPackUUID}/`) ? fs.mkdirSync(`../packets/${assetPackUUID}/`) : null;
        exec(`split -b ${ind} ../uploaded/${assetPackUUID}/${filename} --additional-suffix=.part --suffix-length=3 -d "../packets/${assetPackUUID}/p`+fileNum+`|"`);

        /*
        const stringFile = fs.readFileSync(filePath, {encoding: 'binary'}).split('')
        const asUint8 = strToU8(stringFile.join());
        //const asUint8Arr = new Uint8Array(asyncAwait(new Blob([strToU8(stringFile)]).arrayBuffer()) as ArrayBuffer)
        const arrOfUintArr: any[] = [];
        //const parts = !(Number.isNaN(Math.floor(fileSize / ind))) ? (Math.ceil(stringFile.length / ind)) : 1;
        const parts = (fileSize / ind);
        const remainders = Math.floor((fileSize / ind) % 1);
        const concreteParts = Math.ceil(parts);
        const obj: DebugInfoObject0 = ({parts, remainders, concreteParts, fileSize});
        let objStr = '';
        Object.keys(obj).forEach((value, index, array) => {
            objStr = objStr + `\n\n` + JSON.stringify(obj) + `\n ` + value + ` : ` + (obj as unknown as any)[value as string] + `  ${index}  ,  ${array}}}  \n`.america;
            objStr = objStr + ` \n ${Object.values(obj)} |`;
        });
        console.log(
            'splitting action data',
            objStr,
            arrOfUintArr.length,
            ind,
            fileNum,
            packetNum,
            parts);

        const frozenInTime = (object: Object) => {
            return JSON.stringify(
                object
            )
        }
        console.log(
            `frozen in time`,
            frozenInTime(parts),
            frozenInTime(fileSize),
            frozenInTime(asUint8.length / parts),
            frozenInTime(asUint8.length),
            frozenInTime(ind)
        )
        const portion = Math.floor(asUint8.length/parts);
        for(var i = 0; i < concreteParts; i++){
            const sizeLeft = asUint8.length-(i*portion);
            if(i == concreteParts) {
                arrOfUintArr.push(asUint8.slice(i*portion, asUint8.length-1));
            } else {
                if (sizeLeft > portion) {
                    arrOfUintArr.push(asUint8.slice(i * portion, (i * portion) + portion));
                } else {
                    arrOfUintArr.push(asUint8.slice(i * portion, asUint8.length - 1));
                }
            }
        }


        console.log(`concrete ${concreteParts} / ${arrOfUintArr.length}`)
        if (arrOfUintArr.length === concreteParts) {
            console.log('suggested parts total = ', concreteParts)
            arrOfUintArr.forEach(
                (value,
                 index,
                 array
                ) => {
                    console.log('storing... ', value.length, '\n', value);
                    this.storePacketsFromUint8(Buffer.from(strToU8(value.join(''))), assetPackUUID, fileNum, index,
                        () => {
                            console.log(`stored uploaded_asset_folder ${assetPackUUID}${fileNum} ${index}`)
                        })
                })
            //fr.readAsArrayBuffer(new Blob([fs.readFileSync(filePath) as BlobPart]));
        }

         */
            /*
            while(arrOfUintArr.length < ind){
                this.storePacketsFromUint8(asUint8Arr.slice(0, ind), uploaded_asset_folder, fileNum, packetNum, ()=>{
                })
            }

             */
        //fileNum++;
    }


    storePacketsFromUint8(files:Buffer, assetPackUUID:string, fileNum:number, packetNum:number, cb:()=>void) {
            const directory = "../packets/";
            const assetPakDirectory = `../packets/${assetPackUUID}/`;
            if (!fs.existsSync(assetPakDirectory)) {
                fs.mkdirSync(assetPakDirectory, {recursive: true});
            }



            const fullPath = `${directory}${assetPackUUID}/${fileNum}|${packetNum}.part`;
            fs.writeFileSync(fullPath, files)
        process.stdout.write('path   '+`${fullPath}`)
            const bufferLength = fs.readFileSync(fullPath).length;
                if(bufferLength > 0){
                    // @ts-ignore
                    process.stdout.write(`${KitsuneHelper.kChar} : ERROR buffle length 0 `);
                }
                else {
                    // @ts-ignore
                    process.stdout.write(`${KitsuneHelper.kChar} : FILES < `+bufferLength);
                }
            const filename = `${fullPath}`.split(' ');
        // @ts-ignore
            process.stdout.write(`${KitsuneHelper.kChar} Almost Finished ... \n `+ fullPath+`\n${KitsuneHelper.kChar}\n${KitsuneHelper.kChar}`)
            /*
            const fullPath = `${directory}/${filename}.zip`;
            fs.renameSync(tempName, fullPath);

             */
            const successOut = (finial:()=>void) => {
                process.stdout.write(`~ ~ ~ ~ asset pack \n` +
                    assetPackUUID.zebra + '\n' +
                    `|......includes....<- ` +
                    `${fullPath}\n`
                )
                finial();
            }
            const failOut = () => {
                console.log('something went horribly wrong...\n', `${fullPath}\n${assetPackUUID}\n${fileNum}\n${packetNum}\n${directory}\n${filename}\n${assetPackUUID}\n`)
            }
            fs.stat(fullPath, (err, stats)=>{
                const success = stats ? stats.isFile() : false;
                success ? (successOut(cb) ) : failOut();
            })
            return filename+`.zip`;
    }
}
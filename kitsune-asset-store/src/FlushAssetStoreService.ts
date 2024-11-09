import colors = require('colors');
import * as fs from "fs";
import * as Path from "path";
export default class FlushAssetStoreService {
    constructor() {
        const cleaned = new Promise<boolean>(resolve => {

            const directory = "../packets";

            fs.readdir(directory, (err, files) => {
                if (err) {
                    console.log('ERROR: ??Cant find "packets" folder?? '+err+'');
                    console.error(err);
                    callBack(false);
                    //throw err;
                } else {
                    console.log('FILES: ' + files + '');
                    if(files.length > 0) {
                        for (const file of files) {
                            fs.existsSync(Path.join(directory, file)) ? fs.rm(Path.join(directory, file), {recursive:true, force:true}, ()=>{callBack()}) : null;
                        }
                    } else {
                        callBack();
                    }
                }
            });

            const callBack = (overrideResult?:boolean):Promise<boolean> => {
                return Promise.resolve(overrideResult ? overrideResult : true);
            }
        })
        return cleaned;
    }
}
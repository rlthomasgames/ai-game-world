import { FlateError } from "fflate";
type PathAndData = {
    path: string;
    data: ArrayBuffer;
    file: File;
    index: number;
};
export declare class Wrapper {
    storedFileInput: HTMLInputElement;
    storedFileUploads: {
        [x: string]: Array<string> | null;
    };
    constructor();
    handleHTMLButtonEvents(): void;
    onZipInputData(err: FlateError, data: Uint8Array, final: boolean): void;
    uploadFile(file: string): Promise<Response>;
    fileNameFromPath(path: string): string;
    uploadAllFiles(inputFiles: FileList): void;
    uploadAllData(uid: string): void;
    storeStrings(id: string, zippedStrings: Array<string> | null): void;
    loadFilesAsArrayofBuffers(files: FileList, cb: (buffers: Array<PathAndData>) => void): void;
}
export {};

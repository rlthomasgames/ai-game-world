declare class AssetPackSplitter {
    private assetsLocationPrefix;
    private assetsSuffix;
    private assetsPacketsPrefix;
    private splitPartSize;
    private promiseOfManifest;
    constructor(urlGZIP: string);
    splitWithManifest(url: string): Promise<IAssetPacksManifest>;
    splitAssets(url: string): Promise<IAssetPacksManifest>;
    numParts(size: number): number;
    getFileSize(url: string): Promise<number>;
    getManifest(): Promise<IAssetPacksManifest>;
}
export { AssetPackSplitter as default, AssetPackSplitter };
export interface IAssetPacksManifest {
    uniqueID: string;
    pathsToParts: string[];
}

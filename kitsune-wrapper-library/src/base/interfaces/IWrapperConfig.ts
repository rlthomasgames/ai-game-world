import IWrapperLayout from "./IWrapperLayout";

interface IWrapperConfig {
    assetPacks: string;
    version?: number;
    language?: string;
    modules?:Array<ExtensionValuedObject>;
    application?: ExtensionValuedObject;
    securityToken?: string;
    gameConfig?: string;
    platformAddress?: string;
    layout?: IWrapperLayout;
}

export {IWrapperConfig as default, IWrapperConfig};


export type ExtensionValuedObject = {
    moduleName: string;
    modulePath: string;
    gzipped?: boolean | undefined;
}

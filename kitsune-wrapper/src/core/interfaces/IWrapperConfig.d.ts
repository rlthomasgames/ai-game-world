import IWrapperLayout from "./IWrapperLayout";
export default interface IWrapperConfig {
    assetPacks: string;
    version?: number;
    language?: string;
    modules?: Array<ExtensionValuedObject>;
    application?: ExtensionValuedObject;
    securityToken?: string;
    restAPI?: string;
    wsHost?: string;
    assetStore?: string;
    layout?: IWrapperLayout;
}
export type ExtensionValuedObject = {
    moduleName: string;
    modulePath: string;
    gzipped?: boolean | undefined;
};

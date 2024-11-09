import IInjectableExtensionModule from "../IInjectableExtensionModule";
import IWrapperConfig from "../IWrapperConfig";
export default interface ISockComm extends IInjectableExtensionModule{
    _wrapperConfig:any;
    _assetData:any;

    clientMap: Map<string, any | string | boolean | number>;

    socket: any;

    id: string;
    totals: Array<number>;

    run(_wrapperConfig:IWrapperConfig): ISockComm;
}
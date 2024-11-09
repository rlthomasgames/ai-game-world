import IInjectableExtensionModule from "./IInjectableExtensionModule";

export default interface IApplicationModule extends IInjectableExtensionModule{
    name: string;
    startModule: () => void;
}
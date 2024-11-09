import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import BaseApplication from "kitsune-wrapper-library/dist/base/application/BaseApplication";
export declare class StartApplication implements ICommand {
    _application?: BaseApplication;
    postConstruct(): void;
    run(): void;
}

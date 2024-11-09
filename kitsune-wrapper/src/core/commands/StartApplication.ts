import {inject, injectable, optional, postConstruct} from "inversify";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import BaseApplication from "kitsune-wrapper-library/dist/base/application/BaseApplication";
import CoreState from "../constants/CoreState";
import {Flow} from "./flow/Flow";

@injectable()
export class StartApplication implements ICommand {
    @optional()
    @inject('application')
    _application?: BaseApplication;

    @postConstruct()
    postConstruct() {
        this.run();
    }

    run(): void {
        console.log(`||||||||||| START APPLICATION CMD |||||||||||`);
        Flow.HISTORY.push(CoreState.START_APPLICATION);
        if (this._application) {
            this._application?.startModule();
        } else {
            console.warn(`StartApplication command ran but no application instance found : ${this._application}`);
        }
    }
}
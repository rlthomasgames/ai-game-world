import {injectable} from "inversify";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import CoreState from "../constants/CoreState";
import {Flow} from "./flow/Flow";
import container from "../ioc/ioc_mapping";


@injectable()
export class ClientAuthorized implements ICommand {
    run(): void {
        //notify
        console.log(`||||||||||| CONNECTION AUTH TOKEN |||||||||||`);
        Flow.HISTORY.push(CoreState.CLIENT_AUTH);
        console.log(`established, history so far : `, Flow.HISTORY);
        const loadAssets = container.get<ICommand>(CoreState.LOAD_ASSET_DATA);
        loadAssets.run();
    }

}
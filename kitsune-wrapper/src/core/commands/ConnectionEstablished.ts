import {injectable} from "inversify";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import CoreState from "../constants/CoreState";
import {Flow} from "./flow/Flow";


@injectable()
export class ConnectionEstablished implements ICommand {
    run(): void {
        //notify
        console.log(`||||||||||| CONNECTION ESTABLISHED |||||||||||`);
        Flow.HISTORY.push(CoreState.CONNECTION_ESTABLISHED);
        console.log(`established, history so far : `, Flow.HISTORY);
        
    }

}
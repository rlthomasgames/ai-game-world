import ICommand from "../interfaces/ICommand";

export class AbstractCommand implements ICommand {
    run() {
        console.log('this is abstract implementation of ICommand, please make sure to override');
    };
}

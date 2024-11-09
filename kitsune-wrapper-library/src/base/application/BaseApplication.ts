import {AbstractModule} from "../abstract/AbstractModule";

export default class BaseApplication extends AbstractModule {
    name = 'application';
    startModule() {
        //overridden
        console.log('base application module started');
    }
}
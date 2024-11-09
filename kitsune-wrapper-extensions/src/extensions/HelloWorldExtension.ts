import {injectable} from "inversify";
import {AbstractModule} from "kitsune-wrapper-library";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import {sayHello} from "hwrld";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";

@injectable()
class HelloWorldExtension extends AbstractModule implements IInjectableExtensionModule {
    name: string = 'HelloWorldExtension';

    startModule() {
        sayHello();
    }
}

export {HelloWorldExtension as default, HelloWorldExtension};

KitsuneHelper.getKitsuneFactories().set('HelloWorldExtension', HelloWorldExtension);

// @ts-ignore
/*
let kitsuneExtensionFactories = window['kitsuneExtensionFactories'];
if(kitsuneExtensionFactories == undefined) {
    kitsuneExtensionFactories = new Map();
    // @ts-ignore
    window['kitsuneExtensionFactories'] = kitsuneExtensionFactories;
}
kitsuneExtensionFactories.set('HelloWorldExtension', HelloWorldExtension);
*/
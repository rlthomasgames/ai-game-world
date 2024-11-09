import {injectable} from "inversify";
import {AbstractModule} from "kitsune-wrapper-library";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import {Application} from "pixi.js";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";

@injectable()
class PixiFrameworkExtension extends AbstractModule implements IInjectableExtensionModule {
    name: string = 'PixiFrameworkExtension';
    container: Application;

    startModule() {
        const pixiApplication = new Application();
        this.container = pixiApplication;
    }
}

export {PixiFrameworkExtension as default, PixiFrameworkExtension};

KitsuneHelper.getKitsuneFactories().set('PixiFrameworkExtension', PixiFrameworkExtension);


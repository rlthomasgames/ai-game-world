import {injectable} from "inversify";
import {AbstractModule} from "kitsune-wrapper-library";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import {WebGLRenderer} from "three";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";

@injectable()
class ThreeFrameworkExtension extends AbstractModule implements IInjectableExtensionModule {
    name: string = 'ThreeFrameworkExtension';
    container: {canvas:HTMLCanvasElement, renderer:WebGLRenderer };

    startModule() {
        const canvas = document.createElement('canvas');
        const webGLRenderer = new WebGLRenderer({canvas:canvas});
        this.container = {canvas:canvas, renderer:webGLRenderer};
        document.getElementById('content')!.appendChild((this.container! as ThreeContainer).canvas);
    }
}

export declare type ThreeContainer = {
    canvas:HTMLCanvasElement,
    renderer:WebGLRenderer,
}

export {ThreeFrameworkExtension as default, ThreeFrameworkExtension};

KitsuneHelper.getKitsuneFactories().set('ThreeFrameworkExtension', ThreeFrameworkExtension);


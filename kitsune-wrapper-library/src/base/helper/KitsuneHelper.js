"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KitsuneHelper {
    constructor() {
        const windowImp = window;
        if (typeof window !== "undefined" && !windowImp[`kitsuneExtensionFactories`]) {
            this.createSingleton();
        }
    }
    createSingleton() {
        const windowImp = window;
        windowImp[`kitsuneExtensionFactories`] = new Map();
    }
    static getInstance() {
        var _a;
        return (_a = KitsuneHelper.singletonInstance) !== null && _a !== void 0 ? _a : new KitsuneHelper();
    }
    static getKitsuneFactories() {
        if (window[`kitsuneExtensionFactories`] === undefined) {
            new KitsuneHelper();
        }
        return window[`kitsuneExtensionFactories`];
    }
    static asyncAwait(p) {
        return KitsuneHelper.getInstance().asyncAwait(p);
    }
    asyncAwait(p) {
        return p.then((val) => val);
    }
}
KitsuneHelper.DEFAULT_PORTS = {
    WS_PORT: 8080,
    ASSET_STORE: 8081
};
KitsuneHelper.kChar = '🦊';
exports.default = KitsuneHelper;

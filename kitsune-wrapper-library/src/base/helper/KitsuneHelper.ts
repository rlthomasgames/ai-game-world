interface Awaiter {
    asyncAwait: <T>(prom:Promise<T>) => T;
}

export default class KitsuneHelper implements Awaiter {

    private static singletonInstance: KitsuneHelper;

    constructor() {
        const windowImp = ((window as unknown) as any)
        if (typeof window !== "undefined" && !windowImp[`kitsuneExtensionFactories`]) {
            this.createSingleton();
        }
    }

    private createSingleton(): void {
        const windowImp = ((window as unknown) as any)
        windowImp[`kitsuneExtensionFactories`] = new Map();
    }

    static getInstance(): KitsuneHelper {
        return KitsuneHelper.singletonInstance ?? new KitsuneHelper();
    }

    static getKitsuneFactories() {
        if (window[`kitsuneExtensionFactories`] === undefined) {
            new KitsuneHelper();
        }
        return window[`kitsuneExtensionFactories`];
    }

    public static asyncAwait(p: Promise<any>) {
        return KitsuneHelper.getInstance().asyncAwait(p)
    }

    asyncAwait(p: Promise<any>) {
        return <Awaited<any>>p.then((val) => val);
    }

    private static readonly DEFAULT_PORTS = {
        WS_PORT: 8080,
        ASSET_STORE: 8081
    }

    public static kChar = '🦊';

}
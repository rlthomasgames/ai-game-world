import { injectable } from 'inversify';
import * as _ from "lodash";
import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import {IWrapperConfig} from "kitsune-wrapper-library";

@injectable()
export class FetchApplicationConfig implements IAsyncRequest {
    private baseConfig: IWrapperConfig;
    private urlParams: IWrapperConfig;
    private finalConfig: IWrapperConfig;
    internalPromise: Promise<void>;

    name : 'FetchConfig';

    public request(): Promise<void> {
        const params = {};
        this.getUrlParams().forEach((value, key, parent) => {
            Object.defineProperty(params, key, {value: value});
        });
        this.urlParams = params as unknown as IWrapperConfig;
        this.baseConfig = Object.assign({}, baseConfig);

        this.internalPromise = fetch('./config/wrapper.json')
            .then(
                response => {
                    return response.json();
                },
                reason => {}
            )
            .then(data => {
                this.configLoaded(data);
            })
        return this.internalPromise;
    }

    configLoaded(fetchedConfig:IWrapperConfig) {
        const merge0 = _.merge(this.urlParams, this.baseConfig);
        this.finalConfig = Object.assign({}, fetchedConfig, merge0);
        this.finalConfig = _.merge(this.finalConfig, fetchedConfig);
    }

    getConfig = () => this.finalConfig;

    private getUrlParams = () =>  new URLSearchParams(window.location.search);
}

const baseConfig: IWrapperConfig = {
    assetPacks: "",
    version: 0,
    securityToken: "none",
    language: "en-UK",
    gameConfig: "localhost:9090/config/lobby.json",
    platformAddress: "localhost:7070/socket",
    layout: {
        name: "layout0"
    }
};

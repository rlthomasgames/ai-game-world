export default class GlobalValues
{
    private static _gmModeGLOBAL: boolean = true;
    constructor(){

    }
    public static set gmModeGLOBAL(value: boolean) {
        // console.log('gmMode = ', this._gmModeGLOBAL, this._gui);
        this._gmModeGLOBAL = value;
    }
    public static get gmModeGLOBAL(): boolean {
        return this._gmModeGLOBAL;
    }
}
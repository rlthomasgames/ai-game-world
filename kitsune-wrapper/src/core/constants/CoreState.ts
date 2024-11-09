const CoreState = {
    INIT: Symbol.for("Init"),
    INIT_COMPLETE: Symbol.for("InitComplete"), //not a command but more a reaction or resolution
    START_APPLICATION: Symbol.for("StartApplication"),
    CONNECT_TO_SERVER: Symbol.for("ConnectToServer"),
    CLIENT_AUTH: Symbol.for("ClientAuthorized"),
    CONNECTION_ESTABLISHED: Symbol.for("ConnectionEstablished"), //not a command but more a reaction or resolution
    LOAD_ASSET_DATA: Symbol.for("LoadAssetPakData"),
}
export default CoreState;

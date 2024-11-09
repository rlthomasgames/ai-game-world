export default class KVerboseLog {
    public static VERBOSE_LOG = true;
    public static log = (value: any) => {
        if (this.VERBOSE_LOG) {
            return value;
        }
        return "";
    }
}

KVerboseLog.VERBOSE_LOG = true;
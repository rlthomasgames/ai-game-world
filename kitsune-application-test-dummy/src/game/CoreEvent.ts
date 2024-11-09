
type types = number | {};

export class CoreEvent extends Event {

    public static REQUEST_CLASS:string = 'CoreEvent:REQUEST_CLASS';
    public data:types;

    constructor(type: string, data:types, eventInitDict?: EventInit){
        super(type, eventInitDict);
        this.data = data;
    }
}
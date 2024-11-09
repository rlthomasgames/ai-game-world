export default interface IInjectParser {
    name: string;
    startModule: () => void;
    parse: <T>(url:string) => T;
}
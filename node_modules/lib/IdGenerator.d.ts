export default class IdGenerator {
    private _max;
    private _ids;
    constructor();
    gen(): number;
    free(id: number): void;
    clear(): void;
}

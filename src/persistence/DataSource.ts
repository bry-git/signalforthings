export abstract class DataSource {
    protected constructor() {}
    abstract init():any
    abstract saveOne(any: any):Promise<any>
}
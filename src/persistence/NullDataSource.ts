import {DataSource} from "./DataSource";

export class NullDataSource implements DataSource{
    constructor() {
    }

    init(): any {
    }

    saveOne(any: any): Promise<any> {
        return Promise.resolve(undefined);
    }
}
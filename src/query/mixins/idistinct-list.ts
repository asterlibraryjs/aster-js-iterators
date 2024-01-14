export interface IDistinctList {
    has(item: any): boolean;
    tryAdd(item: any): boolean;
}

export namespace DistinctList {

    export function create(comparer?: (left: any, right: any) => boolean): IDistinctList {
        if (comparer) {
            return new DistinctArray([], comparer);
        }
        return new DistinctSet([]);
    }

    export function fromValues(values: Iterable<any>, comparer?: (left: any, right: any) => boolean): IDistinctList {
        if (comparer) {
            return new DistinctArray(values, comparer);
        }
        return new DistinctSet(values);
    }
}

class DistinctSet {
    private readonly _values: Set<any>;

    constructor(values: Iterable<any>) {
        this._values = new Set(values);
    }

    has(item: any): boolean {
        return this._values.has(item);
    }

    tryAdd(item: any): boolean {
        if (this.has(item)) return false;
        this._values.add(item);
        return true;
    }
}

class DistinctArray {
    private readonly _values: Array<any>;

    constructor(
        values: Iterable<any>,
        private readonly _comparer: (left: any, right: any) => boolean
    ) {
        this._values = [...values];
    }

    has(item: any): boolean {
        return !this._values.every(x => !this._comparer(x, item));
    }

    tryAdd(item: any): boolean {
        if (this.has(item)) return false;
        this._values.push(item);
        return true;
    }
}

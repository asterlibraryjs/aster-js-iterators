import { QueryBase } from "./query-base";

export class ArrayQuery<T> extends QueryBase<T> {

    constructor(
        readonly src: readonly T[]
    ) { super(); }

    toArray(): T[]{
        return this.src.slice(0);
    }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* this.src;
    }
}

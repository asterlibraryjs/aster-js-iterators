import { QueryBase } from "./query-base";

export class ArrayQuery<T> extends QueryBase<T> {

    constructor(
        readonly src: readonly T[]
    ) { super(); }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* this.src;
    }
}

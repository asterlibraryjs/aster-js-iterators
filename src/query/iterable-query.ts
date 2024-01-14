import { AsyncQueryBase } from "./async-query-base";
import { QueryBase } from "./query-base";

export class IterableQuery<T> extends QueryBase<T> {
    constructor(
        readonly src: Iterable<T>
        ) { super(); }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* this.src;
    }
}

export class AsyncIterableQuery<T> extends AsyncQueryBase<T> {
    constructor(
        readonly src: AsyncIterable<T>
    ) { super(); }

    async *[Symbol.asyncIterator](): AsyncIterator<T, any, undefined> {
        yield* this.src;
    }
}

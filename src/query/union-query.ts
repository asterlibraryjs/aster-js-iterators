import { AsyncQueryBase } from "./async-query-base";
import { QueryBase } from "./query-base";

export class UnionQuery<T> extends QueryBase<T> {
    constructor(
        readonly src: Iterable<T>,
        readonly iterables: Iterable<T>[]
    ) { super(); }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* this.src;
        for (const item of this.iterables) {
            yield* item;
        }
    }
}

export class AsyncUnionQuery<T> extends AsyncQueryBase<T> {
    constructor(
        readonly src: AsyncIterable<T>,
        readonly iterables: AsyncIterable<T>[]
    ) { super(); }

    async *[Symbol.asyncIterator](): AsyncIterator<T, any, undefined> {
        yield* this.src;
        for (const item of this.iterables) {
            yield* item;
        }
    }
}

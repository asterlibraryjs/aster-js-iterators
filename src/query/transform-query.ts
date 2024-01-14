import { AsyncQueryBase } from "./async-query-base";
import { AsyncTransformDelegate, TransformDelegate } from "./iquery";
import { QueryBase } from "./query-base";

export class TransformQuery<TSource = any, TResult = TSource> extends QueryBase<TResult> {
    constructor(
        private readonly _iterable: Iterable<TSource>,
        private readonly _predicate: TransformDelegate<TSource, TResult>
    ) {super(); }

    *[Symbol.iterator](): IterableIterator<TResult> {
        yield* this._predicate(this._iterable);
    }
}

export class AsyncTransformQuery<TSource = any, TResult = TSource> extends AsyncQueryBase<TResult> {
    constructor(
        private readonly _iterable: AsyncIterable<TSource>,
        private readonly _predicate: AsyncTransformDelegate<TSource, TResult>
    ) { super(); }

    async *[Symbol.asyncIterator](): AsyncIterator<TResult> {
        for await (const item of this._predicate(this._iterable)) {
            yield item;
        }
    }
}

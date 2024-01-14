import { ArrayQuery } from "./array-query";
import { IAsyncQuery, AsyncTransformDelegate, ISortedAsyncQuery } from "./iquery";
import { IAsyncIterableMixins, QueryMixins } from "./mixins";

export interface AsyncQueryBase<T> extends IAsyncIterableMixins<T> { }

@QueryMixins(...IAsyncIterableMixins)
export abstract class AsyncQueryBase<T = any> implements IAsyncQuery<T> {

    transformAsync<R>(predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R> { throw new Error(); }

    sort(sortFn: (left: any, right: any) => number): ISortedAsyncQuery<T> { throw new Error(); }

    fetch(): Promise<ArrayQuery<T>> { throw new Error(); }

    async toArray(): Promise<T[]> {
        const values: T[] = [];
        for await (const item of this) {
            values.push(item);
        }
        return values;
    }

    abstract [Symbol.asyncIterator](): AsyncIterator<T>;
}

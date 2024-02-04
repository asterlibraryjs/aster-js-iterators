import { ArrayQuery } from "./array-query";
import { AsyncQueryBase } from "./async-query-base";
import { AsyncTransformDelegate, IAsyncQuery, ISortedAsyncQuery } from "./iquery";
import { AsyncSortQuery } from "./sorted-query";
import { AsyncTransformQuery } from "./transform-query";

function transformAsync<T, R>(this: AsyncQueryBase<T>, predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R> {
    return new AsyncTransformQuery(this, predicate);
}

async function fetch<T>(this: AsyncQueryBase<T>): Promise<ArrayQuery<T>> {
    const result = await this.toArray();
    return new ArrayQuery(result);
}

function sort<T>(this: AsyncQueryBase<T>, sortFn: (left: any, right: any) => number): ISortedAsyncQuery<T> {
    return new AsyncSortQuery(this, sortFn);
}

Object.assign(AsyncQueryBase.prototype, { sort, fetch, transformAsync });

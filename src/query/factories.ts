import { ISortedQuery, TransformDelegate, IQuery, AsyncTransformDelegate, IAsyncQuery } from "./iquery";
import { QueryBase } from "./query-base";
import { SortedQuery } from "./sorted-query";
import { AsyncTransformQuery, TransformQuery } from "./transform-query";

function sort<T>(this: QueryBase<T>, sortFn: (left: any, right: any) => number): ISortedQuery<T> {
    return new SortedQuery(this, sortFn);
}

function transform<T, R>(this: QueryBase<T>, predicate: TransformDelegate<T, R>): IQuery<R> {
    return new TransformQuery<T, R>(this, predicate);
}

function transformAsync<T, R>(this: QueryBase<T>, predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R> {
    return new AsyncTransformQuery(this, predicate);
}

Object.assign(QueryBase.prototype, { sort, transform, transformAsync });

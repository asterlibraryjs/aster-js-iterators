import { ArrayQuery } from "./array-query";
import { IAsyncIterableMixins, IIterableMixins } from "./mixins";
import { AsyncSortQuery, SortQuery } from "./sort-query";

export type TransformDelegate<T = any, R = T> = (src: Iterable<T>) => Iterable<R>;

export type AsyncTransformDelegate<T = any, R = T> = (src: AsyncIterable<T>) => AsyncIterable<R>;

export interface IQuery<T = any> extends Iterable<T>, IIterableMixins<T> {
    transform<R>(predicate: TransformDelegate<T, R>): IQuery<R>;
    transformAsync<R>(predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R>;
    sort(sortFn: (left: any, right: any) => number): ISortedQuery<T>
}

export interface ISortedQuery<T = any> extends IQuery<T> {
    thenBy(sortFn: (left: T, right: T,) => number): SortQuery<T>;
}

export interface IAsyncQuery<T = any> extends AsyncIterable<T>, IAsyncIterableMixins<T> {
    transformAsync<R>(predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R>;
    sort(sortFn: (left: any, right: any) => number): ISortedAsyncQuery<T>;
    fetch(): Promise<ArrayQuery<T>>;
    toArray(): Promise<T[]>;
}

export interface ISortedAsyncQuery<T = any> extends IAsyncQuery<T> {
    thenBy(sortFn: (left: T, right: T,) => number): AsyncSortQuery<T>;
}

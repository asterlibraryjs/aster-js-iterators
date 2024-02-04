import { ArrayQuery } from "./array-query";
import { IAsyncIterableMixins, IIterableMixins } from "./mixins";
import { AsyncSortQuery, SortedQuery } from "./sorted-query";

export type TransformDelegate<T = any, R = T> = (src: Iterable<T>) => Iterable<R>;

export type AsyncTransformDelegate<T = any, R = T> = (src: AsyncIterable<T>) => AsyncIterable<R>;

export interface IQuery<T = any> extends Iterable<T>, IIterableMixins<T> {
    /**
     * Transforms the elements in the query based on the provided transformation function.
     * @typeParam R Type of elements in the resulting query after transformation.
     * @param predicate The transformation function applied to each element.
     * @returns A new query containing the transformed elements.
     */
    transform<R>(predicate: TransformDelegate<T, R>): IQuery<R>;

    /**
     * Asynchronously transforms the elements in the query based on the provided asynchronous transformation function.
     * @typeParam R Type of elements in the resulting asynchronous query after transformation.
     * @param predicate The asynchronous transformation function applied to each element.
     * @returns An asynchronous query containing the transformed elements.
     */
    transformAsync<R>(predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R>;

    /**
     * Sorts the elements in the query based on the provided sorting function.
     * @param sortFn The sorting function used to compare elements.
     * @returns A sorted query based on the provided sorting function.
     */
    sort(sortFn: (left: any, right: any) => number): ISortedQuery<T>;

     /**
      * Converts the elements in the asynchronous query to an array.
      * @returns An array containing the elements of the query.
      */
    toArray(): T[];
}

export interface ISortedQuery<T = any> extends IQuery<T> {
    /**
     * Adds additionals sorting criteria to the sorted query based on the provided sorting function.
     * @param sortFn The sorting function used to compare elements for secondary sorting.
     * @returns A sorted query with additional sorting criteria.
     */
    thenBy(sortFn: (left: T, right: T,) => number): SortedQuery<T>;
}

export interface IAsyncQuery<T = any> extends AsyncIterable<T>, IAsyncIterableMixins<T> {
    /**
     * Asynchronously transforms the elements in the query based on the provided asynchronous transformation function.
     * @typeParam R - Type of elements in the resulting asynchronous query after transformation.
     * @param predicate - The asynchronous transformation function applied to each element.
     * @returns An asynchronous query containing the transformed elements.
     */
     transformAsync<R>(predicate: AsyncTransformDelegate<T, R>): IAsyncQuery<R>;

     /**
      * Sorts the elements in the asynchronous query based on the provided sorting function.
      * @param sortFn - The sorting function used to compare elements.
      * @returns An asynchronously sorted query based on the provided sorting function.
      */
     sort(sortFn: (left: any, right: any) => number): ISortedAsyncQuery<T>;

     /**
      * Retrieves the elements in the asynchronous query and returns them as an array query.
      * @returns A promise resolving to an array query containing the elements of the asynchronous query.
      */
     fetch(): Promise<ArrayQuery<T>>;

     /**
      * Converts the elements in the asynchronous query to an array.
      * @returns A promise resolving to an array containing the elements of the asynchronous query.
      */
     toArray(): Promise<T[]>;
}

export interface ISortedAsyncQuery<T = any> extends IAsyncQuery<T> {
    /**
     * Adds additionals sorting criteria to the asynchronously sorted query based on the provided sorting function.
     * @param sortFn - The sorting function used to compare elements for secondary sorting.
     * @returns An asynchronously sorted query with additional sorting criteria.
     */
    thenBy(sortFn: (left: T, right: T,) => number): AsyncSortQuery<T>;
}

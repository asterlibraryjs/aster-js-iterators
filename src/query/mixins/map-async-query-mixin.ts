import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";

export interface IMapAsyncQueryMixin<T = any> {
    /**
     * Transforms each item in the iterable, producing a new iterable of transformed elements.
     * @param callback The asynchronous transformation function applied to each item.
     * @returns An asynchronous query representing the transformed elements.
     */
    map<R>(callback: (item: T, rank: number) => R): IAsyncQuery<R>;

    /**
     * Transforms each item in the iterable, producing a new iterable, and iteratively returns each element of the resulting iterable.
     * @param callback The asynchronous transformation function applied to each item.
     * @returns An asynchronous query representing the iteratively flattened elements of the transformed iterables.
     */
    flatMap<R>(callback: (item: T, rank: number) => Iterable<R> | AsyncIterable<R>): IAsyncQuery<R>;
}

export const IMapAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements IMapAsyncQueryMixin {
        map<R>(callback: (item: any, rank: number) => any | Promise<any>): IAsyncQuery {
            const predicate = createMapCallback(callback);
            return this.transformAsync(predicate);
        }
        flatMap(callback: (item: any, rank: number) => Iterable<any> | AsyncIterable<any>): IAsyncQuery {
            const predicate = createFlatMapCallback(callback);
            return this.transformAsync(predicate);
        }
    };

function createMapCallback(callback: (item: any, rank: number) => any | Promise<any>): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        let rank = 0;
        for await (const item of src) {
            yield await callback(item, rank++);
        }
    }
}

function createFlatMapCallback(callback: (item: any, rank: number) => Iterable<any> | AsyncIterable<any>): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        let rank = 0;
        for await (const item of src) {
            yield* callback(item, rank++);
        }
    };
}

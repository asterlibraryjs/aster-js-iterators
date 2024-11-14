import { AsyncTransformDelegate, IAsyncQuery, IQuery, SyncToAsyncTransformDelegate, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface IMapQueryMixin<T = any> {
    /**
     * Applies a transformation to each item in the iterable, producing a new iterable of transformed elements.
     * @param callback The transformation function applied to each item.
     * @returns A new query representing the transformed elements.
     */
    map<R>(callback: (item: T, rank: number) => R): IQuery<R>;
    /**
     * Applies a transformation to each item in the iterable, producing a new iterable of transformed elements.
     * @param callback The transformation function applied to each item.
     * @returns A new query representing the transformed elements.
     */
    mapAsync<R>(callback: (item: T, rank: number) => Promise<R>): IAsyncQuery<R>;

    /**
     * Applies a transformation to each item in the iterable, producing a new iterable, and iteratively returns each element of the resulting iterable.
     * @param callback The transformation function applied to each item.
     * @returns A new query representing the iteratively flattened elements of the transformed iterables.
     */
    flatMap<R>(callback: (item: T, rank: number) => Iterable<R>): IQuery<R>;
}


export const IMapQueryMixin: QueryMixin = q =>
    class extends q implements IMapQueryMixin {
        map(callback: (item: any, rank: number) => any): IQuery {
            const predicate = createMapCallback(callback);
            return this.transform(predicate);
        }
        mapAsync(callback: (item: any, rank: number) => Promise<any>): IAsyncQuery {
            const predicate = createMapAsyncCallback(callback);
            return this.transformAsync(predicate);
        }
        flatMap(callback: (item: any, rank: number) => Iterable<any>): IQuery {
            const predicate = createFlatMapCallback(callback);
            return this.transform(predicate);
        }
    };

function createMapCallback(callback: (item: any, rank: number) => any): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            yield callback(item, rank++);
        }
    };
}

function createMapAsyncCallback(callback: (item: any, rank: number) => Promise<any>): SyncToAsyncTransformDelegate {
    return async function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            yield await callback(item, rank++);
        }
    };
}

function createFlatMapCallback(callback: (item: any, rank: number) => Iterable<any>): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            yield* callback(item, rank++);
        }
    };
}

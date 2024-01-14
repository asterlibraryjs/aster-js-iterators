import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";
import { DistinctList } from "./idistinct-list";

export interface IFilterAsyncQueryMixin<T = any> {
    skipWhile(predicate: (item: T, rank: number) => boolean): IAsyncQuery<T>;
    takeWhile(predicate: (item: T, rank: number) => boolean): IAsyncQuery<T>;
    filter(predicate: (item: T, rank: number) => boolean): IAsyncQuery<T>;
    ofType<R extends T>(predicate: (item: T) => item is R): IAsyncQuery<R>;
    distinct(comparer?: (left: T, right: T) => boolean): IAsyncQuery<T>;
    intersect(items: Iterable<T>, comparer?: (left: T, right: T) => boolean): IAsyncQuery<T>;
    except(items: Iterable<T>, comparer?: (left: T, right: T) => boolean): IAsyncQuery<T>;
}

export const IFilterAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements IFilterAsyncQueryMixin {
        skipWhile(predicate: (item: any, rank: number) => Promise<boolean> | boolean): IAsyncQuery {
            const callback = createSkipWhileCallback(predicate);
            return this.transformAsync(callback);
        }
        takeWhile(predicate: (item: any, rank: number) => Promise<boolean> | boolean): IAsyncQuery {
            const callback = createTakeWhileCallback(predicate);
            return this.transformAsync(callback);
        }
        filter(predicate: (item: any, rank: number) => Promise<boolean> | boolean): IAsyncQuery {
            const callback = createFilterCallback(predicate);
            return this.transformAsync(callback);
        }
        ofType(predicate: (item: any) => item is any): IAsyncQuery {
            return this.filter(predicate);
        }
        distinct(comparer?: (left: any, right: any) => boolean): IAsyncQuery {
            const predicate = createDistinctCallback(comparer);
            return this.transformAsync(predicate);
        }
        intersect(items: Iterable<any>, comparer?: (left: any, right: any) => boolean): IAsyncQuery {
            const predicate = createIntersectCallback(items, comparer);
            return this.transformAsync(predicate);
        }
        except(items: Iterable<any>, comparer?: (left: any, right: any) => boolean): IAsyncQuery {
            const predicate = createExceptCallback(items, comparer);
            return this.transformAsync(predicate);
        }
    };

function createTakeWhileCallback(callback: (item: any, rank: number) => Promise<boolean> | boolean): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        let rank = 0;
        for await (const item of src) {
            if (!await callback(item, rank++)) break;
            yield item;
        }
    }
}

function createSkipWhileCallback(callback: (item: any, rank: number) => Promise<boolean> | boolean): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        let rank = 0;
        let skip = true;
        for await (const item of src) {
            if (skip) {
                if (await callback(item, rank++)) continue;
                skip = false;
            }
            yield item;
        }
    }
}

function createFilterCallback(callback: (item: any, rank: number) => Promise<boolean> | boolean): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        let rank = 0;
        for await (const item of src) {
            if (await callback(item, rank++)) yield item;
        }
    }
}

function createDistinctCallback(comparer?: (left: any, right: any) => boolean): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        const items = DistinctList.create(comparer);
        for await (const item of src) {
            if (items.tryAdd(item)) yield item;
        }
    }
}

function createIntersectCallback(values: Iterable<any>, comparer?: (left: any, right: any) => boolean): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        const except = DistinctList.fromValues(values, comparer);
        for await (const item of src) {
            if (except.has(item)) yield item;
        }
    }
}

function createExceptCallback(values: Iterable<any>, comparer?: (left: any, right: any) => boolean): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        const except = DistinctList.fromValues(values, comparer);
        for await (const item of src) {
            if (!except.has(item)) yield item;
        }
    }
}

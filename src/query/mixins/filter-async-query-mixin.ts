import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";
import { DistinctList } from "./idistinct-list";

export interface IFilterAsyncQueryMixin<T = any> {
    /**
     * Skips items while the specified predicate returns true. Once it encounters a false condition, it returns every remaining item.
     * @param predicate The asynchronous predicate function used to skip items.
     * @returns An asynchronous query containing the remaining items after the first false condition.
     */
    skipWhile(predicate: (item: T, rank: number) => boolean): IAsyncQuery<T>;

    /**
     * Takes items while the specified predicate returns true. Once it encounters a false condition, it stops and returns the taken items.
     * @param predicate The asynchronous predicate function used to take items.
     * @returns An asynchronous query containing the taken items until the first false condition.
     */
    takeWhile(predicate: (item: T, rank: number) => boolean): IAsyncQuery<T>;

    /**
     * Filters items using the provided predicate.
     * @param predicate The asynchronous predicate function used to filter items.
     * @returns An asynchronous query containing only the items that satisfy the predicate.
     */
    filter(predicate: (item: T, rank: number) => boolean): IAsyncQuery<T>;

    /**
     * Filters items and casts them using the provided type predicate. Similar to filter, but with TypeScript type casting.
     * @param predicate The asynchronous type predicate used to cast and filter items.
     * @returns An asynchronous query containing only the items that satisfy the type predicate.
     */
    ofType<R extends T>(predicate: (item: T) => item is R): IAsyncQuery<R>;

    /**
     * Returns each items while filtering every items already returned once.
     * @param comparer Optional comparer function to customize equality check for duplicates.
     * @returns An asynchronous query with duplicate items eliminated.
     */
    distinct(comparer?: (left: T, right: T) => boolean): IAsyncQuery<T>;

    /**
     * Filters and keeps items that are contained in the provided item list.
     * @param items The iterable containing items to intersect with.
     * @param comparer Optional comparer function to customize equality check.
     * @returns An asynchronous query containing only the items that are present in both the original query and the provided item list.
     */
    intersect(items: Iterable<T>, comparer?: (left: T, right: T) => boolean): IAsyncQuery<T>;

    /**
     * Filters and discards items that are contained in the provided item list.
     * @param items The iterable containing items to exclude.
     * @param comparer Optional comparer function to customize equality check.
     * @returns An asynchronous query containing only the items that are not present in the provided item list.
     */
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

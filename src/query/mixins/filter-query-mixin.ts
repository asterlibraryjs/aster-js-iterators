import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";
import { DistinctList } from "./idistinct-list";

export interface IFilterQueryMixin<T = any> {
    /**
     * Skips items while the specified predicate returns true. Once it encounters a false condition, it returns every remaining item.
     * @param predicate - The predicate function used to skip items.
     * @returns A new query containing the remaining items after the first false condition.
     */
    skipWhile(predicate: (item: T, rank: number) => boolean): IQuery<T>;

    /**
     * Takes items while the specified predicate returns true. Once it encounters a false condition, it stops and returns the taken items.
     * @param predicate - The predicate function used to take items.
     * @returns A new query containing the taken items until the first false condition.
     */
    takeWhile(predicate: (item: T, rank: number) => boolean): IQuery<T>;

    /**
     * Filters items using the provided predicate.
     * @param predicate - The predicate function used to filter items.
     * @returns A new query containing only the items that satisfy the predicate.
     */
    filter(predicate: (item: T, rank: number) => boolean): IQuery<T>;

    /**
     * Filters items and casts them using the provided type predicate. Similar to filter, but with TypeScript type casting.
     * @param predicate - The type predicate used to cast and filter items.
     * @returns A new query containing only the items that satisfy the type predicate.
     */
    ofType<R extends T>(predicate: (item: T) => item is R): IQuery<R>;

    /**
     * Removes duplicate items from the query.
     * @param comparer - Optional comparer function to customize equality check for duplicates.
     * @returns A new query with duplicate items eliminated.
     */
    distinct(comparer?: (left: T, right: T) => boolean): IQuery<T>;

    /**
     * Filters and keeps items that are contained in the provided item list.
     * @param items - The iterable containing items to intersect with.
     * @param comparer - Optional comparer function to customize equality check.
     * @returns A new query containing only the items that are present in both the original query and the provided item list.
     */
    intersect(items: Iterable<T>, comparer?: (left: T, right: T) => boolean): IQuery<T>;

    /**
     * Filters and discards items that are contained in the provided item list.
     * @param items - The iterable containing items to exclude.
     * @param comparer - Optional comparer function to customize equality check.
     * @returns A new query containing only the items that are not present in the provided item list.
     */
    except(items: Iterable<T>, comparer?: (left: T, right: T) => boolean): IQuery<T>;
}

export const IFilterQueryMixin: QueryMixin = q =>
    class extends q implements IFilterQueryMixin {
        skipWhile(predicate: (item: any, rank: number) => boolean): IQuery {
            const callback = createSkipWhileCallback(predicate);
            return this.transform(callback);
        }
        takeWhile(predicate: (item: any, rank: number) => boolean): IQuery {
            const callback = createTakeWhileCallback(predicate);
            return this.transform(callback);
        }
        filter(predicate: (item: any, rank: number) => boolean): IQuery {
            const callback = createFilterCallback(predicate);
            return this.transform(callback);
        }
        ofType(predicate: (item: any) => item is any): IQuery {
            return this.filter(predicate);
        }
        distinct(comparer?: (left: any, right: any) => boolean): IQuery {
            const predicate = createDistinctCallback(comparer);
            return this.transform(predicate);
        }
        intersect(items: Iterable<any>, comparer?: (left: any, right: any) => boolean): IQuery {
            const predicate = createIntersectCallback(items, comparer);
            return this.transform(predicate);
        }
        except(items: Iterable<any>, comparer?: (left: any, right: any) => boolean): IQuery {
            const predicate = createExceptCallback(items, comparer);
            return this.transform(predicate);
        }
    };

function createTakeWhileCallback(callback: (item: any, rank: number) => boolean): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            if (!callback(item, rank++)) break;
            yield item;
        }
    }
}

function createSkipWhileCallback(callback: (item: any, rank: number) => boolean): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        let skip = true;
        for (const item of src) {
            if (skip) {
                if (callback(item, rank++)) continue;
                skip = false;
            }
            yield item;
        }
    }
}

function createFilterCallback(callback: (item: any, rank: number) => boolean): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            if (callback(item, rank++)) yield item;
        }
    }
}

function createDistinctCallback(comparer?: (left: any, right: any) => boolean): TransformDelegate {
    return function* (src: Iterable<any>) {
        const items = DistinctList.create(comparer);
        for (const item of src) {
            if (items.tryAdd(item)) yield item;
        }
    }
}

function createIntersectCallback(values: Iterable<any>, comparer?: (left: any, right: any) => boolean): TransformDelegate {
    return function* (src: Iterable<any>) {
        const except = DistinctList.fromValues(values, comparer);
        for (const item of src) {
            if (except.has(item)) yield item;
        }
    }
}

function createExceptCallback(values: Iterable<any>, comparer?: (left: any, right: any) => boolean): TransformDelegate {
    return function* (src: Iterable<any>) {
        const except = DistinctList.fromValues(values, comparer);
        for (const item of src) {
            if (!except.has(item)) yield item;
        }
    }
}

import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";
import { DistinctList } from "./idistinct-list";

export interface IFilterQueryMixin<T = any> {
    skipWhile(predicate: (item: T, rank: number) => boolean): IQuery<T>;
    takeWhile(predicate: (item: T, rank: number) => boolean): IQuery<T>;
    filter(predicate: (item: T, rank: number) => boolean): IQuery<T>;
    ofType<R extends T>(predicate: (item: T) => item is R): IQuery<R>;
    distinct(comparer?: (left: T, right: T) => boolean): IQuery<T>;
    intersect(items: Iterable<T>, comparer?: (left: T, right: T) => boolean): IQuery<T>;
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

import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface IUnionQueryMixin<T = any> {
    /**
     * Creates a query by combining the elements of the current query with those from the provided iterable.
     * @param iterable The iterable to union with the current query.
     * @returns A query containing the combined elements.
     */
    union(iterable: Iterable<T>): IQuery<T>;

    /**
     * Appends the specified item to the end of the current query.
     * @param item The item to append.
     * @returns A query with the item appended.
     */
    append(item: T): IQuery<T>;

    /**
     * Prepends the specified item to the beginning of the current query.
     * @param item The item to prepend.
     * @returns A query with the item prepended.
     */
    prepend(item: T): IQuery<T>;
    /**
     * Surrounds the current query with the specified item put at the beginning and the end of the query.
     * @param item Item to surround the query with.
     */
    surround(item: T): IQuery<T>;
    /**
     * Surrounds the current query with the specified items put at the beginning and the end of the query.
     * @param first The first item to surround the query with.
     * @param last The last item to surround the query with.
     */
    surround(first: T, last: T): IQuery<T>;
}

export const IUnionQueryMixin: QueryMixin = q =>
    class extends q implements IUnionQueryMixin {
        union(iterable: Iterable<any>): IQuery {
            const predicate = createUnion(iterable);
            return this.transform(predicate);
        }
        append(item: any): IQuery {
            const predicate = createAppend(item);
            return this.transform(predicate);
        }
        prepend(item: any): IQuery {
            const predicate = createPrepend(item);
            return this.transform(predicate);
        }
        surround(first: unknown, last?: unknown): IQuery<any> {
            const predicate = createSurround(first, typeof last === "undefined" ? first : last);
            return this.transform(predicate);
        }
    };

function createUnion(iterable: Iterable<any>): TransformDelegate {
    return function* (src: Iterable<any>) {
        yield* src;
        yield* iterable;
    }
}

function createAppend(item: any): TransformDelegate {
    return function* (src: Iterable<any>) {
        yield* src;
        yield item;
    }
}

function createPrepend(item: any): TransformDelegate {
    return function* (src: Iterable<any>) {
        yield item;
        yield* src;
    }
}

function createSurround(first: any, last: any): TransformDelegate {
    return function* (src: Iterable<any>) {
        yield first;
        yield* src;
        yield last;
    }
}
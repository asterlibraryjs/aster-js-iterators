import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";

export interface IUnionAsyncQueryMixin<T = any> {
    /**
     * Creates an asynchronous query by combining the elements of the current query with those from the provided iterable.
     * @param iterable The iterable or async iterable to union with the current query.
     * @returns An asynchronous query containing the combined elements.
     */
    union(iterable: Iterable<T> | AsyncIterable<T>): IAsyncQuery<T>;

    /**
     * Appends the specified item to the end of the current asynchronous query.
     * @param item The item to append.
     * @returns An asynchronous query with the item appended.
     */
    append(item: T): IAsyncQuery<T>;

    /**
     * Prepends the specified item to the beginning of the current asynchronous query.
     * @param item The item to prepend.
     * @returns An asynchronous query with the item prepended.
     */
    prepend(item: T): IAsyncQuery<T>;
    /**
     * Surrounds the current query with the specified item put at the beginning and the end of the query.
     * @param item Item to surround the query with.
     */
    surround(item: T): IAsyncQuery<T>;
    /**
     * Surrounds the current query with the specified items put at the beginning and the end of the query.
     * @param first The first item to surround the query with.
     * @param last The last item to surround the query with.
     */
    surround(first: T, last: T): IAsyncQuery<T>;
}

export const IUnionAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements IUnionAsyncQueryMixin {
        union(iterable: Iterable<any> | AsyncIterable<any>): IAsyncQuery {
            const predicate = createUnion(iterable);
            return this.transformAsync(predicate);
        }
        append(item: any): IAsyncQuery {
            const predicate = createAppend(item);
            return this.transformAsync(predicate);
        }
        prepend(item: any): IAsyncQuery {
            const predicate = createPrepend(item);
            return this.transformAsync(predicate);
        }
        surround(first: unknown, last?: unknown): IAsyncQuery<any> {
            const predicate = createSurround(first, typeof last === "undefined" ? first : last);
            return this.transformAsync(predicate);
        }
    };

function createUnion(iterable: Iterable<any> | AsyncIterable<any>): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        yield* src;
        yield* iterable;
    }
}

function createAppend(item: any): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        yield* src;
        yield item;
    }
}

function createPrepend(item: any): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        yield item;
        yield* src;
    }
}

function createSurround(first: any, last: any): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        yield first;
        yield* src;
        yield last;
    }
}

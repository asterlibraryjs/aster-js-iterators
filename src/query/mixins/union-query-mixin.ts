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

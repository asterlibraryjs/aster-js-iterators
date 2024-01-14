import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";

export interface IUnionAsyncQueryMixin<T = any> {
    union(iterable: Iterable<T> | AsyncIterable<T>): IAsyncQuery<T>;
    append(item: T): IAsyncQuery<T>;
    prepend(item: T): IAsyncQuery<T>;
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

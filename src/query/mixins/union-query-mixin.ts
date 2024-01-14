import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface IUnionQueryMixin<T = any> {
    union(iterable: Iterable<T>): IQuery<T>;
    append(item: T): IQuery<T>;
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

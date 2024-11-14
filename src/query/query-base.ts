import { SyncToAsyncTransformDelegate, IAsyncQuery, IQuery, ISortedQuery, TransformDelegate } from "./iquery";
import { IIterableMixins, QueryMixins } from "./mixins";

export interface QueryBase<T> extends IIterableMixins<T> { }

@QueryMixins(...IIterableMixins)
export abstract class QueryBase<T> implements IQuery<T> {

    sort(sortFn: (left: any, right: any) => number): ISortedQuery<T> { throw new Error(); }

    transform<R>(predicate: TransformDelegate<T, R>): IQuery<R> { throw new Error(); }

    transformAsync<R>(predicate: SyncToAsyncTransformDelegate<T, R>): IAsyncQuery<R> { throw new Error(); }

    toArray(): T[] {
        return [...this];
    }

    abstract [Symbol.iterator](): IterableIterator<T>;

    async *[Symbol.asyncIterator](): AsyncIterator<T> {
        yield* this;
    }
}

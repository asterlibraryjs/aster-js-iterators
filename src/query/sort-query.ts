import { QueryBase } from "./query-base";
import { AsyncQueryBase } from "./async-query-base";
import { ISortedAsyncQuery, ISortedQuery } from "./iquery";

function combineSortFn<TSource>(first: (left: TSource, right: TSource,) => number, second: (left: TSource, right: TSource,) => number) {
    return (left: TSource, right: TSource,) => {
        const firstResult = first(left, right);
        if (firstResult !== 0) return firstResult;
        return second(left, right);
    };
}

export class SortQuery<T = any> extends QueryBase<T> implements ISortedQuery<T> {
    constructor(
        private readonly _iterable: Iterable<T>,
        private readonly _sortFn: (left: T, right: T,) => number
    ) { super(); }

    thenBy(sortFn: (left: T, right: T,) => number): SortQuery<T> {
        const newSortFn = combineSortFn(this._sortFn, sortFn);
        return new SortQuery(this._iterable, newSortFn);
    }

    *[Symbol.iterator](): IterableIterator<T> {
        const values = Array.isArray(this._iterable) ? this._iterable : [...this._iterable];
        yield* values.sort(this._sortFn);
    }
}

export class AsyncSortQuery<T = any> extends AsyncQueryBase<T> implements ISortedAsyncQuery<T> {
    constructor(
        private readonly _iterable: AsyncIterable<T>,
        private readonly _sortFn: (left: T, right: T,) => number
    ) { super(); }

    thenBy(sortFn: (left: T, right: T,) => number): AsyncSortQuery<T> {
        const newSortFn = combineSortFn(this._sortFn, sortFn);
        return new AsyncSortQuery(this._iterable, newSortFn);
    }

    async toArray(): Promise<T[]> {
        const values: T[] = [];
        for await (const item of this._iterable) {
            values.push(item);
        }
        return values.sort(this._sortFn);
    }

    async *[Symbol.asyncIterator](): AsyncIterator<T> {
        yield* await this.toArray();
    }
}

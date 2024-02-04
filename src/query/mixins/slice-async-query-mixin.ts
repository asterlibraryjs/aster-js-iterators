import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";

export interface ISliceAsyncQueryMixin<T = any> {
    /**
     * Asynchronously skips the specified number of items from the beginning of the query.
     * @param skip The number of items to skip.
     * @returns An asynchronous query containing the remaining items after skipping.
     */
    skip(skip: number): IAsyncQuery<T>;

    /**
     * Asynchronously takes the specified number of items from the beginning of the query.
     * @param take The number of items to take.
     * @returns An asynchronous query containing the taken items.
     */
    take(take: number): IAsyncQuery<T>;

    /**
     * Asynchronously slices the query, skipping the specified number of items and taking the specified number of items.
     * @param skip The number of items to skip.
     * @param take The number of items to take.
     * @returns An asynchronous query containing the sliced items.
     */
    slice(skip: number, take: number): IAsyncQuery<T>;
}

export const ISliceAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements ISliceAsyncQueryMixin {

        skip(skip: number): IAsyncQuery {
            const predicate = createSlicePredicate(skip, -1);
            return this.transformAsync(predicate);
        }

        take(take: number): IAsyncQuery {
            const predicate = createSlicePredicate(0, take);
            return this.transformAsync(predicate);
        }

        slice(skip: number, take: number): IAsyncQuery {
            const predicate = createSlicePredicate(skip, take);
            return this.transformAsync(predicate);
        }
    };

function createSlicePredicate(skip: number, take: number): AsyncTransformDelegate {
    const end = skip + take - 1;
    return async function* (src: AsyncIterable<any>) {
        let idx = 0;
        for await (const item of src) {
            if (idx < skip) continue;
            if (idx > end) break;
            yield item;
        }
    }
}

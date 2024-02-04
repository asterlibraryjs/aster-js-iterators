import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface ISliceQueryMixin<T = any> {
    /**
     * Skips the specified number of items from the beginning of the query.
     * @param skip The number of items to skip.
     * @returns A query containing the remaining items after skipping.
     */
    skip(skip: number): IQuery<T>;

    /**
     * Takes the specified number of items from the beginning of the query.
     * @param take The number of items to take.
     * @returns A query containing the taken items.
     */
    take(take: number): IQuery<T>;

    /**
     * Slices the query, skipping the specified number of items and taking the specified number of items.
     * @param skip The number of items to skip.
     * @param take The number of items to take.
     * @returns A query containing the sliced items.
     */
    slice(skip: number, take: number): IQuery<T>;
}

export const ISliceQueryMixin: QueryMixin = q =>
    class extends q implements ISliceQueryMixin {

        skip(skip: number): IQuery {
            const predicate = createSlicePredicate(skip, -1);
            return this.transform(predicate);
        }

        take(take: number): IQuery {
            const predicate = createSlicePredicate(0, take);
            return this.transform(predicate);
        }

        slice(skip: number, take: number): IQuery<any> {
            const predicate = createSlicePredicate(skip, take);
            return this.transform(predicate);
        }
    };

function createSlicePredicate(skip: number, take: number): TransformDelegate {
    const end = skip + take - 1;
    return function* (src: Iterable<any>) {
        let idx = 0;
        for (const item of src) {
            if (idx < skip) continue;
            if (idx > end) break;
            yield item;
        }
    }
}

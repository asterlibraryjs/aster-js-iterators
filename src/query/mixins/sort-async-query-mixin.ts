import { ISortedAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";

export interface ISortAsyncQueryMixin<T = any> {
    /**
     * Sorts the query based on the specified predicate.
     * @param predicate The sorting predicate function applied to each item.
     * @param desc Optional flag indicating whether to sort in descending order (default is ascending).
     * @returns An asynchronously sorted query based on the specified predicate.
     */
    sortBy(predicate: (item: T) => any, desc?: boolean): ISortedAsyncQuery<T>;
}

export const ISortAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements ISortAsyncQueryMixin {
        sortBy(predicate: (item: any) => any, desc: boolean = false): ISortedAsyncQuery {
            const lt = desc ? 1 : -1;
            const gt = desc ? -1 : 1;

            const sortFn = (left: any, right: any) => {
                const leftValue = predicate(left);
                const rightValue = predicate(right);
                if (leftValue == rightValue) return 0;
                return leftValue < rightValue ? lt : gt;
            };
            return this.sort(sortFn);
        }
    };

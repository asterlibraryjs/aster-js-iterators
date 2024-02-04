import { ISortedQuery } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface ISortQueryMixin<T = any> {
    /**
     * Sorts the query based on the specified predicate.
     * @param predicate The sorting predicate function applied to each item.
     * @param desc Optional flag indicating whether to sort in descending order (default is ascending).
     * @returns A sorted query based on the specified predicate.
     */
    sortBy(predicate: (item: any) => any, desc?: boolean): ISortedQuery<T>;
}

export const ISortQueryMixin: QueryMixin = q =>
    class extends q implements ISortQueryMixin {
        sortBy(predicate: (item: any) => any, desc: boolean = false): ISortedQuery {
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

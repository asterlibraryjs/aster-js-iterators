import { ISortedQuery } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface ISortQueryMixin<T = any> {
    sortBy(predicate: (item: any) => any, desc?: boolean): ISortedQuery<T>
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

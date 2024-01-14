import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface ISliceQueryMixin<T = any> {
    skip(skip: number): IQuery<T>;
    take(take: number): IQuery<T>;
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

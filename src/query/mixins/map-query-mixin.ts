import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface IMapQueryMixin<T = any> {
    map<R>(callback: (item: T, rank: number) => R): IQuery<R>;
    flatMap<R>(callback: (item: T, rank: number) => Iterable<R>): IQuery<R>;
}
;

export const IMapQueryMixin: QueryMixin = q =>
    class extends q implements IMapQueryMixin {
        map(callback: (item: any, rank: number) => any): IQuery {
            const predicate = createMapCallback(callback);
            return this.transform(predicate);
        }
        flatMap(callback: (item: any, rank: number) => Iterable<any>): IQuery {
            const predicate = createFlatMapCallback(callback);
            return this.transform(predicate);
        }
    };

function createMapCallback(callback: (item: any, rank: number) => any): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            yield callback(item, rank++);
        }
    };
}

function createFlatMapCallback(callback: (item: any, rank: number) => Iterable<any>): TransformDelegate {
    return function* (src: Iterable<any>) {
        let rank = 0;
        for (const item of src) {
            yield* callback(item, rank++);
        }
    };
}

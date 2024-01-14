import { AsyncQueryMixin } from "./apply-mixins";

export interface IScalarAsyncQueryMixin<T = any> {
    includes(value: T, comparer?: (left: T, right: T) => boolean): Promise<boolean>;
    hasAny(predicate?: (item: T, rank: number) => Promise<boolean> | boolean): Promise<boolean>;
    every(predicate: (item: T, rank: number) => Promise<boolean> | boolean): Promise<boolean>;
    first(fallback: T): Promise<T>;
    first(): Promise<T | undefined>;
    findFirst(predicate: (item: T, rank: number) => Promise<boolean> | boolean, fallback: T): Promise<T>;
    findFirst(predicate: (item: T, rank: number) => Promise<boolean> | boolean): Promise<T | undefined>;
    findLast(predicate: (item: T, rank: number) => Promise<boolean> | boolean, fallback: T): Promise<T>;
    findLast(predicate: (item: T, rank: number) => Promise<boolean> | boolean): Promise<T | undefined>;
    last(fallback: T): Promise<T>;
    last(): Promise<T | undefined>;
    reduce<R>(reducer: (previous: R, current: T) => R, seed: R): Promise<R>;
}

const NotFound = Symbol();

export const IScalarAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements IScalarAsyncQueryMixin {

        async includes(value: any, comparer: (left: any, right: any) => boolean = Object.is): Promise<boolean> {
            for await (const item of this) if (comparer(value, item)) return true;
            return false;
        }

        async hasAny(predicate?: (item: any, rank: number) => Promise<boolean> | boolean): Promise<boolean> {
            predicate ??= _ => true;

            let rank = 0;
            for await (const item of this) if (await predicate(item, rank++)) return true;
            return false;
        }

        async every(predicate: (item: any, rank: number) => Promise<boolean> | boolean): Promise<boolean> {
            let rank = 0;
            for await (const item of this) if (!await predicate(item, rank++)) return false;
            return true;
        }

        async first(fallback?: any): Promise<any> {
            for await (const item of this) return item;
            return fallback;
        }

        async findFirst(predicate: (item: any, rank: number) => Promise<boolean> | boolean, fallback?: any): Promise<any> {
            let rank = 0;
            for await (const item of this) if (await predicate(item, rank++)) return item;
            return fallback;
        }

        async findLast(predicate: (item: any, rank: number) => Promise<boolean> | boolean, fallback?: any): Promise<any> {
            let rank = 0;
            let last: any = NotFound;
            for await (const item of this) if (await predicate(item, rank++)) last = item;
            return last !== NotFound ? last : fallback;
        }

        async last(fallback?: any): Promise<any> {
            let result = fallback;
            for await (const item of this) result = item;
            return result;
        }

        async count(): Promise<number> {
            let result = 0;
            for await (const _ of this) result++;
            return result;
        }

        async reduce(reducer: (previous: any, current: any) => Promise<any> | any, seed: any): Promise<any> {
            let previous = seed;
            for await (const item of this) previous = await reducer(previous, item);
            return previous;
        }
    };

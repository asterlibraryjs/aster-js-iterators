import { QueryMixin } from "./apply-mixins";

export interface IScalarQueryMixin<T = any> {
    includes(value: T, comparer?: (left: T, right: T) => boolean): boolean;
    hasAny(predicate?: (item: T, rank: number) => boolean): boolean;
    every(predicate: (item: T, rank: number) => boolean): boolean;
    first(fallback: T): T;
    first(): T | undefined;
    findFirst(predicate: (item: T, rank: number) => boolean, fallback: T): T;
    findFirst(predicate: (item: T, rank: number) => boolean): T | undefined;
    findLast(predicate: (item: T, rank: number) => boolean, fallback: T): T;
    findLast(predicate: (item: T, rank: number) => boolean): T | undefined
    last(fallback: T): T;
    last(): T | undefined;
    reduce<R>(reducer: (previous: R, current: T) => R, seed: R): R;
}

const NotFound = Symbol();

export const IScalarQueryMixin: QueryMixin = q =>
    class extends q implements IScalarQueryMixin {

        includes(value: any, comparer: (left: any, right: any) => boolean = Object.is): boolean {
            for (const item of this) if (comparer(value, item)) return true;
            return false;
        }

        hasAny(predicate?: (item: any, rank: number) => boolean): boolean {
            predicate ??= _ => true;

            let rank = 0;
            for (const item of this) if (predicate(item, rank++)) return true;
            return false;
        }

        every(predicate: (item: any, rank: number) => boolean): boolean {
            let rank = 0;
            for (const item of this) if (!predicate(item, rank++)) return false;
            return true;
        }

        first(fallback?: any): any {
            for (const item of this) return item;
            return fallback;
        }

        findFirst(predicate: (item: any, rank: number) => boolean, fallback?: any): any {
            let rank = 0;
            for (const item of this) if (predicate(item, rank++)) return item;
            return fallback;
        }

        findLast(predicate: (item: any, rank: number) => boolean, fallback?: any): any {
            let rank = 0;
            let last: any = NotFound;
            for (const item of this) if (predicate(item, rank++)) last = item;
            return last !== NotFound ? last : fallback;
        }

        last(fallback?: any): any {
            let result = fallback;
            for (const item of this) result = item;
            return result;
        }

        count(): number {
            let result = 0;
            for (const _ of this) result++;
            return result;
        }

        reduce(reducer: (previous: any, current: any) => any, seed: any): any {
            let previous = seed;
            for (const item of this) previous = reducer(previous, item);
            return previous;
        }
    };

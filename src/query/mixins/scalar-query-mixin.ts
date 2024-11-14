import { QueryMixin } from "./apply-mixins";

export interface IScalarQueryMixin<T = any> {
    /**
     * Checks if the specified value is present in the iterable.
     * @param value The value to search for.
     * @param comparer Optional comparer function to customize equality check.
     * @returns A boolean indicating the presence of the specified value in the iterable.
     */
    includes(value: T, comparer?: (left: T, right: T) => boolean): boolean;

    /**
     * Checks if the specified value is present in the iterable.
     * @param value The value to search for.
     * @param comparer Optional comparer function to customize equality check.
     * @returns A boolean indicating the presence of the specified value in the iterable.
     */
    includesAsync(value: T, comparer?: (left: T, right: T) => Promise<boolean>): Promise<boolean>;

    /**
     * Checks if any element in the iterable satisfies the specified predicate.
     * @param predicate Optional predicate function to evaluate elements.
     * @returns A boolean indicating if any element in the iterable satisfies the predicate.
     */
    hasAny(predicate?: (item: T, rank: number) => boolean): boolean;

    /**
     * Checks if any element in the iterable satisfies the specified predicate.
     * @param predicate Optional predicate function to evaluate elements.
     * @returns A boolean indicating if any element in the iterable satisfies the predicate.
     */
    hasAnyAsync(predicate: (item: T, rank: number) => Promise<boolean>): Promise<boolean>;

    /**
     * Checks if all elements in the iterable satisfy the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns A boolean indicating if all elements in the iterable satisfy the predicate.
     */
    every(predicate: (item: T, rank: number) => boolean): boolean;

    /**
     * Checks if all elements in the iterable satisfy the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns A boolean indicating if all elements in the iterable satisfy the predicate.
     */
    everyAsync(predicate: (item: T, rank: number) => Promise<boolean>): Promise<boolean>;

    /**
     * Retrieves the first element of the iterable.
     * @param fallback The value to return if the iterable is empty.
     * @returns The first element or the specified fallback value.
     */
    first(fallback: T): T;

    /**
     * Retrieves the first element of the iterable.
     * @returns The first element or undefined if the iterable is empty.
     */
    first(): T | undefined;

    /**
     * Finds the first element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @param fallback The value to return if no matching element is found.
     * @returns The first matching element or the specified fallback value.
     */
    findFirst(predicate: (item: T, rank: number) => boolean, fallback: T): T;

    /**
     * Finds the first element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns The first matching element or undefined if no matching element is found.
     */
    findFirst(predicate: (item: T, rank: number) => boolean): T | undefined;

    /**
     * Finds the first element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @param fallback The value to return if no matching element is found.
     * @returns The first matching element or the specified fallback value.
     */
    findFirstAsync(predicate: (item: T, rank: number) => Promise<boolean>, fallback: T): Promise<T>;

    /**
     * Finds the first element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns The first matching element or undefined if no matching element is found.
     */
    findFirstAsync(predicate: (item: T, rank: number) => Promise<boolean>): Promise<T | undefined>;

    /**
     * Finds the last element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @param fallback The value to return if no matching element is found.
     * @returns The last matching element or the specified fallback value.
     */
    findLast(predicate: (item: T, rank: number) => boolean, fallback: T): T;

    /**
     * Finds the last element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns The last matching element or undefined if no matching element is found.
     */
    findLast(predicate: (item: T, rank: number) => boolean): T | undefined;

    /**
     * Finds the last element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @param fallback The value to return if no matching element is found.
     * @returns The last matching element or the specified fallback value.
     */
    findLastAsync(predicate: (item: T, rank: number) => Promise<boolean>, fallback: T): Promise<T>;

    /**
     * Finds the last element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns The last matching element or undefined if no matching element is found.
     */
    findLastAsync(predicate: (item: T, rank: number) => Promise<boolean>): Promise<T | undefined>;

    /**
     * Retrieves the last element of the iterable.
     * @param fallback The value to return if the iterable is empty.
     * @returns The last element or the specified fallback value.
     */
    last(fallback: T): T;

    /**
     * Retrieves the last element of the iterable.
     * @returns The last element or undefined if the iterable is empty.
     */
    last(): T | undefined;

    /**
     * Reduces the iterable to a single value by applying a reducer function.
     * @param reducer Function to apply to each element in the iterable.
     * @param seed The initial value of the accumulator.
     * @returns The accumulated result.
     */
    reduce<R>(reducer: (previous: R, current: T) => R, seed: R): R;

    /**
     * Reduces the iterable to a single value by applying a reducer function.
     * @param reducer Function to apply to each element in the iterable.
     * @param seed The initial value of the accumulator.
     * @returns The accumulated result.
     */
    reduceAsync<R>(reducer: (previous: R, current: T) => Promise<R>, seed: R): Promise<R>;

    /** Create a string by concatenating all elements in the iterable. */
    join(separator?: string): string;
}

const NotFound = Symbol();

export const IScalarQueryMixin: QueryMixin = q =>
    class extends q implements IScalarQueryMixin {

        includes(value: any, comparer: (left: any, right: any) => boolean = Object.is): boolean {
            for (const item of this) if (comparer(value, item)) return true;
            return false;
        }

        async includesAsync(value: any, comparer: (left: any, right: any) => Promise<boolean>): Promise<boolean> {
            for (const item of this) if (await comparer(value, item)) return true;
            return false;
        }

        hasAny(predicate?: (item: any, rank: number) => boolean): boolean {
            predicate ??= _ => true;

            let rank = 0;
            for (const item of this) if (predicate(item, rank++)) return true;
            return false;
        }

        async hasAnyAsync(predicate: (item: any, rank: number) => Promise<boolean>): Promise<boolean> {
            let rank = 0;
            for (const item of this) if (await predicate(item, rank++)) return true;
            return false;
        }

        every(predicate: (item: any, rank: number) => boolean): boolean {
            let rank = 0;
            for (const item of this) if (!predicate(item, rank++)) return false;
            return true;
        }

        async everyAsync(predicate: (item: any, rank: number) => Promise<boolean>): Promise<boolean> {
            let rank = 0;
            for (const item of this) if (!await predicate(item, rank++)) return false;
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


        async findFirstAsync(predicate: (item: any, rank: number) => Promise<boolean>, fallback?: any): Promise<any> {
            let rank = 0;
            for (const item of this) if (await predicate(item, rank++)) return item;
            return fallback;
        }

        findLast(predicate: (item: any, rank: number) => boolean, fallback?: any): any {
            let rank = 0;
            let last: any = NotFound;
            for (const item of this) if (predicate(item, rank++)) last = item;
            return last !== NotFound ? last : fallback;
        }

        async findLastAsync(predicate: (item: any, rank: number) => Promise<boolean>, fallback?: any): Promise<any> {
            let rank = 0;
            let last: any = NotFound;
            for (const item of this) if (await predicate(item, rank++)) last = item;
            return last !== NotFound ? last : fallback;
        }

        last(fallback?: any): any {
            let result = fallback;
            for (const item of this) result = item;
            return result;
        }

        reduce(reducer: (previous: any, current: any) => any, seed: any): any {
            let previous = seed;
            for (const item of this) previous = reducer(previous, item);
            return previous;
        }

        async reduceAsync(reducer: (previous: any, current: any) => Promise<any>, seed: any): Promise<any> {
            let previous = seed;
            for (const item of this) previous = await reducer(previous, item);
            return previous;
        }

        join(separator?: string): string {
            return [...this].join(separator);
        }

        count(): number {
            let result = 0;
            for (const _ of this) result++;
            return result;
        }
    };

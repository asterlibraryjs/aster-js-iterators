import { AsyncQueryMixin } from "./apply-mixins";

export interface IScalarAsyncQueryMixin<T = any> {
    /**
     * Determines whether the specified value is present in the iterable.
     * @param value The value to search for.
     * @param comparer Optional comparer function to customize equality check.
     * @returns A Promise that resolves to a boolean indicating the presence of the specified value.
     */
    includes(value: T, comparer?: (left: T, right: T) => boolean): Promise<boolean>;

    /**
     * Checks if any element in the iterable satisfies the specified predicate.
     * @param predicate Optional predicate function to evaluate elements.
     * @returns A Promise that resolves to a boolean indicating if any element satisfies the predicate.
     */
    hasAny(predicate?: (item: T, rank: number) => Promise<boolean> | boolean): Promise<boolean>;

    /**
     * Checks if all elements in the iterable satisfy the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns A Promise that resolves to a boolean indicating if all elements satisfy the predicate.
     */
    every(predicate: (item: T, rank: number) => Promise<boolean> | boolean): Promise<boolean>;

    /**
     * Retrieves the first element of the iterable.
     * @param fallback The value to return if the iterable is empty.
     * @returns A Promise that resolves to the first element or the specified fallback value.
     */
    first(fallback: T): Promise<T>;

    /**
     * Retrieves the first element of the iterable.
     * @returns A Promise that resolves to the first element or undefined if the iterable is empty.
     */
    first(): Promise<T | undefined>;

    /**
     * Finds the first element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @param fallback The value to return if no matching element is found.
     * @returns A Promise that resolves to the first matching element or the specified fallback value.
     */
    findFirst(predicate: (item: T, rank: number) => Promise<boolean> | boolean, fallback: T): Promise<T>;

    /**
     * Finds the first element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns A Promise that resolves to the first matching element or undefined if no matching element is found.
     */
    findFirst(predicate: (item: T, rank: number) => Promise<boolean> | boolean): Promise<T | undefined>;

    /**
     * Finds the last element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @param fallback The value to return if no matching element is found.
     * @returns A Promise that resolves to the last matching element or the specified fallback value.
     */
    findLast(predicate: (item: T, rank: number) => Promise<boolean> | boolean, fallback: T): Promise<T>;

    /**
     * Finds the last element in the iterable that satisfies the specified predicate.
     * @param predicate Predicate function to evaluate elements.
     * @returns A Promise that resolves to the last matching element or undefined if no matching element is found.
     */
    findLast(predicate: (item: T, rank: number) => Promise<boolean> | boolean): Promise<T | undefined>;

    /**
     * Retrieves the last element of the iterable.
     * @param fallback The value to return if the iterable is empty.
     * @returns A Promise that resolves to the last element or the specified fallback value.
     */
    last(fallback: T): Promise<T>;

    /**
     * Retrieves the last element of the iterable.
     * @returns A Promise that resolves to the last element or undefined if the iterable is empty.
     */
    last(): Promise<T | undefined>;

    /**
     * Reduces the iterable to a single value by applying a reducer function.
     * @param reducer Function to apply to each element in the iterable.
     * @param seed The initial value of the accumulator.
     * @returns A Promise that resolves to the accumulated result.
     */
    reduce<R>(reducer: (previous: R, current: T) => R, seed: R): Promise<R>;

    /** Create a string by concatenating all elements in the iterable. */
    join(separator?: string): Promise<string>;
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

        async join(separator?: string): Promise<string> {
            const allValues = await this.toArray();
            return allValues.join(separator);
        }
    };

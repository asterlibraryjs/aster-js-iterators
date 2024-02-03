import { QueryMixin } from "./apply-mixins";

export interface IActionQueryMixin<T = any> {
    /**
     * Executes the provided callback on each item in the query.
     * @param callback The synchronous callback function to be executed on each item.
     * @returns The current query for method chaining.
     */
    each(callback: (item: any, rank: number) => void): this;

    /**
     * Executes the provided asynchronous callback on each item in the query.
     * @param callback The asynchronous callback function to be executed on each item.
     * @returns A Promise that resolves to the current query after all asynchronous operations are complete.
     */
    eachAsync(callback: (item: any, rank: number) => Promise<void> | void): Promise<this>;
}

export const IActionQueryMixin: QueryMixin = q =>
    class extends q implements IActionQueryMixin {
        each(callback: (item: any, rank: number) => void): this {
            let rank = 0;
            for (const item of this) {
                callback(item, rank++);
            }
            return this;
        }

        async eachAsync(callback: (item: any, rank: number) => Promise<void>): Promise<this> {
            let rank = 0;
            for (const item of this) {
                await callback(item, rank++);
            }
            return this;
        }
    };

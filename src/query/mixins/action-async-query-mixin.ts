import { AsyncQueryMixin } from "./apply-mixins";

export interface IAsyncActionQueryMixin<T = any> {
    /**
     * Executes the provided callback on each item in the query.
     * @param callback - The asynchronous callback function to be executed on each item.
     * @returns A Promise that resolves to the current query after all asynchronous operations are complete.
     */
    each(callback: (item: any, rank: number) => Promise<void> | void): Promise<this>;
}

export const IAsyncActionQueryMixin: AsyncQueryMixin = q =>
    class extends q implements IAsyncActionQueryMixin {
        async each(callback: (item: any, rank: number) => Promise<void> | void): Promise<this> {
            let rank = 0;
            for await (const item of this) {
                await callback(item, rank++);
            }
            return this;
        }
    };

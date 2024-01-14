import { AsyncQueryMixin } from "./apply-mixins";

export interface IAsyncActionQueryMixin<T = any> {
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

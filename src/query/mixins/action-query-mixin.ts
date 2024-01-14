import { QueryMixin } from "./apply-mixins";

export interface IActionQueryMixin<T = any> {
    each(callback: (item: any, rank: number) => void): this;
    eachAsync(callback: (item: any, rank: number) => Promise<void>): Promise<this>;
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

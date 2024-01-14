import { HashFactory, Lookup } from "@aster-js/collections";
import { AsyncQueryMixin } from "./apply-mixins";

export interface ILookupAsyncQueryMixin<T = any> {
    lookup<K, V = T>(keyPredicate: (item: T) => K, hashFactory?: HashFactory<K>, valuePredicate?: (item: T) => V): Promise<Lookup<K, V>>;
}

export const ILookupAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements ILookupAsyncQueryMixin {
       async lookup(keyPredicate: (item: any) => any, hashFactory?: HashFactory<any>, valuePredicate?: (item: any) => any): Promise<Lookup<any, any>> {
            valuePredicate ??= item => item;

            const lookup = new Lookup(hashFactory);
            for await (const item of this) {
                lookup.add(
                    keyPredicate(item),
                    valuePredicate(item)
                );
            }
            return lookup;
        }
    };

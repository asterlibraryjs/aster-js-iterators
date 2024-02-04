import { HashFactory, Lookup } from "@aster-js/collections";
import { AsyncQueryMixin } from "./apply-mixins";

export interface ILookupAsyncQueryMixin<T = any> {
    /**
     * Groups all items into a Lookup map based on the provided key and value predicates.
     * @param keyPredicate The function to extract keys from each item.
     * @param hashFactory Optional hash function for custom key hashing.
     * @param valuePredicate Optional function to extract values associated with each item.
     * @returns A Promise resolving to a Lookup map containing grouped items based on the keys and values.
     */
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

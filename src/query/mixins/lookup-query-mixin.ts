import { HashFactory, Lookup } from "@aster-js/collections";
import { QueryMixin } from "./apply-mixins";

export interface ILookupQueryMixin<T = any> {
    /**
     * Groups all items into a Lookup map based on the provided key and value predicates.
     * @param keyPredicate The function to extract keys from each item.
     * @param hashFactory Optional hash function for custom key hashing.
     * @param valuePredicate Optional function to extract values associated with each item.
     * @returns A Lookup map containing grouped items based on the keys and values.
     */
    lookup<K, V = T>(keyPredicate: (item: T) => K, hashFactory?: HashFactory<K>, valuePredicate?: (item: T) => V): Lookup<K, V>;
}

export const ILookupQueryMixin: QueryMixin = q =>
    class extends q implements ILookupQueryMixin {
        lookup(keyPredicate: (item: any) => any, hashFactory?: HashFactory<any>, valuePredicate?: (item: any) => any): Lookup<any, any> {
            valuePredicate ??= item => item;

            const lookup = new Lookup(hashFactory);
            for (const item of this) {
                lookup.add(
                    keyPredicate(item),
                    valuePredicate(item)
                );
            }
            return lookup;
        }
    };

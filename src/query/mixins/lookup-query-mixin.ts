import { HashFactory, Lookup } from "@aster-js/collections";
import { QueryMixin } from "./apply-mixins";

export interface ILookupQueryMixin<T = any> {
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

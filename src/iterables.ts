import { CallbackIterator } from "./callback-iterator";

export namespace Iterables {

    export function cast<T>(iterable: unknown): iterable is Iterable<T> {
        return typeof iterable === "object" && iterable !== null
            && typeof Reflect.get(iterable, Symbol.iterator) === "function";
    }

    export function create<T>(initialValue: T, nextCallback: (prev: T) => T | undefined): Iterable<T> {
        return {
            [Symbol.iterator]: () => {
                return new CallbackIterator(initialValue, nextCallback);
            }
        };
    }

    export function* filter<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): Iterable<T> {
        for (const item of iterable) if (predicate(item)) yield item;
    }

    export function has<T>(iterable: Iterable<T>, filterPredicate?: (item: T) => boolean): boolean {
        for (const _ of build(iterable, filterPredicate)) return true;
        return false;
    }

    export function first<T>(iterable: Iterable<T>, filterPredicate?: (item: T) => boolean): T | undefined {
        for (const item of build(iterable, filterPredicate)) return item;
    }

    export function last<T>(iterable: Iterable<T>, filterPredicate?: (item: T) => boolean): T | undefined {
        const iterator = build(iterable, filterPredicate);

        let result: T | undefined;
        for (const item of iterator) { result = item; }
        return result;
    }

    function build<T>(iterable: Iterable<T>, filterPredicate?: (item: T) => boolean): Iterable<T> {
        filterPredicate ??= _ => true;
        return filter(iterable, filterPredicate);
    }
}
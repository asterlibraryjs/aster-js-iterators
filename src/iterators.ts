import { CallbackIterator } from "./callback-iterator";

export namespace Iterators {

    export function create<T>(initialValue: T, nextCallback: () => T | undefined): Iterator<T> {
        return new CallbackIterator(initialValue, nextCallback);
    }
}
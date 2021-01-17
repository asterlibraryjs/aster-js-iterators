import { CallbackIterator } from "./callback-iterator";

export namespace Iterators {

    export function create<T>(nextCallback: () => T | undefined): Iterator<T> {
        return new CallbackIterator(nextCallback);
    }
}
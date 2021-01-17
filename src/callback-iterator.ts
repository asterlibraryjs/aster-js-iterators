import { asserts } from "@aster-js/core";

export class CallbackIterator<T> implements Iterator<T> {
    private _nextValue: T | undefined;

    constructor(
        initialValue: T,
        private readonly _nextCallback: (prev: T) => T | undefined
    ) {
        this._nextValue = initialValue;
    }

    next(): IteratorResult<T, T> {
        const value = this._nextValue;
        asserts.defined(value);

        this._nextValue = this._nextCallback(value);

        return { value, done: typeof this._nextValue === undefined };
    }
}

export class CallbackIterator<T> implements Iterator<T> {
    private _nextValue: T | undefined;

    constructor(
        initialValue: T,
        private readonly _nextCallback: (prev: T) => T | undefined
    ) {
        this._nextValue = initialValue;
    }

    next(): IteratorResult<T> {
        const value = this._nextValue;

        if (typeof value === "undefined") {
            return { value, done: true };
        }

        this._nextValue = this._nextCallback(value);
        return { value, done: false };
    }
}
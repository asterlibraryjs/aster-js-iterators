import { ArrayQuery } from "./array-query";
import { AsyncIterableQuery, IterableQuery } from "./iterable-query";
import { AsyncUnionQuery, UnionQuery } from "./union-query";
import { AsyncTransformQuery, TransformQuery } from "./transform-query";
import { Iterables } from "../iterables";

import "./factories";
import "./async-factories";

export type Query<T> = IterableQuery<T> | ArrayQuery<T> | TransformQuery<T> | UnionQuery<T>;
export type AsyncQuery<T> = AsyncIterableQuery<T> | AsyncTransformQuery<T> | AsyncUnionQuery<T>;

/**
 * Creates a new asynchronous query from the provided async iterable.
 * Enables sequential iteration over an asynchronous iterable of elementsand designed to minimize memory usage during iteration.
 * @param iterable The initial async iterable to create the asynchronous query.
 * @param iterables Optional additional async iterables to union with the initial one.
 * @returns An asynchronous query capable of streaming and transforming results.
 */
export function Query<T>(iterable: AsyncIterable<T>, ...iterables: AsyncIterable<T>[]): AsyncQuery<T>;

/**
 * Creates a new synchronous query from the provided iterable.
 * Enables sequential iteration over an iterable of elements and designed to minimize memory usage during iteration.
 * @param iterable The initial iterable to create the query.
 * @param iterables Optional additional iterables to union with the initial one.
 * @returns A query capable of streaming and transforming results.
 */
export function Query<T>(iterable: Iterable<T> | string, ...iterables: Iterable<T>[]): Query<T>;

export function Query<T>(iterable: Iterable<T> | AsyncIterable<T>, ...iterables: Iterable<T>[] | AsyncIterable<T>[]): Query<T> | AsyncQuery<T> {
    if (typeof iterable === "string") return new ArrayQuery(iterable);

    if (Iterables.cast(iterable)) {
        if (iterables.length) {
            return new UnionQuery(iterable, iterables as Iterable<T>[]);
        }
        if (Array.isArray(iterable)) {
            return new ArrayQuery(iterable);
        }
        return new IterableQuery(iterable);
    }

    if (iterables.length) {
        return new AsyncUnionQuery(iterable, iterables as AsyncIterable<T>[]);
    }
    return new AsyncIterableQuery(iterable);
}

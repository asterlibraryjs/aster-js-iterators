import { ArrayQuery } from "./array-query";
import { AsyncIterableQuery, IterableQuery } from "./iterable-query";
import { AsyncUnionQuery, UnionQuery } from "./union-query";
import { AsyncTransformQuery, TransformQuery } from "./transform-query";
import { Iterables } from "../iterables";

import "./factories";
import "./async-factories";

export type Query<T> = IterableQuery<T> | ArrayQuery<T> | TransformQuery<T> | UnionQuery<T>;
export type AsyncQuery<T> = AsyncIterableQuery<T> | AsyncTransformQuery<T> | AsyncUnionQuery<T>;

export function Query<T>(iterable: AsyncIterable<T>, ...iterables: AsyncIterable<T>[]): AsyncQuery<T>;
export function Query<T>(iterable: Iterable<T>, ...iterables: Iterable<T>[]): Query<T>;
export function Query<T>(iterable: Iterable<T> | AsyncIterable<T>, ...iterables: Iterable<T>[] | AsyncIterable<T>[]): Query<T> | AsyncQuery<T> {
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

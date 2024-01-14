import { Constructor } from "@aster-js/core";
import { IAsyncQuery, IQuery } from "../iquery";

export type QueryConstructor = Constructor<IQuery>;

export type AsyncQueryConstructor = Constructor<IAsyncQuery>;

export type QueryMixin = (q: QueryConstructor) => QueryConstructor;

export type AsyncQueryMixin = (q: AsyncQueryConstructor) => AsyncQueryConstructor;

export function QueryMixins(...mixins: AsyncQueryMixin[]): ClassDecorator;
export function QueryMixins(...mixins: QueryMixin[]): ClassDecorator;
export function QueryMixins(...mixins: (QueryMixin | AsyncQueryMixin)[]): ClassDecorator {
    return function (ctor: any) {
        return mixins.reduce((prev, mixin) => mixin(prev), ctor);
    }
}

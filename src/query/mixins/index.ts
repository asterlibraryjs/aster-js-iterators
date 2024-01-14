import { IAsyncActionQueryMixin } from "./action-async-query-mixin";
import { IActionQueryMixin } from "./action-query-mixin";
import { IChunkAsyncQueryMixin } from "./chunk-async-query-mixin";
import { IChunkQueryMixin } from "./chunk-query-mixin";
import { IFilterAsyncQueryMixin } from "./filter-async-query-mixin";
import { IFilterQueryMixin } from "./filter-query-mixin";
import { ILookupAsyncQueryMixin } from "./lookup-async-query-mixin";
import { ILookupQueryMixin } from "./lookup-query-mixin";
import { IMapAsyncQueryMixin } from "./map-async-query-mixin";
import { IMapQueryMixin } from "./map-query-mixin";
import { IScalarAsyncQueryMixin } from "./scalar-async-query-mixin";
import { IScalarQueryMixin } from "./scalar-query-mixin";
import { ISliceAsyncQueryMixin } from "./slice-async-query-mixin";
import { ISliceQueryMixin } from "./slice-query-mixin";
import { ISortAsyncQueryMixin } from "./sort-async-query-mixin";
import { ISortQueryMixin } from "./sort-query-mixin";
import { IUnionAsyncQueryMixin } from "./union-async-query-mixin";
import { IUnionQueryMixin } from "./union-query-mixin";

export * from "./apply-mixins";
export * from "./filter-query-mixin";
export * from "./scalar-query-mixin";
export * from "./slice-query-mixin";
export * from "./lookup-query-mixin";

export interface IIterableMixins<T> extends
    IActionQueryMixin<T>,
    IFilterQueryMixin<T>,
    IMapQueryMixin<T>,
    IScalarQueryMixin<T>,
    ILookupQueryMixin<T>,
    ISliceQueryMixin<T>,
    IChunkQueryMixin<T>,
    IUnionQueryMixin<T>,
    ISortQueryMixin<T> { }

export const IIterableMixins = [
    IActionQueryMixin,
    IFilterQueryMixin,
    IMapQueryMixin,
    IScalarQueryMixin,
    ILookupQueryMixin,
    ISliceQueryMixin,
    IChunkQueryMixin,
    IUnionQueryMixin,
    ISortQueryMixin
];

export interface IAsyncIterableMixins<T> extends
    IAsyncActionQueryMixin<T>,
    IFilterAsyncQueryMixin<T>,
    IMapAsyncQueryMixin<T>,
    IChunkAsyncQueryMixin<T>,
    IScalarAsyncQueryMixin<T>,
    ILookupAsyncQueryMixin<T>,
    ISliceAsyncQueryMixin<T>,
    IUnionAsyncQueryMixin<T>,
    ISortAsyncQueryMixin<T> { }

export const IAsyncIterableMixins = [
    IAsyncActionQueryMixin,
    IFilterAsyncQueryMixin,
    IMapAsyncQueryMixin,
    IChunkAsyncQueryMixin,
    IScalarAsyncQueryMixin,
    ILookupAsyncQueryMixin,
    ISliceAsyncQueryMixin,
    IUnionAsyncQueryMixin,
    ISortAsyncQueryMixin
];

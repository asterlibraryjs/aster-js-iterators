
import { AsyncTransformDelegate, IAsyncQuery } from "../iquery";
import { AsyncQueryMixin } from "./apply-mixins";

export interface IChunkAsyncQueryMixin<T = any> {
    /**
     * Creates chunks of items using the maximum provided size.
     * @param chunkSize The maximum size of each chunk.
     * @returns An asynchronous query containing arrays of items grouped into chunks.
     */
    chunk(chunkSize: number): IAsyncQuery<T[]>;
}

export const IChunkAsyncQueryMixin: AsyncQueryMixin = q =>
    class extends q implements IChunkAsyncQueryMixin {
        chunk(chunkSize: number): IAsyncQuery {
            const callback = createFilterCallback(chunkSize);
            return this.transformAsync(callback);
        }
    };

function createFilterCallback(chunkSize: number): AsyncTransformDelegate {
    return async function* (src: AsyncIterable<any>) {
        const buffer = Array(chunkSize);
        let idx = 0;
        for await (const item of src) {
            buffer[idx] = item;
            if (++idx === chunkSize) {
                idx = 0;
                yield buffer.slice(0);
            }
        }
        if (idx) {
            yield buffer.slice(0, idx);
        }
    }
}

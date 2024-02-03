import { IQuery, TransformDelegate } from "../iquery";
import { QueryMixin } from "./apply-mixins";

export interface IChunkQueryMixin<T = any> {
   /**
     * Creates chunks of items using the maximum provided size.
     * @param batchSize - The maximum size of each chunk.
     * @returns A query containing arrays of items grouped into chunks.
     */
    chunk(batchSize: number): IQuery<T[]>;
}

export const IChunkQueryMixin: QueryMixin = q =>
    class extends q implements IChunkQueryMixin {
        chunk(chunkSize: number): IQuery {
            const callback = createFilterCallback(chunkSize);
            return this.transform(callback);
        }
    };

function createFilterCallback(chunkSize: number): TransformDelegate {
    return function* (src: Iterable<any>) {
        const buffer = Array(chunkSize);
        let idx = 0;
        for (const item of src) {
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

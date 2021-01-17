export type DependencyResolver<T> = (node: T) => Iterable<T>;

export class TopologicalIterator<T> implements Iterator<T> {
    private readonly _resolveds: Set<T>;
    private readonly _remaings: Map<T, T[]>;

    constructor(
        private readonly _src: Iterable<T>,
        private readonly _resolver: DependencyResolver<T>
    ) {
        this._resolveds = new Set<T>();
        this._remaings = new Map(
            [...this._src].map(item => [item, [...this._resolver(item)]])
        );
    }

    next(): IteratorResult<T> {
        if (!this._remaings.size) return { done: true, value: void 0 };

        for (let [node, deps] of this._remaings) {

            if (deps.every(d => this._resolveds.has(d))) {
                this._remaings.delete(node);
                this._resolveds.add(node);
                return { value: node };
            }

        }

        throw new Error(`Cyclic dependencies: Cannot resolve the provided dependency graph.`);
    }
}
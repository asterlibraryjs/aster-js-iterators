import { HashFactory, HashMap, HashSet } from "@aster-js/collections";

export type DependencyResolver<T> = (node: T) => Iterable<T>;

export class TopologicalIterator<T> implements Iterator<T> {
    private readonly _resolveds: HashSet<T>;
    private readonly _remaings: HashMap<T, T[]>;
    private readonly _hashFactory: HashFactory<T>;

    constructor(
        src: Iterable<T>,
        private readonly _resolver: DependencyResolver<T>,
        hashFactory?: HashFactory<T>
    ) {
        this._hashFactory = hashFactory ?? (x => x);
        this._resolveds = new HashSet<T>(this._hashFactory);
        this._remaings = new HashMap(
            this._hashFactory,
            [...src].map(item => [item, [...this._resolver(item)]])
        );
    }

    next(): IteratorResult<T> {
        if (!this._remaings.size) return { value: void 0, done: true };

        for (let [node, deps] of this._remaings) {

            if (deps.every(d => this._resolveds.has(d) || this._hashFactory(d) === this._hashFactory(node))) {
                this._remaings.delete(node);
                this._resolveds.add(node);
                return { value: node, done: false };
            }
        }

        throw new Error(`Cyclic dependencies: Cannot resolve the provided dependency graph.`);
    }
}
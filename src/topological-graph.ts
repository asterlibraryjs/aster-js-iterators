import { HashFactory, HashMap, HashSet } from "@aster-js/collections";
import { TopologicalIterator } from "./topological-iterator";

export class TopologicalGraph<T> implements Iterable<T>{
    private readonly _nodes: HashMap<T, HashSet<T>>;

    constructor(
        private readonly _hashFactory?: HashFactory<T>
    ) {
        this._nodes = new HashMap<T, HashSet<T>>(_hashFactory);
    }

    has(node: T): boolean {
        return this._nodes.has(node);
    }

    *get(node: T): IterableIterator<T> {
        let deps = this._nodes.get(node);
        if (deps) yield* deps;
    }

    add(node: T, ...dependencies: T[]): void {
        let deps = this._nodes.get(node);
        if (deps) {
            for (let dep of dependencies) deps.add(dep);
        }
        else {
            this._nodes.set(
                node,
                new HashSet(this._hashFactory, dependencies)
            );
        }
    }

    delete(node: T): boolean {
        return this._nodes.delete(node);
    }

    clear(): void {
        this._nodes.clear();
    }

    *nodes(): IterableIterator<T> {
        const keys = [...this._nodes.keys()];
        const results = new HashSet(this._hashFactory, keys);

        // Nodes without dependencies are returned first
        for (const values of this._nodes.values()) {
            for (const dep of values) {
                if (!results.has(dep)) {
                    results.add(dep);
                    yield dep;
                }
            }
        }
        // Last added supposedly have less dependencies
        yield* keys.reverse();
    }

    [Symbol.iterator](): Iterator<T> {
        return new TopologicalIterator(this.nodes(), n => this.get(n), this._hashFactory);
    }
}
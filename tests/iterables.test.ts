import { assert } from "chai";
import { Iterables } from "../src";

describe("Iterables", () => {

    function* it1(): Iterable<number> {
        yield 3;
        yield 1;
        yield 2;
    }

    it("Should cast properly an iterable", async () => {
        const value = <any>it1();

        assert.isTrue(Iterables.cast(value));
    });

    it("Should cast properly an array", async () => {
        const value = <any>[];

        assert.isTrue(Iterables.cast(value));
    });

    it("Should cast properly an NodeList", async () => {
        const value = <any>document.body.childNodes;

        assert.isTrue(Iterables.cast(value));
    });

    it("Should get the first item of an array", async () => {
        const value = it1();

        assert.equal(Iterables.first(value), 3);
    });

    it("Should get the first item of an array", async () => {
        const value = [22, 55];

        assert.equal(Iterables.first(value), 22);
    });

    it("Should get the last item of an iterable", async () => {
        const value = it1();

        assert.equal(Iterables.last(value), 2);
    });

    it("Should get the last item of an array", async () => {
        const value = [22, 55];

        assert.equal(Iterables.last(value), 55);
    });

    it("Should get the first item of an filtered iterable", async () => {
        const value = it1();

        assert.equal(Iterables.first(value, val => val !== 3), 1);
    });

    it("Should get the last item of an filtered iterable", async () => {
        const value = it1();

        assert.equal(Iterables.last(value, val => val !== 2), 1);
    });

    it("Should create a new iterable from a basic tree", async () => {
        type Node = { id: number, parent?: Node };
        const node: Node = { id: 0, parent: { id: 1, parent: { id: 2, parent: { id: 3 } } } }
        const value = Iterables.create(node, n => n.parent);

        const result = [...value].map(n => n.id);
        assert.deepEqual(result, [0, 1, 2, 3]);
    });

});

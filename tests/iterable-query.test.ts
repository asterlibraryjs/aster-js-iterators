import { assert } from "chai";
import { Query } from "../src/query";
import { ArrayOfCattle, ArrayOfInt, ArrayOfZer0 } from "./data";

describe("Query", () => {
    it("Should get the first element", () => {
        const value = Query<string>([]).first("0");

        assert.equal(value, "0");
    });

    it("Should batch properly an array of number", () => {
        const value = [...Query(ArrayOfZer0).chunk(10)];

        const expected = Array<number[]>(10).fill(Array<number>(10).fill(0));
        expected.push(Array<number>(5).fill(0));

        assert.deepEqual(value, expected);
    });

    it("Should chunk properly an array of number and get the first batch", () => {
        const value = [...Query(ArrayOfZer0).chunk(10).first([])];

        const expected = Array<number>(10).fill(0);

        assert.deepEqual(value, expected);
    });

    it("Should get a slice of records", () => {
        const value = [...Query(ArrayOfZer0).chunk(10).first([])];

        const expected = Array<number>(10).fill(0);

        assert.deepEqual(value, expected);
    });

    it("Should skip values while under 8", () => {
        var q = Query(ArrayOfInt)
            .skipWhile(x => x < 8);
        const value = [...q];

        const expected = [8, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

        assert.deepEqual(value, expected);
    });


    it("Should take values while under 8", () => {
        var q = Query(ArrayOfInt)
            .takeWhile(x => x < 8);
        const value = [...q];

        const expected = [0, 1, 2, 3, 4, 5, 6, 7];

        assert.deepEqual(value, expected);
    });

    it("Should group animals in 2 groups", () => {
        var q = Query(ArrayOfCattle)
            .lookup(x => x.value, undefined, x => x.id);
        const value = [...q];

        const expected = [["cow", [122, 46541, 4954]], ["bull", [78112, 45634]]];

        assert.deepEqual(value, expected);
    });

    it("Should sort animals", async () => {
        var q = Query(ArrayOfCattle)
            .sortBy(x => x.id)
            .map(x => x.id);

        const expected = [122, 4954, 45634, 46541, 78112];

        assert.deepEqual([...q], expected);
    });

    it("Should surround with a value", async () => {
        var q = Query<number>(ArrayOfInt)
            .surround(44);

        const expected = [44, ...ArrayOfInt, 44];

        assert.deepEqual([...q], expected);
    });

    it("Should surround with multiple values", async () => {
        var q = Query<number>(ArrayOfInt)
            .surround(44)
            .surround(10, 20);

        const expected = [10, 44, ...ArrayOfInt, 44, 20];

        assert.deepEqual([...q], expected);
    });

});

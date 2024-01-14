import { assert } from "chai";
import { Query } from "../src/query";
import { asAsyncIterable, AsyncIterableOfCattle, AsyncIterableOfInt, AsyncIterableOfZer0 } from "./data";

describe("AsyncQuery", () => {
    it("Should get the first element", async () => {
        const value = await Query<string>(asAsyncIterable([])).first("0");

        assert.equal(value, "0");
    });

    it("Should batch properly an array of number", async () => {
        const value = await Query(AsyncIterableOfZer0()).chunk(10).toArray();

        const expected = Array<number[]>(10).fill(Array<number>(10).fill(0));
        expected.push(Array<number>(5).fill(0));

        assert.deepEqual(value, expected);
    });

    it("Should chunk properly an array of number and get the first batch", async () => {
        const value = await Query(AsyncIterableOfZer0()).chunk(10).first([]);

        const expected = Array<number>(10).fill(0);

        assert.deepEqual(value, expected);
    });

    it("Should get a slice of records", async () => {
        const value = await Query(AsyncIterableOfZer0()).chunk(10).first([]);

        const expected = Array<number>(10).fill(0);

        assert.deepEqual(value, expected);
    });

    it("Should skip values while under 8", async () => {
        var q = await Query(AsyncIterableOfInt())
            .skipWhile(x => x < 8)
            .toArray();
        const value = [...q];

        const expected = [8, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

        assert.deepEqual(value, expected);
    });

    it("Should take values while under 8", async () => {
        var q = await Query(AsyncIterableOfInt())
            .takeWhile(x => x < 8)
            .toArray();
        const value = [...q];

        const expected = [0, 1, 2, 3, 4, 5, 6, 7];

        assert.deepEqual(value, expected);
    });

    it("Should group animals in 2 groups", async () => {
        var q = await Query(AsyncIterableOfCattle())
            .lookup(x => x.value, undefined, x => x.id);
        const value = [...q];

        const expected: [any, any[]][] = [["cow", [122, 46541, 4954]], ["bull", [78112, 45634]]];

        assert.deepEqual(value, expected);
    });

    it("Should sort animals", async () => {
        var q = await Query(AsyncIterableOfCattle())
            .sortBy(x => x.id)
            .map(x => x.id)
            .toArray();

        const expected = [122, 4954, 45634, 46541, 78112];

        assert.deepEqual(q, expected);
    });

});

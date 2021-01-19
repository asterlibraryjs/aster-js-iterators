import { assert } from "chai";
import { TopologicalGraph } from "../src";

describe("TopologicalGraph", () => {

    it("Should cast properly an iterable", async () => {
        const graph =  new TopologicalGraph<string>();

        graph.add("top1", "middle1", "bottom1")
        graph.add("middle1", "bottom1", "bottom2")

        assert.deepEqual([...graph], ["bottom1", "bottom2", "middle1", "top1"]);
    });

});

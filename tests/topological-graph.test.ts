import { assert } from "chai";
import { TopologicalGraph } from "../src";

describe("TopologicalGraph", () => {

    it("Should cast properly an iterable", async () => {
        const graph = new TopologicalGraph<string>();

        graph.add("top1", "middle1", "bottom1");
        graph.add("middle1", "bottom1", "bottom2");

        assert.deepEqual([...graph], ["bottom1", "bottom2", "middle1", "top1"]);
    });

    it("Should cast properly an iterable", async () => {
        const graph = new TopologicalGraph<{ key: string }>(x => x.key);

        graph.add({ key: "solo" });
        graph.add({ key: "top1" }, { key: "middle1" }, { key: "bottom1" }, { key: "solo" });
        graph.add({ key: "middle1" }, { key: "bottom1" }, { key: "bottom2" });

        assert.deepEqual([...graph].map(x => x.key), [ "bottom1", "bottom2", "middle1", "solo", "top1"]);
    });

});

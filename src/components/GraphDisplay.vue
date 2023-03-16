<script setup lang="ts">
import { defineComponent } from "vue";
import { Graph } from "./graph";
import { CanvasRenderer } from "./GraphCanvas";
</script>
<template>
  <div id="graphView">
    <canvas id="graphCanvas" ref="graphCanvas" @click=""></canvas>
    <input type="checkbox" @click="toggleEdgeMode" />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: "Graph",
  props: { graph: Graph, graphRenderer: CanvasRenderer },
  mounted() {
    const graphCanvasRef = <HTMLCanvasElement>this.$refs.graphCanvas;
    const edgeToggle = <HTMLInputElement>this.$refs.edgeMode;
    console.log();
    const graphRenderer = new CanvasRenderer(graphCanvasRef);
    const graph = new Graph(graphRenderer);
    graph.addVertice({ position: { x: 10, y: 10 } });
    graph.addVertice({ position: { x: 30, y: 30 } });
    graph.addVertice({ position: { x: 50, y: 50 } });
    graph.addVertice({ position: { x: 100, y: 50 } });
    graph.addEdge(1, 2, 4);
    graph.addEdge(1, 4, 5);

    const path = graph.traverse(2, 4);
    console.log(path);
    graphCanvasRef.onclick = (ev) => {
      const position = {
        x: ev.offsetX / 2,
        y: ev.offsetY / 2,
      };
      graph.addVertice({ position });
      console.log(graph);
      graphCanvasRef.onclick = (ev) => {
        const position = {
          x: ev.offsetX / 2,
          y: ev.offsetY / 2,
        };
        graph.addVertice({ position });
        console.log(graph);
      };
    };
  },
  methods: {
    canvasClick() {},
    toggleEdgeMode() {},
  },
});
</script>
<style scoped>
#graphCanvas {
  width: 600px;
  height: 300px;
  border: solid 1px black;
  aspect-ratio: auto 300 / 150;
}
</style>

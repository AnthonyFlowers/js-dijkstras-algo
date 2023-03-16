<script setup lang="ts">
import { defineComponent } from "vue";
import { Graph, Edge, Position, Vertice } from "./graph";
</script>
<template>
  <div id="graphView">
    <canvas id="graphCanvas" ref="graphCanvas" @click="graphClick"></canvas>
    <input type="checkbox" ref="edgeMode" />
    <button @click="traverse">Traverse</button>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: "GraphDisplay",
  data() {
    return {
      graphCanvasRef: <HTMLCanvasElement>this.$refs.graphCanvas,
      graph: new Graph(),
      edgeToggle: <HTMLInputElement>this.$refs.edgeMode,
      selectedPoint: null as Vertice | null,
    };
  },
  methods: {
    clear() {},
    addVertice(position: Position) {
      this.graph.addVertice(position);
    },
    graphClick(ev: MouseEvent) {
      const canvas = <HTMLCanvasElement>ev.target;
      const position = {
        x: ev.offsetX / 2,
        y: ev.offsetY / 2,
      };
      const foundPoint = this.graph.pointExists(position);
      if (this.selectedPoint && foundPoint) {
        const edge = this.graph.addEdge(
          this.selectedPoint.id,
          foundPoint.id,
          5
        );
        this.drawEdge(edge, canvas);
      }
      if (foundPoint) {
        this.selectedPoint = foundPoint;
        console.log("exists", this.selectedPoint);
      } else {
        this.graph.addVertice(position);
        this.drawVertice(position, canvas);
        console.log(this.graph);
      }
    },
    drawVertice(position: Position, canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(position.x, position.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    },
    drawEdge(edge: Edge, canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(edge.verticeOne.position.x, edge.verticeOne.position.y);
      ctx.lineTo(edge.verticeTwo.position.x, edge.verticeTwo.position.y);
      ctx.stroke();
      ctx.closePath();
    },
    traverse() {
      const path = this.graph.traverse(1, 2);
      console.log(path);
    },
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

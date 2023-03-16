<script setup lang="ts">
import { defineComponent } from "vue";
import { Graph, Edge, Position, Vertex } from "./graph";
</script>
<template>
  <div id="graphView">
    <canvas id="graphCanvas" ref="graphCanvas" @click="graphClick"></canvas>
    <label>Edge Length: </label>
    <input type="number" ref="edgeLength" :value="1" />
    <button @click="traverse">Traverse</button>
    <button @click="redraw">Redraw</button>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: "GraphDisplay",
  data() {
    return {
      graph: new Graph(),
      selectedPoint: null as Vertex | null,
      drawingProperties: {
        vertexSize: 10,
        selectedVertexColor: "#f0f",
        vertexColor: "#f00",
        edgeColor: "#fff",
        textColor: "#000",
        textFont: "18px serif",
      },
    };
  },
  methods: {
    redraw() {
      const ctx = this.canvasContext;
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.graph.getEdges().forEach((e) => this.drawEdge(e));
      this.graph.getVerticies().forEach((v) => this.drawvertex(v));
    },
    graphClick(ev: MouseEvent) {
      const position = {
        x: ev.offsetX / 2,
        y: ev.offsetY / 2,
      };
      const foundPoint = this.graph.pointExists(position);
      if (this.selectedPoint && foundPoint) {
        this.handleAddRemoveEdge(this.selectedPoint, foundPoint);
      } else if (foundPoint) {
        this.selectedPoint = foundPoint;
        this.redraw();
      } else {
        this.graph.addvertex(position);
        console.log(this.graph);
        this.selectedPoint = null;
      }
      this.redraw();
    },
    handleAddRemoveEdge(selectedPoint: Vertex, foundPoint: Vertex) {
      if (selectedPoint === foundPoint) {
        console.log("deselect");
        this.selectedPoint = null;
        return;
      }
      const existingEdge = this.graph.edgeExists(
        selectedPoint.id,
        foundPoint.id
      );
      if (existingEdge) {
        this.graph.removeEdge(existingEdge);
        this.redraw();
      } else {
        const edgeLength = parseInt(
          (<HTMLInputElement>this.$refs.edgeLength).value
        );
        const edge = this.graph.addEdge(
          selectedPoint.id,
          foundPoint.id,
          edgeLength
        );
        this.drawEdge(edge);
      }
      this.selectedPoint = null;
      this.redraw();
    },
    drawvertex(vertex: Vertex) {
      const ctx = this.canvasContext;
      if (!ctx) return;
      const x = vertex.position.x;
      const y = vertex.position.y;
      ctx.beginPath();
      ctx.fillStyle =
        this.selectedPoint?.id === vertex.id
          ? this.drawingProperties.selectedVertexColor
          : this.drawingProperties.vertexColor;
      ctx.arc(x, y, this.drawingProperties.vertexSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = this.drawingProperties.textColor;
      ctx.font = this.drawingProperties.textFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(vertex.id.toString(), x, y);
    },
    drawEdge(edge: Edge) {
      const ctx = this.canvasContext;
      if (!ctx) return;
      ctx.fillStyle = this.drawingProperties.edgeColor;
      ctx.beginPath();
      ctx.moveTo(edge.vertexOne.position.x, edge.vertexOne.position.y);
      ctx.lineTo(edge.vertexTwo.position.x, edge.vertexTwo.position.y);
      ctx.stroke();
      ctx.closePath();
    },
    traverse() {
      const path = this.graph.traverse(1, 2);
      console.log(path);
    },
  },
  computed: {
    canvasContext() {
      return (<HTMLCanvasElement>this.$refs.graphCanvas).getContext("2d");
    },
  },
});
</script>
<style scoped>
#graphCanvas {
  width: 600px;
  height: 300px;
  border: solid 1px black;
  display: block;
  aspect-ratio: auto 300 / 150;
}
</style>

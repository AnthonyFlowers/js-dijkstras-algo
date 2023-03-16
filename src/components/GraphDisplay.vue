<script setup lang="ts">
import { defineComponent } from "vue";
import { Graph, Edge, Position, Vertex } from "./graph";
</script>
<template>
  <div id="graphView">
    <canvas
      id="graphCanvas"
      ref="graphCanvas"
      width="600"
      height="300"
      @click="graphClick"
    ></canvas>
    <div>
      <label>Edge Length: </label>
      <input type="number" ref="edgeLength" value="1" />
    </div>
    <div class="algorithProps">
      <label>From: </label>
      <input type="number" ref="startNode" value="1" min="1" />
      <label>To: </label>
      <input type="number" ref="endNode" value="1" min="1" />
      <button @click="traverse">Run Algorithm</button>
    </div>
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
        vertexSize: 20,
        selectedVertexColor: "#f0f",
        vertexColor: "#f00",
        edgeColor: "#fff",
        textColor: "#000",
        textFont: "18px serif",
        edgeTextFont: "12px serif",
      },
    };
  },
  methods: {
    redraw(ctx: CanvasRenderingContext2D | null) {
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.graph.getEdges().forEach((e) => this.drawEdge(e, ctx));
      this.graph.getVerticies().forEach((v) => this.drawvertex(v, ctx));
    },
    graphClick(ev: MouseEvent) {
      const ctx = this.canvasContext;
      const position = {
        x: ev.offsetX,
        y: ev.offsetY,
      };
      const foundPoint = this.graph.pointExists(position);
      if (this.selectedPoint && foundPoint) {
        this.handleAddRemoveEdge(this.selectedPoint, foundPoint, ctx);
      } else if (foundPoint) {
        this.selectedPoint = foundPoint;
        (<HTMLInputElement>this.$refs.edgeLength).select();
      } else {
        this.graph.addvertex(position);
        this.selectedPoint = null;
      }
      this.redraw(ctx);
    },
    handleAddRemoveEdge(
      selectedPoint: Vertex,
      foundPoint: Vertex,
      ctx: CanvasRenderingContext2D | null
    ) {
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
      } else {
        const edgeLength = parseInt(
          (<HTMLInputElement>this.$refs.edgeLength).value
        );
        const edge = this.graph.addEdge(
          selectedPoint.id,
          foundPoint.id,
          edgeLength
        );
      }
      this.selectedPoint = null;
    },
    drawvertex(vertex: Vertex, ctx: CanvasRenderingContext2D) {
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
    drawEdge(edge: Edge, ctx: CanvasRenderingContext2D | null) {
      if (!ctx) return;
      ctx.fillStyle = this.drawingProperties.edgeColor;
      ctx.beginPath();
      ctx.moveTo(edge.vertexOne.position.x, edge.vertexOne.position.y);
      ctx.lineTo(edge.vertexTwo.position.x, edge.vertexTwo.position.y);
      ctx.stroke();
      const textPositionX =
        (edge.vertexOne.position.x + edge.vertexTwo.position.x) / 2;
      const textPositionY =
        (edge.vertexOne.position.y + edge.vertexTwo.position.y) / 2;
      console.log(textPositionX, textPositionY);
      ctx.font = this.drawingProperties.edgeTextFont;
      ctx.strokeText(edge.distance.toString(), textPositionX, textPositionY);
      ctx.closePath();
    },
    traverse() {
      const start = parseInt((<HTMLInputElement>this.$refs.startNode).value);
      const end = parseInt((<HTMLInputElement>this.$refs.endNode).value);

      console.log(start, end);
      const path = this.graph.traverse(start, end);
      console.log(path);
    },
    drawPath(ctx: CanvasRenderingContext2D) {},
  },
  computed: {
    nodesToFindPath() {
      return {
        startNode: parseInt((<HTMLInputElement>this.$refs.startNode).value),
        endNode: parseInt((<HTMLInputElement>this.$refs.endNode).value),
      };
    },
    canvasContext() {
      return (<HTMLCanvasElement>this.$refs.graphCanvas).getContext("2d");
    },
  },
});
</script>
<style scoped>
#graphView > * {
  margin-bottom: 8px;
}
#graphCanvas {
  /* width: 600px;
  height: 300px; */
  border: solid 1px black;
  display: block;
}
.algorithProps > * {
  margin-right: 5px;
}
</style>

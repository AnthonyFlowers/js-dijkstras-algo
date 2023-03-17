<script setup lang="ts">
import { defineComponent } from "vue";
import { Graph, Vertex, Result } from "./graph";
import { Edge } from "./edge";
</script>
<template>
  <main>
    <div v-if="textVisibility">
      <h1>Dijkstra's algorithm</h1>
      <p>
        This app is a "simple" implementation of Dijkstra's algorithm to find
        the shortest path between two nodes on a graph.
      </p>
      <h2>Instructions</h2>
      <p>
        Click on the canvas below to add points to the graph. After adding
        multiple points, click on a point to select it and click another to draw
        an edge between them. The input below the canvas can be used to change
        the edge length. The two inputs below the edge length input are used to
        set the start and end node for the algorithm.
      </p>
      <p>
        Clicking the "Run Algorithm" button will execute the algorithm and
        update the graph to show the path taken from one point to the other.
      </p>
      <button @click="() => (textVisibility = false)">Hide Intro</button>
    </div>
    <div v-else>
      <button @click="() => (textVisibility = true)">Show Intro</button>
    </div>
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
        <input
          type="number"
          v-model.number="edgeLength"
          ref="edgeLengthInput"
        />
      </div>
      <div class="algorith-props">
        <label>From: </label>
        <input v-model.number="startNode" type="number" min="0" />
        <label>To: </label>
        <input v-model.number="endNode" type="number" min="0" />
        <button @click="traverse">Run Algorithm</button>
      </div>
      <div class="algo-path" v-if="result.path.length">
        <div>
          <div>Node</div>
          <div>Distance</div>
          <div>Node</div>
        </div>
        <div v-for="edge in result.path">
          <div>{{ edge.vertexOne.id }}</div>
          <div>{{ edge.distance }}</div>
          <div>{{ edge.vertexTwo.id }}</div>
        </div>
        <div>Total Distance: {{ result.distance }}</div>
      </div>
      <div class="error-msgs" v-if="errors.length">
        <p>There was an error:</p>
        <p v-for="e of errors">{{ e }}</p>
      </div>
    </div>
  </main>
</template>
<script lang="ts">
export default defineComponent({
  name: "GraphDisplay",
  data() {
    return {
      textVisibility: true,
      graph: new Graph(),
      selectedPoint: null as Vertex | null,
      drawingProperties: {
        vertexSize: 20,
        selectedVertexColor: "#f0f",
        vertexColor: "#f00",
        resultVertexColor: "#0b0",
        resultEdgeColor: "blue",
        edgeColor: "#000",
        textColor: "#1e1e1e",
        textFont: "18px serif",
        edgeTextFont: "12px serif",
      },
      startNode: 0,
      endNode: 0,
      edgeLength: 1,
      result: { path: [], distance: 0 } as Result,
      errors: [] as string[],
    };
  },
  methods: {
    redraw(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.graph.getEdges().forEach((e) => this.drawEdge(e, ctx));
      this.graph.getVerticies().forEach((v) => this.drawvertex(v, ctx));
    },
    graphClick(ev: MouseEvent) {
      const ctx = this.canvasContext;
      this.result = { path: [], distance: 0 };
      const position = {
        x: ev.offsetX,
        y: ev.offsetY,
      };
      const foundPoint = this.graph.pointExists(position);
      if (this.selectedPoint && foundPoint) {
        this.handleAddRemoveEdge(this.selectedPoint, foundPoint);
      } else if (foundPoint) {
        this.selectedPoint = foundPoint;
        (<HTMLInputElement>this.$refs.edgeLengthInput).select();
      } else {
        this.graph.addvertex(position);
        this.selectedPoint = null;
      }
      this.redraw(ctx);
    },
    handleAddRemoveEdge(selectedPoint: Vertex, foundPoint: Vertex) {
      if (selectedPoint === foundPoint) {
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
        this.graph.addEdge(selectedPoint.id, foundPoint.id, this.edgeLength);
      }
      this.selectedPoint = null;
    },
    drawvertex(vertex: Vertex, ctx: CanvasRenderingContext2D) {
      const x = vertex.position.x;
      const y = vertex.position.y;
      ctx.beginPath();
      ctx.fillStyle = this.vertexColor(vertex);
      ctx.arc(x, y, this.drawingProperties.vertexSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = this.drawingProperties.textColor;
      ctx.font = this.drawingProperties.textFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(vertex.id.toString(), x, y);
    },
    drawEdge(edge: Edge, ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.strokeStyle = this.edgeColor(edge);
      ctx.moveTo(edge.vertexOne.position.x, edge.vertexOne.position.y);
      ctx.lineTo(edge.vertexTwo.position.x, edge.vertexTwo.position.y);
      ctx.stroke();
      ctx.closePath();
      this.drawEdgeDistance(edge, ctx);
    },
    drawEdgeDistance(edge: Edge, ctx: CanvasRenderingContext2D) {
      let { x: textPositionX, y: textPositionY } = edge.midPoint();
      const { xDiff, yDiff } = edge.diffs();
      if (xDiff > yDiff) textPositionY -= 20;
      else textPositionX -= 20;
      ctx.font = this.drawingProperties.edgeTextFont;
      ctx.strokeText(edge.distance.toString(), textPositionX, textPositionY);
    },
    traverse() {
      this.errors = [];
      const ctx = this.canvasContext;
      try {
        const path = this.graph.traverse(this.startNode, this.endNode);
        this.result = path;
        this.redraw(ctx);
      } catch (e) {
        if (e instanceof Error) {
          this.errors = [e.message];
        }
        this.result.path = [];
        this.redraw(ctx);
        console.error(e);
      }
    },
    vertexColor(vertex: Vertex): string {
      if (this.selectedPoint?.id === vertex.id) {
        return this.drawingProperties.selectedVertexColor;
      } else if (
        this.result?.path.find(
          (e) => e.vertexOne.id === vertex.id || e.vertexTwo.id === vertex.id
        )
      ) {
        return this.drawingProperties.resultVertexColor;
      } else {
        return this.drawingProperties.vertexColor;
      }
    },
    edgeColor(edge: Edge): string {
      if (this.result.path.find((e) => e.equals(edge))) {
        return this.drawingProperties.resultEdgeColor;
      }
      return this.drawingProperties.edgeColor;
    },
  },
  computed: {
    canvasContext() {
      return (<HTMLCanvasElement>this.$refs.graphCanvas).getContext("2d")!;
    },
  },
});
</script>
<style scoped>
main div {
  max-width: 600px;
  margin-bottom: 5px;
}
#graphView > * {
  margin-bottom: 8px;
}
#graphCanvas {
  border: solid 1px black;
  display: block;
}
.algorith-props > * {
  margin-right: 5px;
}
.algo-path div {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.algo-path > * {
  text-align: center;
}
.error-msgs {
  color: red;
}
.error-msgs p {
  margin-block: 5px;
}
</style>

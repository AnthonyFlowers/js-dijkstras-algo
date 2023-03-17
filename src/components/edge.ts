import { Vertex } from "./graph";

export class Edge {
  vertexOne = {} as Vertex;
  vertexTwo = {} as Vertex;
  distance = Number.MAX_SAFE_INTEGER;
  constructor(vertexOne: Vertex, vertexTwo: Vertex, distance: number) {
    this.vertexOne = vertexOne;
    this.vertexTwo = vertexTwo;
    this.distance = distance;
  }
  midPoint(): { x: number; y: number } {
    return {
      x: (this.vertexOne.position.x + this.vertexTwo.position.x) / 2,
      y: (this.vertexOne.position.y + this.vertexTwo.position.y) / 2,
    };
  }
  diffs(): { xDiff: number; yDiff: number } {
    return {
      xDiff: Math.abs(this.vertexOne.position.x - this.vertexTwo.position.x),
      yDiff: Math.abs(this.vertexOne.position.y - this.vertexTwo.position.y),
    };
  }
  equals(o: Edge): boolean {
    return (
      (this.vertexOne.id === o.vertexOne.id &&
        this.vertexTwo.id === o.vertexTwo.id) ||
      (this.vertexOne.id == o.vertexTwo.id &&
        this.vertexTwo.id === o.vertexOne.id)
    );
  }
}

import _ from "lodash";
export interface Edge {
  vertexOne: Vertex;
  vertexTwo: Vertex;
  distance: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Vertex {
  id: number;
  distance: number;
  position: Position;
}

export class Graph {
  private path: Edge[];
  private verticies: Vertex[];
  private edges: Edge[];
  private minPointDistance: number;
  constructor() {
    this.path = [];
    this.verticies = [];
    this.edges = [];
    this.minPointDistance = 60;
  }
  public addvertex(position: Position): Vertex {
    const newvertex = {
      id: this.getNextvertexId(),
      distance: Number.MAX_SAFE_INTEGER,
      position: position,
    };
    this.verticies.push(newvertex);
    return newvertex;
  }
  public addEdge(vertexOneId: number, vertexTwoId: number, distance: number) {
    const vertexOne = this.getvertex(vertexOneId);
    const vertexTwo = this.getvertex(vertexTwoId);
    const newEdge = {
      vertexOne,
      vertexTwo,
      distance,
    };
    this.edges.push(newEdge);
    return newEdge;
  }
  public removeEdge(edge: Edge) {
    this.edges = this.edges.filter(
      (e) =>
        !(
          (e.vertexOne.id === edge.vertexOne.id &&
            e.vertexTwo.id === edge.vertexTwo.id) ||
          (e.vertexOne.id === edge.vertexTwo.id &&
            e.vertexTwo.id === edge.vertexOne.id)
        )
    );
  }
  public getPath(): Edge[] {
    return this.path;
  }
  public getvertex(vertexId: number) {
    const foundvertex = this.verticies.find((v) => v.id === vertexId);
    if (foundvertex) {
      return foundvertex;
    } else {
      throw Error(`Could not find a vertex with the id: ${vertexId}`);
    }
  }
  public getVerticies(): Vertex[] {
    return _.cloneDeep(this.verticies);
  }
  public getEdges(): Edge[] {
    return _.cloneDeep(this.edges);
  }

  public traverse(fromvertexId: number, tovertexId: number, path: Edge[] = []) {
    const fromvertex = this.getvertex(fromvertexId);
    const tovertex = this.getvertex(tovertexId);
    if (path.length === 0) {
      this.clearPath();

      fromvertex.distance = 0;
    }
    if (fromvertex === tovertex) {
      if (
        this.path.reduce((sum, e) => sum + e.distance, 0) >
          path.reduce((sum, e) => sum + e.distance, 0) ||
        this.path.length === 0
      ) {
        this.path = [...path];
      }
    }
    let possible = this.findPossibleEdges(fromvertex.id, path);
    const nextVerticies = [];
    for (let edge of possible) {
      const nextVert =
        edge.vertexOne === fromvertex ? edge.vertexTwo : edge.vertexOne;
      const nextDist = fromvertex.distance + edge.distance;
      if (nextVert.distance > nextDist) {
        nextVert.distance = nextDist;
        nextVerticies.push(nextVert);
      }
    }
    for (let next of this.findNextVerticies(nextVerticies)) {
      if (next) {
        this.traverse(next.id, tovertexId, [
          ...path,
          this.getPathBetween(fromvertex, next),
        ]);
      }
    }
    return _.cloneDeep({
      path: [...this.path],
      distance: this.path.reduce((sum, e) => sum + e.distance, 0),
    });
  }
  public pointExists(position: { x: number; y: number }): Vertex | undefined {
    return this.verticies.find(
      (v) =>
        Math.abs(v.position.x - position.x) <= this.minPointDistance &&
        Math.abs(v.position.y - position.y) <= this.minPointDistance
    );
  }
  public edgeExists(
    vertexOneId: number,
    vertexTwoId: number
  ): Edge | undefined {
    return this.edges.find(
      (e) =>
        (e.vertexOne.id === vertexOneId && e.vertexTwo.id === vertexTwoId) ||
        (e.vertexOne.id === vertexTwoId && e.vertexTwo.id === vertexOneId)
    );
  }
  private clearPath() {
    this.path = [];
    this.verticies.forEach((v) => {
      v.distance = Number.MAX_SAFE_INTEGER;
    });
  }
  private getNextvertexId() {
    return this.verticies.length
      ? this.verticies[this.verticies.length - 1].id + 1
      : 1;
  }
  private getPathBetween(vertexOne: Vertex, vertexTwo: Vertex) {
    return this.edges.filter(
      (e) =>
        (e.vertexOne == vertexOne && e.vertexTwo == vertexTwo) ||
        (e.vertexOne == vertexTwo && e.vertexTwo == vertexOne)
    )[0];
  }
  private findNextVerticies(nextVerticies: Vertex[]) {
    const unexploredVerticies = nextVerticies.filter(
      (v) => v.distance !== Number.MAX_SAFE_INTEGER
    );
    return unexploredVerticies.sort((a, b) => b.distance - a.distance);
  }
  private findPossibleEdges(vertexId: number, path: Edge[]) {
    return this.edges
      .filter((edge) => {
        if (path.includes(edge)) {
          return false;
        } else {
          return path.includes(edge)
            ? false
            : edge.vertexOne.id === vertexId || edge.vertexTwo.id === vertexId;
        }
      })
      .sort((e1, e2) => e2.distance - e1.distance);
  }
}

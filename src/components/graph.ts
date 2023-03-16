export interface Edge {
  verticeOne: Vertice;
  verticeTwo: Vertice;
  distance: number;
}

export interface Vertice {
  id: number;
  distance: number;
  position: {
    x: number;
    y: number;
  };
}

export interface GraphRenderer {
  drawVertice(vertice: Vertice): boolean;
  drawEdge(edge: Edge): boolean;
  clear(): void;
}

export class Graph {
  private path: Edge[];
  private verticies: Vertice[];
  private edges: Edge[];
  private renderer: GraphRenderer | undefined;
  constructor(renderer: GraphRenderer) {
    this.path = [];
    this.verticies = [];
    this.edges = [];
    this.renderer = renderer;
  }
  public addVertice(vertice: { position: { x: number; y: number } }) {
    const newVertice = {
      id: this.getNextVerticeId(),
      distance: Number.MAX_SAFE_INTEGER,
      position: vertice.position,
    };
    this.verticies.push(newVertice);
    this.renderer?.drawVertice(newVertice);
  }
  public addEdge(verticeOneId: number, verticeTwoId: number, distance: number) {
    const verticeOne = this.getVertice(verticeOneId);
    const verticeTwo = this.getVertice(verticeTwoId);
    const newEdge = {
      verticeOne,
      verticeTwo,
      distance,
    };
    this.edges.push(newEdge);
    this.renderer?.drawEdge(newEdge);
  }
  public getPath(): Edge[] {
    return this.path;
  }
  public getVertice(verticeId: number) {
    const foundVertice = this.verticies.find((v) => v.id === verticeId);
    if (foundVertice) {
      return foundVertice;
    } else {
      throw Error(`Could not find a vertice with the id: ${verticeId}`);
    }
  }
  public traverse(
    fromVerticeId: number,
    toVerticeId: number,
    path: Edge[] = []
  ) {
    const fromVertice = this.getVertice(fromVerticeId);
    const toVertice = this.getVertice(toVerticeId);
    if (path.length === 0) {
      fromVertice.distance = 0;
    }
    if (fromVertice === toVertice) {
      if (
        this.path.reduce((sum, e) => sum + e.distance, 0) >
          path.reduce((sum, e) => sum + e.distance, 0) ||
        this.path.length === 0
      ) {
        this.path = [...path];
      }
    }
    let possible = this.findPossibleEdges(fromVertice.id, path);
    const nextVerticies = [];
    for (let edge of possible) {
      const nextVert =
        edge.verticeOne === fromVertice ? edge.verticeTwo : edge.verticeOne;
      const nextDist = fromVertice.distance + edge.distance;
      if (nextVert.distance > nextDist) {
        nextVert.distance = nextDist;
        nextVerticies.push(nextVert);
      }
    }
    for (let next of this.findNextVerticies(nextVerticies)) {
      if (next) {
        this.traverse(next.id, toVerticeId, [
          ...path,
          this.getPathBetween(fromVertice, next),
        ]);
      }
    }
    return {
      path: this.path,
      distance: this.path.reduce((sum, e) => sum + e.distance, 0),
    };
  }
  private getNextVerticeId() {
    return this.verticies.length
      ? this.verticies[this.verticies.length - 1].id + 1
      : 1;
  }
  private getPathBetween(verticeOne: Vertice, verticeTwo: Vertice) {
    return this.edges.filter(
      (e) =>
        (e.verticeOne == verticeOne && e.verticeTwo == verticeTwo) ||
        (e.verticeOne == verticeTwo && e.verticeTwo == verticeOne)
    )[0];
  }
  private findNextVerticies(nextVerticies: Vertice[]) {
    const unexploredVerticies = nextVerticies.filter(
      (v) => v.distance !== Number.MAX_SAFE_INTEGER
    );
    return unexploredVerticies.sort((a, b) => b.distance - a.distance);
  }
  private findPossibleEdges(verticeId: number, path: Edge[]) {
    return this.edges
      .filter((edge) => {
        if (path.includes(edge)) {
          return false;
        } else {
          return path.includes(edge)
            ? false
            : edge.verticeOne.id === verticeId ||
                edge.verticeTwo.id === verticeId;
        }
      })
      .sort((e1, e2) => e2.distance - e1.distance);
  }
}

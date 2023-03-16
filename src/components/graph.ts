import _ from "lodash";
export interface Edge {
  verticeOne: Vertice;
  verticeTwo: Vertice;
  distance: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Vertice {
  id: number;
  distance: number;
  position: Position;
}

export class Graph {
  private path: Edge[];
  private verticies: Vertice[];
  private edges: Edge[];
  private minPointDistance: number;
  constructor() {
    this.path = [];
    this.verticies = [];
    this.edges = [];
    this.minPointDistance = 10;
  }
  public addVertice(position: Position) {
    const newVertice = {
      id: this.getNextVerticeId(),
      distance: Number.MAX_SAFE_INTEGER,
      position: position,
    };
    this.verticies.push(newVertice);
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
    this.clearPath();
    return newEdge;
  }
  public removeEdge(edge: Edge) {
    console.log(JSON.stringify(edge));
    this.edges = this.edges.filter(
      (e) =>
        !(
          (e.verticeOne.id === edge.verticeOne.id &&
            e.verticeTwo.id === edge.verticeTwo.id) ||
          (e.verticeOne.id === edge.verticeTwo.id &&
            e.verticeTwo.id === edge.verticeOne.id)
        )
    );
    console.log(JSON.stringify(edge));
    console.log(JSON.stringify(this.edges));
    this.clearPath();
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
  public getVerticies(): Vertice[] {
    return _.cloneDeep(this.verticies);
  }
  public getEdges(): Edge[] {
    return _.cloneDeep(this.edges);
  }

  public traverse(
    fromVerticeId: number,
    toVerticeId: number,
    path: Edge[] = []
  ) {
    const fromVertice = this.getVertice(fromVerticeId);
    const toVertice = this.getVertice(toVerticeId);
    if (path.length === 0) {
      this.clearPath();

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
    return _.cloneDeep({
      path: [...this.path],
      distance: this.path.reduce((sum, e) => sum + e.distance, 0),
    });
  }
  public pointExists(position: { x: number; y: number }): Vertice | undefined {
    return this.verticies.find(
      (v) =>
        Math.abs(v.position.x - position.x) < this.minPointDistance &&
        Math.abs(v.position.y - position.y) < this.minPointDistance
    );
  }
  public edgeExists(
    verticeOneId: number,
    verticeTwoId: number
  ): Edge | undefined {
    return this.edges.find(
      (e) =>
        (e.verticeOne.id === verticeOneId &&
          e.verticeTwo.id === verticeTwoId) ||
        (e.verticeOne.id === verticeTwoId && e.verticeTwo.id === verticeOneId)
    );
  }
  private clearPath() {
    this.path = [];
    this.verticies.forEach((v) => {
      v.distance = Number.MAX_SAFE_INTEGER;
    });
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

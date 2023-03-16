import { Edge, GraphRenderer, Vertice } from "./graph";

export class CanvasRenderer implements GraphRenderer {
  private canvas: HTMLCanvasElement;
  private points: Vertice[];
  constructor(canvas: HTMLCanvasElement) {
    // this.initializeCanvas(canvas);
    this.canvas = canvas;
    this.points = [];
  }
  public addVertice(vertice: Vertice) {
    this.points.push(vertice);
  }
  public draw(): void {}
  public drawVertice(vertice: Vertice): boolean {
    const canvasCTX = this.getDrawingContext();
    if (canvasCTX) {
      canvasCTX.beginPath();
      canvasCTX.arc(vertice.position.x, vertice.position.y, 3, 0, 2 * Math.PI);
      canvasCTX.fill();
      canvasCTX.closePath();
      return true;
    }
    return false;
  }
  public drawEdge(edge: Edge): boolean {
    const canvasCTX = this.getDrawingContext();
    canvasCTX.beginPath();
    canvasCTX.moveTo(edge.verticeOne.position.x, edge.verticeOne.position.y);
    canvasCTX.lineTo(edge.verticeTwo.position.x, edge.verticeTwo.position.y);
    canvasCTX.stroke();
    canvasCTX.closePath();
    return false;
  }
  public clear(): void {
    // this.canvasCTX.
  }
  private getDrawingContext() {
    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2;
      // ctx.fillStyle = "#0F0";
      // ctx.fill("nonzero");
    } else {
      throw Error("Couldn't initialize the canvas context");
    }
    return ctx;
  }
  private initializeCanvas(canvas: HTMLCanvasElement) {}
  private drawPoint() {}
}

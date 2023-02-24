import { Edge } from "./Edge";
import { Quad } from "./Quad";
import { Triangle } from "./Triangle";
import { Vertex_hex } from "./Vertex";

export class Grid
{
    public static radius:number = 0;
    public static cellSize:number = 2;
    
    public hexes:Array<Vertex_hex> = new Array<Vertex_hex>();
    public edges:Array<Edge> = new Array<Edge>();
    public triangles:Array<Triangle> = new Array<Triangle>();
    public quads:Array<Quad> = new Array<Quad>();
    
    constructor(radius:number, cellSize:number)
    {
        Grid.radius = radius;
        Grid.cellSize = cellSize;
        Vertex_hex.Hex(this.hexes);
        Triangle.Triangles_Hex(this.hexes, this.edges, this.triangles);
        while(Triangle.HasNeighborTriangles(this.triangles)){
           Triangle.RandomlyMergeTriangles(this.edges, this.triangles, this.quads);
        }
    }
}
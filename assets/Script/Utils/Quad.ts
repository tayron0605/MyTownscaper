import { Edge } from "./Edge";
import { Vertex_hex } from "./Vertex";

export class Quad
{
    _a:Vertex_hex;
    _b:Vertex_hex;
    _c:Vertex_hex;
    _d:Vertex_hex;

    _ab:Edge;
    _bc:Edge;
    _cd:Edge;
    _ad:Edge;

    get vertices(){
        return [this._a,this._b,this._c,this._d];
    }

    constructor(a:Vertex_hex, b:Vertex_hex, c:Vertex_hex, d:Vertex_hex, edges:Array<Edge>, quads:Array<Quad>){
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;

        this._ab = Edge.FindEdge(a, b, edges);
        this._bc = Edge.FindEdge(b, c, edges);
        this._cd = Edge.FindEdge(c, d, edges);
        this._ad = Edge.FindEdge(a, d, edges);

        quads.push(this);
    }
}
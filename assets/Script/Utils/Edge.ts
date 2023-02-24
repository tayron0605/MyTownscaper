
import { Coord, Vertex_hex } from "./Vertex";

export class Edge
{
    _hexes:Array<Vertex_hex>;

    constructor(a:Vertex_hex, b:Vertex_hex, edges:Array<Edge>)
    {
        this._hexes = new Array<Vertex_hex>();
        this._hexes.push(a);
        this._hexes.push(b);

        edges.push(this);
    }

    get Hexes():Readonly<Array<Vertex_hex>>{
        return this._hexes;
    }

    Contains(a:Vertex_hex){
        return this._hexes.findIndex(v => v.ID == a.ID) != -1;
    }

    static FindEdge(a:Vertex_hex, b:Vertex_hex, edges:Array<Edge>):Edge{
        for(let i = 0;i < edges.length;++i){
            let edge = edges[i];
            if(edge.Contains(a) && edge.Contains(b))
                return edge;
        }
        return null;
    }
}
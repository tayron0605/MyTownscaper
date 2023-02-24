import { Edge } from "./Edge";
import { Grid } from "./Grid";
import { Quad } from "./Quad";
import { Utils } from "./Utils";
import { Vertex_hex } from "./Vertex";

export class Triangle
{
    private _a:Vertex_hex;
    private _b:Vertex_hex;
    private _c:Vertex_hex;

    private _vertices:Array<Vertex_hex>;

    private _ab:Edge;
    private _bc:Edge;
    private _ac:Edge;

    private _edges:Array<Edge>;

    constructor(a:Vertex_hex, b:Vertex_hex, c:Vertex_hex, edges:Array<Edge>, triangles:Array<Triangle>)
    {
        this._a = a;
        this._b = b;
        this._c = c;

        this._vertices = [this._a,this._b,this._c];

        this._ab = Edge.FindEdge(a,b,edges);
        this._bc = Edge.FindEdge(b,a,edges);
        this._ac = Edge.FindEdge(a,c,edges);

        if(this._ab == null)
            this._ab = new Edge(a, b, edges);
        if(this._bc == null)
            this._bc = new Edge(b, c, edges);
        if(this._ac == null)
            this._ac = new Edge(a, c, edges);

        this._edges = Array.from([this._ab, this._bc, this._ac]);

        triangles.push(this);
    }

    get vertices()
    {
        return this._vertices;
    }
    
    static Triangles_Ring(radius:number, vertices:Array<Vertex_hex>, edges:Array<Edge>, triangles:Array<Triangle>)
    {
        let inner = Vertex_hex.GrabRing(radius - 1, vertices);
        let outer = Vertex_hex.GrabRing(radius, vertices);
        
        for(let i = 0;i < 6;i++){
            for(let j = 0;j < radius;j++){
                //创建两个顶点在外圈，一个顶点在内圈的三角形
                let a:Vertex_hex = outer[i * radius + j];
                let b:Vertex_hex = outer[(i * radius + j + 1) % outer.length];
                let c:Vertex_hex = inner[(i * (radius - 1) + j) % inner.length];
                new Triangle(a, b, c, edges, triangles);
                //创建一个顶点在外圈，两个顶点在内圈的三角形
                if(j > 0)
                {
                    let d:Vertex_hex = inner[i * (radius - 1) + j - 1];
                    new Triangle(a, c, d, edges, triangles);
                }
                

            }
        }
    }

    static Triangles_Hex(vertices:Array<Vertex_hex>, edges:Array<Edge>, triangles:Array<Triangle>)
    {
        for(let i = 1;i <= Grid.radius;++i)
        {
            this.Triangles_Ring(i, vertices, edges, triangles);
        }
    }

    isNeighbor(target:Triangle):boolean{
        let intersectionCnt = 0;
        this._edges.forEach((v)=>{
            let res = Edge.FindEdge(v.Hexes[0],v.Hexes[1],target._edges);
            if(res)
                intersectionCnt++;
        })
        return intersectionCnt == 1;
    }

    FindAllNeighborTriangles(triangles:Array<Triangle>):Array<Triangle>{
        let res = new Array<Triangle>();
        for(let i = 0;i < triangles.length;++i){
            let triangle = triangles[i];
            if(this.isNeighbor(triangle)){
                res.push(triangle);
            }
        }
        return res;
    }

    NeighborEdge(neighbor:Triangle):Edge
    {
        let n:Edge = null;
        this._edges.forEach((v)=>{
            let res = Edge.FindEdge(v.Hexes[0],v.Hexes[1],neighbor._edges);
            if(n == null) n = res;
        })
        return n;
    }

    /**
     * 找出和相邻三角形不共有的顶点
     * @param neighbor 
     */
    IsolatedVertex_Self(neighbor:Triangle):Vertex_hex
    {
        if(!this.isNeighbor(neighbor)){
            return null;
        }
        let res:Vertex_hex = null;
        this._vertices.forEach((v)=>{
            let bExcept = true;
            for(let i = 0;i < neighbor._vertices.length;++i){
                if(v.ID == neighbor._vertices[i].ID){
                    bExcept = false;
                    break;
                }
            }
            if(res == null && bExcept){
                res = v;
            }
        })
        
        return res;
    }

    IsolatedVertex_Neighbor(neighbor:Triangle):Vertex_hex
    {
        if(!this.isNeighbor(neighbor)){
            return null;
        }
        let res:Vertex_hex = null;
        neighbor._vertices.forEach((v)=>{
            let bExcept = true;
            for(let i = 0;i < this._vertices.length;++i){
                if(v.ID == this._vertices[i].ID){
                    bExcept = false;
                    break;
                }
            }
            if(res == null && bExcept){
                res = v;
            }
        })
        
        return res;
    }

    MergeNeighborTriangles(neighbor:Triangle, edges:Array<Edge>, triangles:Array<Triangle>, quads:Array<Quad>)
    {
        let a:Vertex_hex = this.IsolatedVertex_Self(neighbor);
        let b:Vertex_hex = this._vertices[(this._vertices.indexOf(a) + 1) % 3];
        let c:Vertex_hex = this.IsolatedVertex_Neighbor(neighbor);
        let d:Vertex_hex = neighbor._vertices[(neighbor._vertices.indexOf(c) + 1) % 3];
        if(!a || !b ||!c ||!d){
            return;
        }
        let quad = new Quad(a, b, c, d, edges, quads);
        let removeEdge = this.NeighborEdge(neighbor);
        if(removeEdge){
            let idx = edges.indexOf(removeEdge);
            if(idx != -1){
                edges.splice(idx,1);
            }
        }
        let idx = triangles.indexOf(this);
        if(idx != -1){
            triangles.splice(idx,1);
        }
        idx = triangles.indexOf(neighbor);
        if(idx != -1){
            triangles.splice(idx,1);
        }
    }

    public static HasNeighborTriangles(triangles:Array<Triangle>):boolean
    {
        for(let i = 0;i < triangles.length;++i){
            let a = triangles[i];
            for(let j = 0;j < triangles.length;++j){
                let b = triangles[j];
                if(a.isNeighbor(b))
                    return true;
            }
        }
        return false;
    }

    static RandomlyMergeTriangles(edges:Array<Edge>, triangles:Array<Triangle>, quads:Array<Quad>)
    {
        let randomIdx = Utils.RandomInt(0, triangles.length - 1);
        let neighbors = triangles[randomIdx].FindAllNeighborTriangles(triangles);
        if(neighbors.length > 0){
            let randomNeighborIndex = Utils.RandomInt(0, neighbors.length - 1);
            triangles[randomIdx].MergeNeighborTriangles(neighbors[randomNeighborIndex], edges, triangles, quads);
        }

    }
}
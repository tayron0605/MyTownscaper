import { Vec3 } from "cc";
import { Grid } from "./Grid";

class Vertex
{

}

export class Coord
{
    private _q:number = 0;
    private _r:number = 0;
    private _s:number = 0;

    private _world_position:Vec3;
    constructor(q, r, s)
    {
        this._q = q;
        this._r = r;
        this._s = s;
        this._world_position = this.WorldPosition();
    }

    get world_position()
    {
        return this._world_position;
    }

    get q()
    {
        return this._q;
    }

    get r()
    {
        return this._r;
    }

    get s()
    {
        return this._s;
    }

    public WorldPosition()
    {
        return new Vec3((this._q * Math.sqrt(3) / 2) * 2 * Grid.cellSize, 0, (-this._r - this._q/2) * 2 * Grid.cellSize);
    }

    private static get directions():Coord[]{
        return [
            new Coord(0,1,-1),
            new Coord(-1,1,0),
            new Coord(-1,0,1),
            new Coord(0,-1,1),
            new Coord(1,-1,0),
            new Coord(1,0,-1)
        ]
    }

    public static Direction(direction:number){
        return Coord.directions[direction];
    }

    public Add(coord:Coord)
    {
        return new Coord(this._q + coord._q, this._r + coord._r, this._s + coord._s);
    }

    public Scale(k:number)
    {
        return new Coord(this._q * k, this._r * k, this._s * k);
    }

    public Neighbor(direction:number)
    {
        return this.Add(Coord.Direction(direction));
    }

    public static Coord_Ring(radius:number):Array<Coord>
    {
        let result = new Array<Coord>();
        if(radius == 0){
            result.push(new Coord(0, 0, 0));
        }else{
            let coord = Coord.Direction(4).Scale(radius);
            for(let i = 0;i < 6;++i){
                for(let j = 0;j < radius;++j){
                    result.push(coord);
                    coord = coord.Neighbor(i);
                }
            }
        }
        return result;
    }

    public static Coord_Hex():Array<Coord>
    {
        let result = new Array<Coord>();
        for(let i = 0;i <= Grid.radius;++i){
            result = result.concat(this.Coord_Ring(i));
        }
        return result;
    }
}

export class Vertex_hex extends Vertex
{
    private _hashCode:string = "";
    private _coord:Coord;
    constructor(coord:Coord)
    {
        super();
        this._coord = coord;
        
        this._hashCode = [coord.q,coord.r,coord.s,coord.world_position.x,coord.world_position.y,coord.world_position.z].toString();
    }

    get ID()
    {
        return this._hashCode;
    }

    get coord()
    {
        return this._coord;
    }

    static Hex(vertices:Array<Vertex_hex>)
    {
        let tmp = Coord.Coord_Hex();
        tmp.forEach((coord)=>{
            vertices.push(new Vertex_hex(coord));
        })
    }

    static GrabRing(radius:number, vertices:Array<Vertex_hex>)
    {
        if(radius == 0) return vertices.splice(0, 1);

        return vertices.splice(radius * (radius - 1) * 3 + 1, radius * 6);
    }
}
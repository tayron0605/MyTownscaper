import { _decorator, Component, Node, primitives, ModelComponent, Vec3, macro } from 'cc';
import { utils } from "cc"; 
import { Grid } from './Utils/Grid';
const { MeshUtils } = utils;
const { ccclass, property } = _decorator;

@ccclass('UIMap')
export class UIMap extends Component {
    @property(Node)
    rootNode:Node = null;
    @property
    radius:number = 0;
    @property
    cellSize:number = 0;

    private grid:Grid;

    start() {
        this.grid = new Grid(this.radius, this.cellSize);

        if(this.grid){
            this.OnDrawGizmos();
        }
        
    }

    DrawBox(pos:Vec3) {
        let box = primitives.box({width:1, height:1});
        let mesh = MeshUtils.createMesh(box);
        let boxNode = new Node();
        let model = boxNode.addComponent(ModelComponent);
        model.mesh = mesh;
        this.rootNode.addChild(boxNode);
        boxNode.position = pos;
    }

    DrawTriangle(pos:number[]){
        let uvs = [

        ]
        let mesh = MeshUtils.createMesh({positions:pos})
        let triNode = new Node();
        let model = triNode.addComponent(ModelComponent);
        model.mesh = mesh;
        this.rootNode.addChild(triNode);
    }

    OnDrawGizmos() {
        
        this.grid.hexes.forEach((vertex)=>{
            this.DrawBox(vertex.coord.world_position);
        })
        
        let idx = 0;
        // let arrTri = this.grid.triangles;
        // this.schedule(()=>{
        //     let pos = [];
        //     let tri = arrTri[idx];
        //     let vertices = tri.vertices;
        //     vertices.forEach((v)=>{
        //         pos.push(v.coord.world_position.x);
        //         pos.push(v.coord.world_position.y);
        //         pos.push(v.coord.world_position.z);
        //     })
        //     this.DrawTriangle(pos);
        //     idx++;
        //     if(idx >= this.grid.triangles.length){
        //         this.unscheduleAllCallbacks();
        //     }
        // },0.2,macro.REPEAT_FOREVER);

        let arrQuad = this.grid.quads;
        this.schedule(()=>{
            let pos = [];
            let quad = arrQuad[idx];
            //绘制两个三角形abc和bcd
            pos.push(quad._a.coord.world_position.x);
            pos.push(quad._a.coord.world_position.y);
            pos.push(quad._a.coord.world_position.z);
            pos.push(quad._b.coord.world_position.x);
            pos.push(quad._b.coord.world_position.y);
            pos.push(quad._b.coord.world_position.z);
            pos.push(quad._c.coord.world_position.x);
            pos.push(quad._c.coord.world_position.y);
            pos.push(quad._c.coord.world_position.z);
            this.DrawTriangle(pos);
            ///////
            // pos = [];
            pos.push(quad._a.coord.world_position.x);
            pos.push(quad._a.coord.world_position.y);
            pos.push(quad._a.coord.world_position.z);
            pos.push(quad._c.coord.world_position.x);
            pos.push(quad._c.coord.world_position.y);
            pos.push(quad._c.coord.world_position.z);
            pos.push(quad._d.coord.world_position.x);
            pos.push(quad._d.coord.world_position.y);
            pos.push(quad._d.coord.world_position.z);
            this.DrawTriangle(pos);
            idx++;
            if(idx >= this.grid.quads.length){
                this.unscheduleAllCallbacks();
            }
        },0.2,macro.REPEAT_FOREVER);

        this.grid.quads.forEach((quad)=>{
            if(!quad._a || !quad._b || !quad._c || !quad._d){
                console.log("quad error.");
            }
        })

    }

    update(deltaTime: number) {
        
    }
}



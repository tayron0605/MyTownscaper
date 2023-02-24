import { _decorator, Component, Node, primitives, ModelComponent, Vec3 } from 'cc';
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
        let pos = [];
        this.grid.hexes.forEach((vertex)=>{
            this.DrawBox(vertex.coord.world_position);
            pos.push(vertex.coord.world_position.x);
            pos.push(vertex.coord.world_position.y);
            pos.push(vertex.coord.world_position.z);
        })
        //this.DrawTriangle(pos);
        let a = 0;
    }

    update(deltaTime: number) {
        
    }
}



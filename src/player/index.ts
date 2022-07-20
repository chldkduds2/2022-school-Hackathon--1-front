import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import Checker from './Checker'
import World from '../world'
import { Vector2 } from 'three'

export default class SetModel {
    public pos:THREE.Vector3
    private _camera: THREE.Camera
    private _divContainer: HTMLElement
    private _modal: HTMLElement
    private pointerLockControl

    private _state = [false, false, false, false, false, false]

    private _model: THREE.Group = new THREE.Group()

    private _scene:THREE.Scene;

    private counter = 0;
    private checker:Checker

    private previousLocation:THREE.Vector3 = new THREE.Vector3()

    constructor(
        scene: THREE.Scene, 
        camera: THREE.Camera, 
        divContainer: HTMLElement,
        world:World
    ) {
        this._scene = scene
        this._camera = camera
        this._divContainer = divContainer
        this._modal = document.getElementById('modal')!
        this.pointerLockControl = new PointerLockControls(this._camera, this._divContainer)
        this.checker = new Checker(world)
        const loader = new GLTFLoader()
        this.pos = new THREE.Vector3(0, 17, 1)

        // loader.load(
        //     'assets/scene.gltf',
        //     (gltf) => {
        //         gltf.scene.scale.x = 0.1
        //         gltf.scene.scale.y = 0.1
        //         gltf.scene.scale.z = 0.1

        //         scene.add(gltf.scene)
        //         // gltf.scene.position.z = -50

        //         this._model = gltf.scene
        //     },
        //     (u) => console.log(u),
        //     (e) => console.log(e)
        // )

        this._modal?.addEventListener('click', () => {
            this.pointerLockControl.lock()
        })
        this.pointerLockControl.addEventListener('lock', () => {
            this._modal.style.display = 'none'
        })
        this.pointerLockControl.addEventListener('unlock', () => {
            this._modal.style.display = ''
        })

        window.addEventListener('keydown', (e) => {
            this.changeTrue(e.keyCode)
        })

        window.addEventListener('keyup', (e) => {
            this.changeFalse(e.keyCode)
        })


    }

    changeTrue(keyCode:number){
        if (keyCode == 119 || keyCode == 87){
            this._state[0] = true;
        }
        if (keyCode == 65 || keyCode == 97) {
            this._state[1] = true;
        }
        if (keyCode == 68 || keyCode == 100) {
            this._state[2] = true;
        }
        if (keyCode == 83 || keyCode == 115) {
            this._state[3] = true;
        }
        if (keyCode == 32) {
            this._state[4] = true;
        }
        if (keyCode == 16) {
            this._state[5] = true;
        }
    }

    changeFalse(keyCode:number){
        if (keyCode == 119 || keyCode == 87){
            this._state[0] = false;
        }
        if (keyCode == 65 || keyCode == 97) {
            this._state[1] = false;
        }
        if (keyCode == 68 || keyCode == 100) {
            this._state[2] = false;
        }
        if (keyCode == 83 || keyCode == 115) {
            this._state[3] = false;
        }
        if (keyCode == 32) {
            this._state[4] = false;
        }
        if (keyCode == 16) {
            this._state[5] = false;
        }
    }




    update() {
        const state = this._state

        // true가 2개 이상일 때 속도 변경
        const speed = state.filter(e => true === e).length > 1 ? 0.175 : 0.3;

        const collusion:Array<boolean> = this.checker.update(this._camera.position)
        // console.log(collusion)

        if (state[0]) {
            this.pointerLockControl.moveForward(speed)
        }
        if (state[1]) {
            this.pointerLockControl.moveRight(-speed)
        }
        if (state[2]) {
            this.pointerLockControl.moveRight(speed)
        }
        if (state[3]) {
            this.pointerLockControl.moveForward(-speed)
        }
        if (state[4] && collusion[4]) {
            this._camera.position.y += speed
        }
        if (state[5] || collusion[5]) {
            // this._camera.position.y -= speed
            this._camera.position.y -= 0.1
        }


        this.pos = this._camera.position
        // collusion
        // x좌표, -x, +z,-z
        // 로 가면 막힘

        // console.log(this._camsera.position)

        // 아래 if 문에 들어갔을 때 state를 false해서 값을 저장하지 않고,
        // 안 들어가면 전의 위치 저장,
        // if문에 들어가면 저장된 위치로 카메라 이동
        // 왜인진 모르겠는데 안 됐음

        // let flag = true;

        // moveForward이기 때문에 x,z 는 비교해서 처리
        if (!collusion[0]){
            this._camera.position.x -= speed
            // this._camera.position.x = this.previousLocation.x
            // flag = false
        } 
        if (!collusion[1]){
            this._camera.position.x += speed
            // this._camera.position.x = this.previousLocation.x
            // flag = false
        }
        if (!collusion[2]){
            this._camera.position.z -= speed
            // this._camera.position.z = this.previousLocation.z
            // flag = false
        }
        if (!collusion[3]){
            this._camera.position.z += speed
            // this._camera.position.z = this.previousLocation.z
            // flag = false
        }
        
        
        this._model.position.x = this._camera.position.x
        this._model.position.y = this._camera.position.y - 1
        this._model.position.z = this._camera.position.z;

        // if (flag){
        //     this.previousLocation = this._camera.position
        //     console.log("save",this.previousLocation)
        // }
    }
}
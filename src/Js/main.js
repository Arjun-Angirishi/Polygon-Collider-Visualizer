/* Made By 
Arjun Angirishi 
20112023
All three compulsory requirements implemented 
Two Optional Features implemented i.e Model Loader and Collision Physics*/




/*                              Necessary Imports                                           */

import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import stars2 from '../Images/stars3.jpg'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/*                             Basic Scene, Renderer and Cannon World Setup                */
const scene = new THREE.Scene();

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
})
 
const timeStep=1/60

const camera = new THREE.PerspectiveCamera( 90, 
    window.innerWidth / window.innerHeight, 
    0.01, 
    1000 
    );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled=true


/*                                                    Lights                                         */

const directionalLight=new THREE.DirectionalLight(0xCDBD07,0.8)
scene.add(directionalLight)
directionalLight.position.set(30,100,50)


const directionalLight2=new THREE.DirectionalLight(0x228B22,1)
scene.add(directionalLight2)
directionalLight2.position.set(0,100,50)

const spotLight=new THREE.SpotLight(0xffffff,0.1)
scene.add(spotLight)
spotLight.position.set(30,100,40)
var colflag=false


const orbit=new OrbitControls(camera,renderer.domElement)  //  Orbit Controls enabled for better viewing 



/*                                       Objects Added  (Both in Threejs and Cannonjs forms)                                                */


//                                                              Plane (Ground)
const planeGeometry = new THREE.PlaneGeometry( 1000 , 1000);
const planeMaterial = new THREE.MeshBasicMaterial( { 
    color: 0x00b300,
    side: THREE.DoubleSide 
});
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( plane );
plane.rotation.x=-0.5* Math.PI

const groundBody=new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0)


//                                                            Box (collision object- 1)
const boxGeometry=new THREE.BoxGeometry(3,3,3)
const boxMaterial=new THREE.MeshBasicMaterial({
    color: 0x0170AB,

})
const box=new THREE.Mesh(boxGeometry,boxMaterial)
scene.add(box)
box.position.set(-4,1.5,0)
const boxBody= new CANNON.Body({
    shape:new CANNON.Box(new CANNON.Vec3(1.5,1.5,1.5)),
    mass:1,
    position: new CANNON.Vec3(20,4,0)
})

world.addBody(boxBody)
boxBody.velocity.set(-10,20,0)
boxBody.angularVelocity.set(1,1,1)
boxBody.addEventListener("collide",function(){
    if(!colflag){
        alert('Collision Occured')
        console.log('Collision Detected!')
        colflag=true
    }

})
boxBody.angularDamping=0.4


//                                                                 Sphere (collision object-2)


const sphereGeometry= new THREE.SphereGeometry(2)
const sphereMaterial=new THREE.MeshBasicMaterial({
    color: 0xD042D4
})
const sphere= new THREE.Mesh(sphereGeometry,sphereMaterial)
scene.add(sphere)
sphere.position.set(4,2,0)
const sphereBody=new CANNON.Body({
    shape:new CANNON.Sphere(2),
    mass:1,
    position: new CANNON.Vec3(-20,4,0)
})
world.addBody(sphereBody)
sphereBody.linearDamping=0.2
sphereBody.velocity.set(10,24,0)



/*                                                             3D Models Imported (EXTRA FEATURE)                            */



//                                                               4 Trees imported  (OBJ FORMAT)
const assetLoader= new OBJLoader()
assetLoader.setPath('src/assets/')
assetLoader.load('tree.obj',function(obj){
    scene.add(obj)
    obj.position.set(10,0,-15)
    obj.scale.set(5,5,5)
},undefined,function(error){
    console.log(error)
})

assetLoader.load('tree.obj',function(obj){
    scene.add(obj)
    obj.position.set(-10,0,-15)
    obj.scale.set(5,5,5)
},undefined,function(error){
    console.log(error)
})

assetLoader.load('tree.obj',function(obj){
    scene.add(obj)
    obj.position.set(-20,0,-15)
    obj.scale.set(5,5,5)
},undefined,function(error){
    console.log(error)
})
assetLoader.load('tree.obj',function(obj){
    scene.add(obj)
    obj.position.set(20,0,-15)
    obj.scale.set(5,5,5)
},undefined,function(error){
    console.log(error)
})

 
//                                                           Sun Model Imported (GLTF model)


var loader = new GLTFLoader();

var sun1=undefined
            
loader.load( 'src/assets/Sun1.glb', function ( gltf )
{
    sun1 = gltf.scene;   
    sun1.position.set(20,20,10);
    scene.add(sun1);
} );


/*                                                            Background and Camera Settings                              */


const cubeTextureLoader=new THREE.TextureLoader()
scene.background=cubeTextureLoader.load(stars2)
camera.position.set(0,5,30)


/*                                                            Rendering Animation Loop                                     */


function animate() {


    world.step(timeStep)

    plane.position.copy(groundBody.position)
    plane.quaternion.copy(groundBody.quaternion)

    box.position.copy(boxBody.position)
    box.quaternion.copy(boxBody.quaternion)

    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphere.quaternion)
	renderer.render( scene, camera );


}

renderer.setAnimationLoop(animate)
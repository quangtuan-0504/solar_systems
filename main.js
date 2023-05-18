import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

/////////// lấy các url tới các hình ảnh
const galaxyTexture = new Image() 
galaxyTexture.src = './img/galaxy.jpg'
console.log('url:',galaxyTexture.src)
//import starsTexture from '../img/stars.jpg';
const starsTexture = new Image() 
starsTexture.src = './img/stars.jpg'

//import sunTexture from '../img/sun.jpg';
const sunTexture = new Image() 
sunTexture.src = './img/sun.jpg'

//import mercuryTexture from '../img/mercury.jpg';
const mercuryTexture = new Image() 
mercuryTexture.src = './img/mercury.jpg'

//import venusTexture from '../img/venus.jpg';
const venusTexture = new Image() 
venusTexture.src = './img/stars.jpg'

//import earthTexture from '../img/earth.jpg';
const earthTexture = new Image() 
earthTexture.src = './img/earth.jpg'

//import marsTexture from '../img/mars.jpg';
const marsTexture = new Image() 
marsTexture.src = './img/mars.jpg'

//import jupiterTexture from '../img/jupiter.jpg';
const jupiterTexture = new Image() 
jupiterTexture.src = './img/jupiter.jpg'

//import saturnTexture from '../img/saturn.jpg';
const saturnTexture = new Image() 
saturnTexture.src = './img/saturn.jpg'

//import saturnRingTexture from '../img/saturn ring.png';
const saturnRingTexture = new Image() 
saturnRingTexture.src = './img/saturn ring.png'

//import uranusTexture from '../img/uranus.jpg';
const uranusTexture = new Image() 
uranusTexture.src = './img/uranus.jpg'

//import uranusRingTexture from '../img/uranus ring.png';
const uranusRingTexture = new Image() 
uranusRingTexture.src = './img/uranus ring.png'

//import neptuneTexture from '../img/neptune.jpg';
const neptuneTexture = new Image() 
neptuneTexture.src = './img/neptune.jpg'

//import plutoTexture from '../img/pluto.jpg';
const plutoTexture = new Image() 
plutoTexture.src = './img/pluto.jpg'


////////////Tạo trình kết xuất, giống như việc chiếu bộ phim lên màn hình tv, dt, màn chiếu
const renderer = new THREE.WebGLRenderer();
/////////// chọn kích thước khung chiếu lên màn hình
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
///////////Tạo cảnh
const scene = new THREE.Scene();
///////////thiết lập camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
////////// thay đổi vị trí camera bằng thao tác chuột
const orbit = new OrbitControls(camera, renderer.domElement);
/////////thiết lập vị trí camera
camera.position.set(-90, 140, 140);

//////// cập nhật lại cảnh sau khi thay đổi vị trí
orbit.update();
/////// thiết lập ánh sáng xunh quanh
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
/////// tạo nền bằng ảnh bầu trời sao cho sáu mặt
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture.src,
    starsTexture.src,
    starsTexture.src,
    starsTexture.src,
    starsTexture.src,
    starsTexture.src
]);
////// tạo mặt trời
const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    color: 'rgb(255, 255, 255)',
    map: textureLoader.load(sunTexture.src),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
////// ý tưởng tạo hệ mặt trời: tạo mặt trời nằm ở giữa các hành tinh quay quanh mặt trời với tốc độ khác nhau, các hành tinh cx tự quay quanh mình với tốc độ khác nhau
////// cách làm chi tiết:
//////hàm tạo các hành tinh
function createPlanete(radius, texture, position, ring) {
    const geo = new THREE.SphereGeometry(radius, 30, 30);// 2 tham số sau là số kinh tuyến của mặt cầu và số mặt phẳng tạo mặt cầu giữa 2 kinh tuyến
    const mat = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);// nếu đoạn này add obj vào sun thì các hành tinh đều có tốc độ quay quanh sun giống nhau(cùng tốc độ quay quanh trục với mặt trời)
    //, vì v với mỗi hành tinh ta sẽ tạo obj3D nằm tại vị trí mặt trời, r add hành tinh đó vô obj3D
    //muốn các hành tinh quay với tốc độ nào thì set obj quay với tốc độ đó
    if(ring) {//ring!=Null
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    //Thêm quỹ đạo
    var planetOrbitGeo = new THREE.TorusGeometry(position, 0.1, 120, 480);
    var planetOrbitMat = new THREE.MeshBasicMaterial(0xffffff);
    var planetOrbit = new THREE.Mesh(planetOrbitGeo, planetOrbitMat);
    planetOrbit.rotation.x = -Math.PI/2;

    // //Thêm tên -> Thiếu thư viện
    // var planetName = textLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    //     const geometry = new TextGeometry( 'Hello three.js!')}
    // );
    // planetName.position.y = radius;
    // obj.add(planetName);


    scene.add(obj);
    scene.add(planetOrbit);
    mesh.position.x = position;// các hành tinh ban đầu đều nằm trên 1 đường thẳng
    return {mesh, obj}// trả về 1 đối tượng 2 thuộc tính : hành tinh và cái điểm quay của nó
}
//////////tạo các hành tinh
const mercury = createPlanete(3.2, mercuryTexture.src, 28);
const venus = createPlanete(5.8, venusTexture.src, 44);
const earth = createPlanete(6, earthTexture.src, 62);
const mars = createPlanete(4, marsTexture.src, 78);
const jupiter = createPlanete(12, jupiterTexture.src, 100);
const saturn = createPlanete(10, saturnTexture.src, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture.src
});
const uranus = createPlanete(7, uranusTexture.src, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture.src
});
const neptune = createPlanete(7, neptuneTexture.src, 200);
const pluto = createPlanete(2.8, plutoTexture.src, 216);

//light
const pointLight = new THREE.PointLight(0xFFFFFF, 3, 300);
scene.add(pointLight);

//Thông số 
var guiSun = {self_rotation: 0.004}
var guiMercury = {self_rotation: 0.004, rotate_around_Sun: 0.04}
var guiVenus = {self_rotation: 0.002, rotate_around_Sun: 0.015}
var guiEarth = {self_rotation: 0.002, rotate_around_Sun: 0.01}
var guiMars = {self_rotation: 0.018, rotate_around_Sun: 0.008}
var guiJupiter = {self_rotation: 0.004, rotate_around_Sun: 0.002}
var guiSaturn = {self_rotation: 0.038, rotate_around_Sun: 0.0009}
var guiUranus = {self_rotation: 0.03, rotate_around_Sun: 0.0004}
var guiNeptune = {self_rotation: 0.032, rotate_around_Sun: 0.0001}
var guiPluto = {self_rotation: 0.008, rotate_around_Sun: 0.0001}

//dat.gui 
const datgui = new dat.GUI();
var datguiSun = datgui.addFolder('Sun');
datguiSun.add(pointLight, 'intensity', 0, 20);
datguiSun.add(guiSun, 'self_rotation', 0, 1, 0.001);

var datguiMercury = datgui.addFolder('Mercury');
datguiMercury.add(guiMercury, 'self_rotation', 0, 1, 0.001)
datguiMercury.add(guiMercury, 'rotate_around_Sun', 0, 1, 0.01);

var datguiVenus = datgui.addFolder('Venus');
datguiVenus.add(guiVenus, 'self_rotation', 0, 1, 0.001)
datguiVenus.add(guiVenus, 'rotate_around_Sun', 0, 1, 0.01);

var datguiEarth = datgui.addFolder('Earth');
datguiEarth.add(guiEarth, 'self_rotation', 0, 1, 0.001)
datguiEarth.add(guiEarth, 'rotate_around_Sun', 0, 1, 0.01);

var datguiMars = datgui.addFolder('Mars');
datguiMars.add(guiMars, 'self_rotation', 0, 1, 0.001)
datguiMars.add(guiMars, 'rotate_around_Sun', 0, 1, 0.01);

var datguiJupiter = datgui.addFolder('Jupiter');
datguiJupiter.add(guiJupiter, 'self_rotation', 0, 1, 0.001)
datguiJupiter.add(guiJupiter, 'rotate_around_Sun', 0, 1, 0.01);

var datguiSaturn = datgui.addFolder('Saturn');
datguiSaturn.add(guiSaturn, 'self_rotation', 0, 1, 0.001)
datguiSaturn.add(guiSaturn, 'rotate_around_Sun', 0, 1, 0.01);

var datguiUranus = datgui.addFolder('Uranus');
datguiUranus.add(guiUranus, 'self_rotation', 0, 1, 0.001)
datguiUranus.add(guiUranus, 'rotate_around_Sun', 0, 1, 0.01);

var datguiNeptune = datgui.addFolder('Neptune');
datguiNeptune.add(guiNeptune, 'self_rotation', 0, 1, 0.001)
datguiNeptune.add(guiNeptune, 'rotate_around_Sun', 0, 1, 0.01);

var datguiPluto = datgui.addFolder('Pluto');
datguiPluto.add(guiPluto, 'self_rotation', 0, 1, 0.001)
datguiPluto.add(guiPluto, 'rotate_around_Sun', 0, 1, 0.01);

///////// hàm thực hiện các phép biến đổi
function animate() {
    //Self-rotation, tự quay quanh trục
    sun.rotateY(guiSun.self_rotation);
    mercury.mesh.rotateY(guiMercury.self_rotation);
    venus.mesh.rotateY(guiVenus.self_rotation);
    earth.mesh.rotateY(guiEarth.self_rotation);
    mars.mesh.rotateY(guiMars.self_rotation);
    jupiter.mesh.rotateY(guiJupiter.self_rotation);
    saturn.mesh.rotateY(guiSaturn.self_rotation);
    uranus.mesh.rotateY(guiUranus.self_rotation );
    neptune.mesh.rotateY(guiNeptune.self_rotation);
    pluto.mesh.rotateY(guiPluto.self_rotation);

    //Around-sun-rotation
    mercury.obj.rotateY(guiMercury.rotate_around_Sun);
    venus.obj.rotateY(guiVenus.rotate_around_Sun);
    earth.obj.rotateY(guiEarth.rotate_around_Sun);
    mars.obj.rotateY(guiMars.rotate_around_Sun);
    jupiter.obj.rotateY(guiJupiter.rotate_around_Sun);
    saturn.obj.rotateY(guiSaturn.rotate_around_Sun);
    uranus.obj.rotateY(guiUranus.rotate_around_Sun);
    neptune.obj.rotateY(guiNeptune.rotate_around_Sun);
    pluto.obj.rotateY(guiPluto.rotate_around_Sun);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

////////////////////
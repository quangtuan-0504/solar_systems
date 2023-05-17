import * as THREE from 'three';
import {OrbitControls} from 'OrbitControls';


/////////// lấy các url tới các hình ảnh
const galaxyTexture = new Image() 
galaxyTexture.src = 'http://127.0.0.1:5500/../img/galaxy.jpg'
console.log('url:',galaxyTexture.src)
//import starsTexture from '../img/stars.jpg';
const starsTexture = new Image() 
starsTexture.src = 'http://127.0.0.1:5500/../img/stars.jpg'

//import sunTexture from '../img/sun.jpg';
const sunTexture = new Image() 
sunTexture.src = 'http://127.0.0.1:5500/../img/sun.jpg'

//import mercuryTexture from '../img/mercury.jpg';
const mercuryTexture = new Image() 
mercuryTexture.src = 'http://127.0.0.1:5500/../img/mercury.jpg'

//import venusTexture from '../img/venus.jpg';
const venusTexture = new Image() 
venusTexture.src = 'http://127.0.0.1:5500/../img/stars.jpg'

//import earthTexture from '../img/earth.jpg';
const earthTexture = new Image() 
earthTexture.src = 'http://127.0.0.1:5500/../img/earth.jpg'

//import marsTexture from '../img/mars.jpg';
const marsTexture = new Image() 
marsTexture.src = 'http://127.0.0.1:5500/../img/mars.jpg'

//import jupiterTexture from '../img/jupiter.jpg';
const jupiterTexture = new Image() 
jupiterTexture.src = 'http://127.0.0.1:5500/../img/jupiter.jpg'

//import saturnTexture from '../img/saturn.jpg';
const saturnTexture = new Image() 
saturnTexture.src = 'http://127.0.0.1:5500/../img/saturn.jpg'

//import saturnRingTexture from '../img/saturn ring.png';
const saturnRingTexture = new Image() 
saturnRingTexture.src = 'http://127.0.0.1:5500/../img/saturn ring.png'

//import uranusTexture from '../img/uranus.jpg';
const uranusTexture = new Image() 
uranusTexture.src = 'http://127.0.0.1:5500/img/uranus.jpg'

//import uranusRingTexture from '../img/uranus ring.png';
const uranusRingTexture = new Image() 
uranusRingTexture.src = 'http://127.0.0.1:5500/../img/uranus ring.png'

//import neptuneTexture from '../img/neptune.jpg';
const neptuneTexture = new Image() 
neptuneTexture.src = 'http://127.0.0.1:5500/../img/neptune.jpg'

//import plutoTexture from '../img/pluto.jpg';
const plutoTexture = new Image() 
plutoTexture.src = 'http://127.0.0.1:5500/../img/pluto.jpg'


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
    map: textureLoader.load(sunTexture.src)
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
///////// hàm thực hiện các phép biến đổi
function animate() {
    //Self-rotation, tự quay quanh trục
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

////////////////////
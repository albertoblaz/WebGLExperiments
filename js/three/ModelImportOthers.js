
var camera, scene, renderer;


init();
animate();

function init() {
	
	// Canvas
	canvas = $('canvas').get(0);
	
	// Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas : canvas });
    renderer.setSize( canvas.width, canvas.height );
    
    // Scene
    scene = new THREE.Scene();
	
	// Camera
    camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 200000 );
    camera.position.z = -2000;
    
    // Skybox
    var urlPrefix	= "../../assets/textures";
	var urls = [ urlPrefix + "/skybox1.jpg", urlPrefix + "/skybox3.jpg",
			urlPrefix + "/skybox5.jpg", urlPrefix + "/skybox4.jpg",
			urlPrefix + "/skybox2.jpg", urlPrefix + "/skybox6.jpg" ];
			
	var textureCube	= THREE.ImageUtils.loadTextureCube( urls );

	var shader	= THREE.ShaderUtils.lib["cube"];
	shader.uniforms["tCube"].value = textureCube;
	var material = new THREE.ShaderMaterial({
		fragmentShader	: shader.fragmentShader,
		vertexShader	: shader.vertexShader,
		uniforms	: shader.uniforms,
		side: THREE.BackSide
	});

	skyboxMesh	= new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );

	scene.add( skyboxMesh );
	
	
    // Light
    var light = new THREE.PointLight( 0xffffff );
	light.position.set( -250, 250, -250 );
	scene.add(light);
    
        
    // Camera controls
    setControls (camera);
    
    // Model import
    var loader = new THREE.JSONLoader();	
	
	tex = THREE.ImageUtils.loadTexture('../../assets/textures/Wolf_Diffuse_256x256.jpg', null, function () {
            mat = new THREE.MeshBasicMaterial({ map: tex, morphTargets: true });
            loader.load('../../assets/models/Wolf.js', function (geo) {
                wolf = new THREE.Mesh(geo, mat);
                wolf.scale.set(20, 20, 20);
				wolf.position.set(0, -500, 0);
                // etc, etc
                scene.add(wolf);
            });
        });      
}

	// Model import others
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( '../../assets/models/duck/duck.dae',function colladaReady( collada ) {
	
	duck = collada.scene;
	geo = collada.scene.children[ 0 ].geometry;
	mat = collada.scene.children[ 0 ].material;
	
	duck.scale.set(10.0, 10.0, 10.0);
	duck.updateMatrix();
	scene.add(duck);
	});

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
}


function render () {
    renderer.render(scene, camera);
}


function setControls (camera){
    controls = new THREE.TrackballControls( camera ); // Creates the controls
    controls.addEventListener( 'change', render );    // Adds a listener for them to work
    controls.maxDistance = 50000;
}
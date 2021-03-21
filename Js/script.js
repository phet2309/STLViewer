function helper(model, eid) {
    var win = document.getElementById(eid);

    var cam = new THREE.PerspectiveCamera(70, win.clientWidth / win.clientHeight,0.5,5000);
    cam.rotation.y = 45/180*Math.PI;
    cam.position.x = 100;
    cam.position.y = 100;
    cam.position.z = 100;

    var renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(win.clientWidth, win.clientHeight);
    win.appendChild(renderer.domElement);

    window.addEventListener("resize", function () {
        renderer.setSize(win.clientWidth, win.clientHeight);
        cam.aspect = win.clientWidth / win.clientHeight;
        cam.updateProjectionMatrix();
      },
      false
    );
    

    var orbit_cnt = new THREE.OrbitControls(cam, renderer.domElement);
    orbit_cnt.enableDamping = true;
    orbit_cnt.rotateSpeed = 0.75;
    orbit_cnt.dampingFactor = 0.1;
    orbit_cnt.enableZoom = true;
    orbit_cnt.autoRotate = true;
    orbit_cnt.autoRotateSpeed = 0.75;

    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.1));
    scene.add(new THREE.PointLight(0xffffff, 0.5));

    var light1=new THREE.PointLight(0xffffff, 0.5);
    light1.position.set(0,-50,0);
    scene.add(light1);

    var light2=new THREE.PointLight(0xffffff, 0.5);
    light2.position.set(0,0,-50);
    scene.add(light2);


    new THREE.STLLoader().load(model, function (geometry) {
      var material = new THREE.MeshPhongMaterial({color: 0x03befc,shininess: 100});
      
      var bone = new THREE.Mesh(geometry, material);
      scene.add(bone);

      var middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(middle);
      bone.geometry.applyMatrix(
        new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
      );

      var loop = function () {
        requestAnimationFrame(loop);
        orbit_cnt.update();
        renderer.render(scene, cam);
      };

      loop();
    });
  }
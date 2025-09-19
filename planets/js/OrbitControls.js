// Simple OrbitControls implementation for testing
THREE.OrbitControls = function(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    // Default state
    this.target = new THREE.Vector3();
    this.enabled = true;
    this.enableRotate = true;
    this.enableZoom = true;
    this.enablePan = true;
    
    // For mouse interaction
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    
    // Spherical coordinates for camera position
    let spherical = new THREE.Spherical();
    let sphericalDelta = new THREE.Spherical();
    
    // Set initial spherical coordinates from camera position
    const offset = new THREE.Vector3();
    offset.copy(camera.position).sub(this.target);
    spherical.setFromVector3(offset);
    
    const onMouseDown = (event) => {
        if (!this.enabled) return;
        isMouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    };
    
    const onMouseMove = (event) => {
        if (!this.enabled || !isMouseDown) return;
        
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        const deltaX = mouseX - lastMouseX;
        const deltaY = mouseY - lastMouseY;
        
        sphericalDelta.theta -= deltaX * 0.01;
        sphericalDelta.phi -= deltaY * 0.01;
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    };
    
    const onMouseUp = () => {
        isMouseDown = false;
    };
    
    const onWheel = (event) => {
        if (!this.enabled || !this.enableZoom) return;
        const scale = event.deltaY > 0 ? 1.1 : 0.9;
        camera.position.multiplyScalar(scale);
    };
    
    // Add event listeners
    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel);
    
    this.update = function() {
        spherical.theta += sphericalDelta.theta;
        spherical.phi += sphericalDelta.phi;
        
        // Constrain phi to avoid flipping
        spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, spherical.phi));
        
        offset.setFromSpherical(spherical);
        camera.position.copy(this.target).add(offset);
        camera.lookAt(this.target);
        
        sphericalDelta.set(0, 0, 0);
    };
};
'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface StarryBackgroundProps {
  starsCount?: number;
  starColor?: string;
  backgroundColor?: string;
  shootingStarsCount?: number;
  shootingStarSpeed?: number;
}

export default function StarryBackground({
  starsCount = 1500,
  starColor = '#ffffff',
  backgroundColor = '#050a24',
  shootingStarsCount = 15,
  shootingStarSpeed = 0.8
}: StarryBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Store a reference to the current container element
    const currentContainer = containerRef.current;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(backgroundColor, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create stars with different sizes and brightness
    const createStars = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starsCount * 3);
      const sizes = new Float32Array(starsCount);
      const colors = new Float32Array(starsCount * 3);
      
      // Create a color object from starColor prop but don't use it directly
      // as we'll create unique colors per star below
      new THREE.Color(starColor);
      
      for (let i = 0; i < starsCount; i++) {
        // Position
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
        
        // Size variation
        sizes[i] = Math.random() * 1.5 + 0.2;
        
        // Color variation (slight blue/purple tints)
        const brightness = 0.7 + Math.random() * 0.3;
        const hue = Math.random() * 0.1 + 0.6; // Blue to purple hue range
        const tempColor = new THREE.Color().setHSL(hue, 0.2, brightness);
        
        colors[i3] = tempColor.r;
        colors[i3 + 1] = tempColor.g;
        colors[i3 + 2] = tempColor.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      // Custom shader material for stars
      const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            // Slight twinkling effect based on time
            float twinkle = sin(time * 0.5 + position.x * 10.0) * 0.2 + 0.8;
            gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            // Create circular points with soft edges
            float r = 0.5 * length(2.0 * gl_PointCoord - 1.0);
            float a = 1.0 - smoothstep(0.5, 1.0, r);
            gl_FragColor = vec4(vColor, a);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      return new THREE.Points(geometry, starsMaterial);
    };
    
    // Create shooting stars
    class ShootingStar {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      acceleration: THREE.Vector3;
      length: number;
      visible: boolean;
      trailPositions: THREE.Vector3[];
      maxTrailLength: number;
      trailLine?: THREE.Line;
      
      constructor() {
        // Start position from a random point at the top half of the screen
        this.position = new THREE.Vector3(
          Math.random() * 150 - 75,
          Math.random() * 50 + 25,
          Math.random() * 50 - 25
        );
        
        // Direction is always diagonally down
        this.velocity = new THREE.Vector3(
          -Math.random() * 3 - 1,
          -Math.random() * 3 - 1,
          0
        );
        
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.length = Math.random() * 10 + 5;
        this.visible = true;
        this.trailPositions = [];
        this.maxTrailLength = Math.floor(Math.random() * 10) + 20;
      }
      
      update() {
        // Store current position for trail
        this.trailPositions.unshift(this.position.clone());
        
        // Remove old trail positions
        if (this.trailPositions.length > this.maxTrailLength) {
          this.trailPositions.pop();
        }
        
        // Update position
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity.clone().multiplyScalar(shootingStarSpeed));
        
        // Hide when out of screen
        if (this.position.x < -100 || this.position.y < -100) {
          this.visible = false;
        }
      }
    }
    
    // Create stars and add to scene
    const starsMesh = createStars();
    scene.add(starsMesh);
    
    // Create shooting stars container
    const shootingStars: ShootingStar[] = [];
    const shootingStarMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    // Nebula background (subtle color variations)
    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float time;
          
          // Simplex noise function
          vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
          
          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                  + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }
          
          void main() {
            vec2 p = vUv * 2.0 - 1.0;
            
            // Multiple noise layers with different scales and movement
            float n1 = snoise(p * 2.0 + time * 0.02);
            float n2 = snoise(p * 4.0 - time * 0.01);
            float n3 = snoise(p * 8.0 + time * 0.03);
            
            float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
            
            // Create nebula color
            vec3 color1 = vec3(0.05, 0.01, 0.20); // Dark blue
            vec3 color2 = vec3(0.1, 0.02, 0.3);   // Purple
            vec3 color3 = vec3(0.0, 0.07, 0.2);   // Deep blue
            
            // Mix colors based on noise
            vec3 finalColor = mix(color1, color2, smoothstep(0.2, 0.6, finalNoise));
            finalColor = mix(finalColor, color3, smoothstep(0.4, 0.8, abs(finalNoise)));
            
            // Radial gradient to fade edges
            float dist = length(p);
            float alpha = smoothstep(1.0, 0.2, dist) * 0.3;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -50;
      return nebula;
    };
    
    const nebula = createNebula();
    scene.add(nebula);
    
    // Add subtle fog for depth effect
    scene.fog = new THREE.FogExp2(backgroundColor, 0.0008);

    // Responsive handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Animation variables
    let frameId: number;
    let time = 0;
    
    // Animation loop
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;
      
      // Update star twinkling
      if (starsMesh.material instanceof THREE.ShaderMaterial) {
        starsMesh.material.uniforms.time.value = time;
      }
      
      // Update nebula
      if (nebula.material instanceof THREE.ShaderMaterial) {
        nebula.material.uniforms.time.value = time;
      }
      
      // Slowly rotate the stars
      starsMesh.rotation.x += 0.0001;
      starsMesh.rotation.y += 0.0002;
      
      // Randomly create new shooting stars
      if (Math.random() < 0.03 && shootingStars.length < shootingStarsCount) {
        shootingStars.push(new ShootingStar());
      }
      
      // Update and draw shooting stars
      shootingStars.forEach((star, index) => {
        if (star.visible) {
          star.update();
          
          // Create trail geometry
          if (star.trailPositions.length > 1) {
            const points = star.trailPositions;
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Create colors array with gradient
            const colors = new Float32Array(points.length * 3);
            for (let i = 0; i < points.length; i++) {
              const i3 = i * 3;
              // Create gradient effect based on position in trail
              const gradientFactor = 1 - (i / points.length);
              // Apply gradient effect to colors (could adjust opacity or brightness)
              const brightness = gradientFactor * 0.7 + 0.3;
              colors[i3] = brightness;     // R
              colors[i3 + 1] = brightness; // G
              colors[i3 + 2] = brightness; // B
            }
            
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            // Remove old trail from scene
            if (star.trailLine) {
              scene.remove(star.trailLine);
              star.trailLine.geometry.dispose();
            }
            
            // Create new trail
            star.trailLine = new THREE.Line(geometry, shootingStarMaterial);
            scene.add(star.trailLine);
          }
        } else {
          // Remove invisible shooting stars
          if (star.trailLine) {
            scene.remove(star.trailLine);
            star.trailLine.geometry.dispose();
          }
          shootingStars.splice(index, 1);
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      
      // Use the stored reference in the cleanup function
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [starsCount, starColor, backgroundColor, shootingStarsCount, shootingStarSpeed]);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
} 
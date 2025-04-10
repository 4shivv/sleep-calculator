'use client';

import { useEffect, useRef } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Star properties
    interface Star {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number;
      twinkleSpeed: number;
      twinkleDirection: number;
      color: string;
    }
    
    // Shooting star properties
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
      tailOpacity: number;
      tailLength: number;
    }
    
    // Create stars
    const starCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 5000), 150);
    const stars: Star[] = [];
    
    // Create color palette of blue and cyan hues
    const colors = ['rgba(173, 216, 230, 1)', 'rgba(135, 206, 235, 1)', 'rgba(176, 224, 230, 1)', 
                    'rgba(240, 248, 255, 1)', 'rgba(137, 207, 240, 1)', 'rgba(0, 191, 255, 1)'];
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.05 + 0.01,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    // Create shooting stars
    const shootingStars: ShootingStar[] = [];
    const shootingStarCount = 5;
    for (let i = 0; i < shootingStarCount; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2, // Start in upper half
        length: Math.random() * 80 + 100,
        speed: Math.random() * 5 + 10,
        angle: Math.random() * Math.PI / 4 + Math.PI / 4, // 45-90 degree angle
        opacity: 0,
        active: false,
        tailOpacity: 0.7,
        tailLength: Math.random() * 20 + 30,
      });
    }
    
    // Timing for shooting stars
    let lastShootingStarTime = Date.now();
    const getNextShootingStarDelay = () => {
      // Random delay between 3-10 seconds
      return Math.random() * 7000 + 3000;
    };
    let nextShootingStarDelay = getNextShootingStarDelay();
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a1128'); // Dark navy blue
      gradient.addColorStop(0.5, '#0f2557'); // Medium blue
      gradient.addColorStop(1, '#1a3b72'); // Lighter blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Check if it's time for a new shooting star
      const currentTime = Date.now();
      if (currentTime - lastShootingStarTime > nextShootingStarDelay) {
        // Activate an inactive shooting star
        const inactiveStars = shootingStars.filter(star => !star.active);
        if (inactiveStars.length > 0) {
          const star = inactiveStars[Math.floor(Math.random() * inactiveStars.length)];
          // Position at a random point on the left side of the screen
          star.x = Math.random() * canvas.width / 4;
          star.y = Math.random() * canvas.height / 3;
          star.active = true;
          star.opacity = 1;
        }
        
        lastShootingStarTime = currentTime;
        nextShootingStarDelay = getNextShootingStarDelay();
      }
      
      // Draw and update shooting stars
      shootingStars.forEach(star => {
        if (star.active) {
          // Calculate movement based on angle and speed
          star.x += Math.cos(star.angle) * star.speed;
          star.y += Math.sin(star.angle) * star.speed;
          
          // Create tail gradient
          const tailX = star.x - Math.cos(star.angle) * star.tailLength;
          const tailY = star.y - Math.sin(star.angle) * star.tailLength;
          
          const tailGradient = ctx.createLinearGradient(
            star.x, star.y, tailX, tailY
          );
          tailGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          tailGradient.addColorStop(0.4, `rgba(176, 224, 230, ${star.opacity * 0.6})`);
          tailGradient.addColorStop(1, `rgba(173, 216, 235, 0)`);
          
          // Draw the shooting star
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = tailGradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Add a glow at the head
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
          
          // Deactivate if off screen
          if (
            star.x > canvas.width + star.tailLength ||
            star.y > canvas.height + star.tailLength ||
            star.x < -star.tailLength ||
            star.y < -star.tailLength
          ) {
            star.active = false;
          }
        }
      });
      
      // Draw stars
      stars.forEach(star => {
        // Update star position (slight movement)
        star.y += star.speed;
        
        // Reset position if star moves off bottom
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Twinkle effect (opacity change)
        star.opacity += star.twinkleSpeed * star.twinkleDirection;
        
        // Change direction if opacity reaches limits
        if (star.opacity > 0.9 || star.opacity < 0.3) {
          star.twinkleDirection *= -1;
        }
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Use the star's color with its opacity
        const color = star.color.replace('1)', `${star.opacity})`);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Draw glow effect for brighter stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace('1)', `${star.opacity * 0.15})`);
          ctx.fill();
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}
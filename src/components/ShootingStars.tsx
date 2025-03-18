'use client';

import { useEffect, useRef } from 'react';

interface ShootingStarsProps {
  count?: number;
  speed?: number;
  opacity?: number;
}

export default function ShootingStars({ 
  count = 15, 
  speed = 10, 
  opacity = 0.3 
}: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Create shooting stars
    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      size: number;
      color: string;
      active: boolean;

      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight / 2;
        this.length = Math.random() * 80 + 10;
        this.speed = Math.random() * speed + 5;
        this.size = Math.random() * 1 + 0.1;
        this.color = `rgba(255, 255, 255, ${Math.random() * opacity + 0.1})`;
        this.active = true;
      }

      draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.lineWidth = this.size;
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.length, this.y + this.length);
        context.stroke();
      }

      update() {
        this.x -= this.speed;
        this.y += this.speed;

        if (this.x < 0 || this.y > window.innerHeight) {
          this.active = false;
        }
      }
    }

    const shootingStars: ShootingStar[] = [];

    // Animation loop
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new shooting stars randomly
      if (Math.random() < 0.03 && shootingStars.length < count) {
        shootingStars.push(new ShootingStar());
      }

      // Update and draw shooting stars
      for (let i = 0; i < shootingStars.length; i++) {
        const star = shootingStars[i];
        if (star.active) {
          star.draw(ctx);
          star.update();
        } else {
          shootingStars.splice(i, 1);
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
} 
/**
 * Ambient Animated Canvas Background with Floating Leaves & Organic Particles
 */
(function() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let leaves = [];
  let mouse = { x: null, y: null, radius: 180 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initLeaves();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Leaf {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // initial random spread
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 14 + 10;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = Math.random() * 0.4 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.02;

      // Color Palette: Deep Emerald (60%), Gold Warm (30%), Terracotta (10%)
      const rand = Math.random();
      if (rand < 0.6) {
        this.color = 'rgba(36, 92, 75, ' + (Math.random() * 0.35 + 0.15) + ')';
        this.strokeColor = 'rgba(143, 185, 168, 0.3)';
      } else if (rand < 0.88) {
        this.color = 'rgba(230, 197, 148, ' + (Math.random() * 0.3 + 0.15) + ')';
        this.strokeColor = 'rgba(240, 212, 168, 0.4)';
      } else {
        this.color = 'rgba(111, 78, 55, ' + (Math.random() * 0.3 + 0.15) + ')';
        this.strokeColor = 'rgba(212, 163, 115, 0.3)';
      }
    }

    update() {
      this.x += this.vx + Math.sin(this.y * 0.01) * 0.3;
      this.y += this.vy;
      this.rotation += this.vRot;

      if (this.y > height + 30) {
        this.reset();
      }

      // Gentle mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Draw leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);
      
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Leaf midrib line
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(0, this.size * 0.8);
      ctx.stroke();

      ctx.restore();
    }
  }

  function initLeaves() {
    leaves = [];
    const count = Math.min(Math.floor((width * height) / 22000), 45);
    for (let i = 0; i < count; i++) {
      leaves.push(new Leaf());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    leaves.forEach(l => {
      l.update();
      l.draw();
    });

    requestAnimationFrame(animate);
  }

  resize();
  animate();
})();

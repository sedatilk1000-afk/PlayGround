/* Pixel-art courtroom, drawn entirely on a 640x360 canvas and scaled up
   with crisp nearest-neighbour rendering. */

const W = 640;
const H = 360;

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t;
const rand = (seed) => {
  let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = clamp(((n >> 16) & 255) + amount, 0, 255);
  const g = clamp(((n >> 8) & 255) + amount, 0, 255);
  const b = clamp((n & 255) + amount, 0, 255);
  return `rgb(${r},${g},${b})`;
}

export class CourtroomScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.caseData = null;
    this.time = 0;
    this.last = 0;
    this.raf = null;
    this.entrance = 1;
    this.mood = 'worried';
    this.gavelAnim = null;
    this.shake = 0;
    this.flash = 0;
    this.slamDone = false;
    this.onSlam = null;
    this.rain = [];
    this.dust = [];
    this.crowd = [];
    this.buildAtmosphere();
    this.loop = this.loop.bind(this);
  }

  buildAtmosphere() {
    let s = 1;
    const rr = () => rand(s++);
    for (let i = 0; i < 46; i++) {
      this.rain.push({
        x: rr(),
        y: rr(),
        speed: 0.35 + rr() * 0.5,
        len: 3 + Math.floor(rr() * 5),
        window: i % 2,
      });
    }
    for (let i = 0; i < 30; i++) {
      this.dust.push({
        x: 40 + rr() * 220,
        y: 60 + rr() * 170,
        speed: 2 + rr() * 5,
        drift: (rr() - 0.5) * 4,
        alpha: 0.08 + rr() * 0.18,
      });
    }
    const positions = [
      [24, 150, 1.05, 0], [58, 150, 1, 1], [94, 151, 0.95, 2], [128, 150, 1, 3],
      [346, 150, 1, 1], [380, 151, 0.95, 4], [414, 150, 1.05, 0], [464, 150, 1, 2],
      [500, 151, 0.92, 5], [536, 150, 1.02, 1], [572, 150, 0.96, 3], [606, 151, 1, 4],
      [34, 178, 1.12, 3], [82, 178, 1.04, 2], [120, 179, 0.98, 1],
      [370, 178, 1.04, 0], [412, 178, 1.1, 4], [466, 179, 1, 2], [508, 178, 1.06, 5],
      [552, 178, 0.98, 1], [596, 179, 1.04, 3],
    ];
    this.crowd = positions.map(([x, y, scale, variant], i) => ({
      x, y, scale, variant,
      phase: (i * 1.7) % 6.28,
      tone: ['#241a17', '#2b1e19', '#201612', '#2d201a'][variant % 4],
    }));
  }

  setCase(data) {
    this.caseData = data;
    this.entrance = 0;
    this.mood = 'worried';
    this.gavelAnim = null;
    this.flash = 0;
    this.shake = 0;
    this.start();
  }

  resetGavel() {
    this.gavelAnim = null;
    this.flash = 0;
    this.shake = 0;
    this.mood = 'worried';
    this.slamDone = false;
  }

  strikeGavel(mood = 'guilty', onSlam) {
    this.mood = mood;
    this.gavelAnim = { start: this.time, duration: 1.15 };
    this.onSlam = onSlam;
    this.slamDone = false;
  }

  start() {
    if (this.raf != null) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.raf != null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    if (this.entrance < 1) this.entrance = clamp(this.entrance + dt * 1.55, 0, 1);
    this.updateGavel();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  }

  updateGavel() {
    if (!this.gavelAnim) return;
    const g = this.gavelAnim;
    const t = clamp((this.time - g.start) / g.duration, 0, 1);
    if (t > 0.27 && !this.slamDone) {
      this.slamDone = true;
      this.shake = 1;
      this.flash = 1;
      if (this.onSlam) this.onSlam();
    }
    if (t >= 1) this.gavelAnim = null;
    this.shake = Math.max(0, this.shake - 0.06);
    this.flash = Math.max(0, this.flash - 0.09);
  }

  draw() {
    const ctx = this.ctx;
    const t = this.time;
    ctx.save();
    ctx.clearRect(0, 0, W, H);

    if (this.shake > 0) {
      const s = this.shake * 4;
      ctx.translate(
        Math.round((rand(t * 101) - 0.5) * s),
        Math.round((rand(t * 137 + 4) - 0.5) * s)
      );
    }

    this.drawRoom(ctx, t);
    this.drawWindows(ctx, t);
    this.drawEmblem(ctx);
    this.drawGallery(ctx, t);
    this.drawFloor(ctx);

    // Spots of warm light
    this.spotlight(ctx, 222, 150, 145, 'rgba(255, 216, 140, 0.16)');
    this.spotlight(ctx, 486, 158, 105, 'rgba(255, 216, 140, 0.10)');

    if (this.caseData) {
      const d = this.caseData.defendant.look;
      const w = this.caseData.witness.look;
      this.drawWitness(ctx, w, t);
      this.drawWitnessStand(ctx);
      this.drawSuspect(ctx, d, t);
      this.drawDock(ctx);
    } else {
      this.drawEmptyDock(ctx);
    }

    this.drawDust(ctx, t);
    this.drawBench(ctx, t, this.caseData ? this.caseData.defendant.name : null);

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255, 238, 200, ${this.flash * 0.28})`;
      ctx.fillRect(0, 0, W, H);
      this.drawSlamBurst(ctx);
    }

    // vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, 90, W / 2, H / 2, 340);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(5,3,2,0.62)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // faint warm film tint
    ctx.fillStyle = 'rgba(255,190,90,0.018)';
    ctx.fillRect(0, 0, W, H);

    ctx.restore();
  }

  spotlight(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(0.55, color.replace(/[\d.]+\)$/, '0.05)'));
    g.addColorStop(1, 'rgba(255,216,140,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  drawRoom(ctx) {
    const wall = ctx.createLinearGradient(0, 16, 0, 236);
    wall.addColorStop(0, '#33231b');
    wall.addColorStop(0.45, '#281a13');
    wall.addColorStop(1, '#1d120d');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, 240);

    // vertical panelling
    for (let x = 0; x < W; x += 40) {
      ctx.fillStyle = '#3b291e';
      ctx.fillRect(x, 22, 2, 204);
      ctx.fillStyle = '#1b110c';
      ctx.fillRect(x + 2, 22, 1, 204);
      ctx.fillStyle = '#221610';
      ctx.fillRect(x + 20, 22, 1, 204);
    }

    // crown moulding
    ctx.fillStyle = '#1a100b';
    ctx.fillRect(0, 0, W, 8);
    ctx.fillStyle = '#543b29';
    ctx.fillRect(0, 8, W, 3);
    ctx.fillStyle = '#7a583a';
    ctx.fillRect(0, 11, W, 2);
    ctx.fillStyle = '#2c1d14';
    ctx.fillRect(0, 13, W, 7);
    ctx.fillStyle = '#3f2b1e';
    ctx.fillRect(0, 20, W, 2);

    // chair rail & wainscot
    ctx.fillStyle = '#3f2b1e';
    ctx.fillRect(0, 120, W, 3);
    ctx.fillStyle = '#6b4c33';
    ctx.fillRect(0, 120, W, 1);
    ctx.fillStyle = '#1b110c';
    ctx.fillRect(0, 123, W, 6);
    ctx.fillStyle = '#1f140f';
    ctx.fillRect(0, 129, W, 107);

    for (let x = 0; x < W; x += 40) {
      ctx.fillStyle = '#261812';
      ctx.fillRect(x + 6, 138, 28, 82);
      ctx.fillStyle = '#2f1f17';
      ctx.fillRect(x + 7, 139, 26, 2);
      ctx.fillStyle = '#180f0b';
      ctx.fillRect(x + 7, 218, 26, 2);
    }

    // baseboard / floor line
    ctx.fillStyle = '#150d09';
    ctx.fillRect(0, 232, W, 30);
    ctx.fillStyle = '#3a271b';
    ctx.fillRect(0, 232, W, 3);
    this.text(ctx, 'ADALET SALONUNDA', 320, 116, 7, '#7c5a36', 'Press Start 2P, monospace', 'center');
  }

  drawWindows(ctx, t) {
    const windows = [
      { x: 26, y: 34, w: 78, h: 104 },
      { x: 536, y: 34, w: 78, h: 104 },
    ];
    windows.forEach((win, wi) => {
      // glow behind frame
      const glow = ctx.createRadialGradient(win.x + win.w / 2, win.y + win.h / 2, 4, win.x + win.w / 2, win.y + win.h / 2, 90);
      glow.addColorStop(0, 'rgba(120,155,200,0.13)');
      glow.addColorStop(1, 'rgba(120,155,200,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(win.x - 40, win.y - 30, win.w + 80, win.h + 70);

      // frame
      ctx.fillStyle = '#4a3222';
      ctx.fillRect(win.x - 6, win.y - 6, win.w + 12, win.h + 12);
      ctx.fillStyle = '#2a1a12';
      ctx.fillRect(win.x - 3, win.y - 3, win.w + 6, win.h + 6);
      ctx.fillStyle = '#6d4c31';
      ctx.fillRect(win.x - 6, win.y - 6, win.w + 12, 2);
      ctx.fillStyle = '#17100f';
      ctx.fillRect(win.x, win.y, win.w, win.h);

      // night glass
      const night = ctx.createLinearGradient(win.x, win.y, win.x, win.y + win.h);
      night.addColorStop(0, '#0a1422');
      night.addColorStop(0.65, '#132235');
      night.addColorStop(1, '#1a2b3c');
      ctx.fillStyle = night;
      ctx.fillRect(win.x, win.y, win.w, win.h);

      // moon
      ctx.fillStyle = 'rgba(214,210,176,0.75)';
      ctx.fillRect(win.x + 50, win.y + 14, 9, 9);
      ctx.fillStyle = 'rgba(214,210,176,0.28)';
      ctx.fillRect(win.x + 47, win.y + 11, 15, 15);

      // distant rooftops
      ctx.fillStyle = '#0a111a';
      ctx.fillRect(win.x, win.y + win.h - 22, win.w, 22);
      for (let i = 0; i < 8; i++) {
        const bx = win.x + i * 11;
        const bh = 5 + ((i * 7 + wi * 3) % 12);
        ctx.fillRect(bx, win.y + win.h - 22 - bh, 8, bh);
      }

      // rain
      ctx.save();
      ctx.beginPath();
      ctx.rect(win.x, win.y, win.w, win.h);
      ctx.clip();
      for (const drop of this.rain) {
        if (drop.window !== wi) continue;
        const x = win.x + ((drop.x * win.w + t * 5) % win.w);
        const y = win.y + ((drop.y * win.h + t * 34 * drop.speed) % win.h);
        ctx.fillStyle = 'rgba(158,184,204,0.22)';
        ctx.fillRect(Math.round(x), Math.round(y), 1, drop.len);
      }
      ctx.restore();

      // mullions
      ctx.fillStyle = '#3a271b';
      ctx.fillRect(win.x + Math.floor(win.w / 2) - 1, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y + Math.floor(win.h / 2) - 1, win.w, 2);
      ctx.fillStyle = '#5c402b';
      ctx.fillRect(win.x + Math.floor(win.w / 2) - 1, win.y, 1, win.h);
      ctx.fillStyle = '#6b4b31';
      ctx.fillRect(win.x - 8, win.y + win.h + 4, win.w + 16, 4);
    });

    // hanging lamps
    const lamps = [200, 440];
    lamps.forEach((x, i) => {
      const flicker = 0.86 + Math.sin(t * 2.1 + i * 2) * 0.05 + Math.sin(t * 7.7 + i) * 0.03;
      ctx.fillStyle = '#0f0a08';
      ctx.fillRect(x, 0, 2, 24);
      ctx.fillStyle = '#c8a45c';
      ctx.fillRect(x - 1, 23, 4, 3);
      ctx.fillStyle = '#2f4a3b';
      ctx.beginPath();
      ctx.moveTo(x - 14, 36);
      ctx.lineTo(x + 14, 36);
      ctx.lineTo(x + 8, 26);
      ctx.lineTo(x - 8, 26);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#4d715b';
      ctx.fillRect(x - 8, 27, 16, 2);
      ctx.fillStyle = '#c8a45c';
      ctx.fillRect(x - 14, 36, 28, 2);
      const g = ctx.createRadialGradient(x, 44, 2, x, 50, 70);
      g.addColorStop(0, `rgba(255,218,140,${0.17 * flicker})`);
      g.addColorStop(0.5, 'rgba(255,206,120,0.05)');
      g.addColorStop(1, 'rgba(255,200,110,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 75, 30, 150, 140);
      ctx.fillStyle = `rgba(255, 232, 168, ${0.9 * flicker})`;
      ctx.fillRect(x - 2, 38, 4, 4);
    });
  }

  drawEmblem(ctx) {
    const cx = 320;
    const cy = 74;
    // pixelated brass roundel
    this.pixelDisc(ctx, cx, cy, 36, '#1c120d');
    this.pixelDisc(ctx, cx, cy, 33, '#7c5d34');
    this.pixelDisc(ctx, cx, cy, 31, '#2a1b12');
    this.pixelDisc(ctx, cx, cy, 29, '#1b110c');

    ctx.fillStyle = '#c9a45c';
    ctx.fillRect(cx - 1, cy - 18, 2, 30);
    ctx.fillRect(cx - 15, cy - 14, 30, 2);
    ctx.fillRect(cx - 18, cy + 12, 36, 2);
    ctx.fillRect(cx - 2, cy + 12, 4, 4);
    ctx.fillRect(cx - 5, cy + 16, 10, 2);
    ctx.fillStyle = '#e2c47a';
    ctx.fillRect(cx - 2, cy - 20, 3, 3);
    // chains
    ctx.fillStyle = '#a88745';
    ctx.fillRect(cx - 15, cy - 12, 1, 7);
    ctx.fillRect(cx + 14, cy - 12, 1, 7);
    // pans
    ctx.fillStyle = '#c9a45c';
    ctx.fillRect(cx - 22, cy - 5, 14, 2);
    ctx.fillRect(cx - 24, cy - 3, 18, 2);
    ctx.fillRect(cx - 22, cy - 1, 14, 2);
    ctx.fillRect(cx + 8, cy - 5, 14, 2);
    ctx.fillRect(cx + 6, cy - 3, 18, 2);
    ctx.fillRect(cx + 8, cy - 1, 14, 2);
    // highlight
    ctx.fillStyle = 'rgba(255,226,160,0.22)';
    ctx.fillRect(cx - 26, cy - 24, 22, 2);
  }

  pixelDisc(ctx, cx, cy, r, color) {
    ctx.fillStyle = color;
    for (let y = -r; y <= r; y += 2) {
      const half = Math.floor(Math.sqrt(r * r - y * y));
      ctx.fillRect(cx - half, cy + y, half * 2, 2);
    }
  }

  drawGallery(ctx, t) {
    // benches behind the court
    ctx.fillStyle = '#241711';
    ctx.fillRect(0, 163, W, 9);
    ctx.fillStyle = '#3b281c';
    ctx.fillRect(0, 161, W, 3);
    ctx.fillStyle = '#1a100c';
    ctx.fillRect(0, 172, W, 8);
    ctx.fillStyle = '#2a1a12';
    ctx.fillRect(0, 190, W, 8);
    ctx.fillStyle = '#3a271b';
    ctx.fillRect(0, 188, W, 3);

    const sorted = [...this.crowd].sort((a, b) => a.y - b.y);
    for (const person of sorted) {
      const bob = Math.sin(t * 0.9 + person.phase) * 0.6;
      const x = Math.round(person.x);
      const y = Math.round(person.y + bob);
      const s = person.scale;
      // torso
      ctx.fillStyle = person.tone;
      ctx.fillRect(Math.round(x - 6 * s), Math.round(y + 5 * s), Math.round(12 * s), Math.round(9 * s));
      // head
      ctx.fillRect(Math.round(x - 3 * s), Math.round(y - 1 * s), Math.round(6 * s), Math.round(6 * s));
      // hat / hair
      ctx.fillStyle = shade(person.tone, 14);
      ctx.fillRect(Math.round(x - 3 * s), Math.round(y - 2 * s), Math.round(6 * s), Math.round(2 * s));
      if (person.variant % 3 === 0) {
        ctx.fillRect(Math.round(x - 4 * s), Math.round(y - 1 * s), Math.round(8 * s), 1);
      }
      // collar glint
      ctx.fillStyle = 'rgba(190,170,140,0.13)';
      ctx.fillRect(Math.round(x - 2 * s), Math.round(y + 5 * s), Math.round(4 * s), 1);
    }
  }

  drawFloor(ctx) {
    const g = ctx.createLinearGradient(0, 238, 0, 270);
    g.addColorStop(0, '#2a1a12');
    g.addColorStop(1, '#1a100b');
    ctx.fillStyle = g;
    ctx.fillRect(0, 238, W, 34);
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 ? '#22150f' : '#241711';
      ctx.fillRect(0, 244 + i * 3, W, 1);
    }
  }

  drawDock(ctx) {
    // rear posts and top rail
    ctx.fillStyle = '#2b190f';
    ctx.fillRect(142, 186, 10, 78);
    ctx.fillRect(300, 186, 10, 78);
    ctx.fillStyle = '#6a4328';
    ctx.fillRect(142, 186, 3, 78);
    ctx.fillRect(302, 186, 3, 78);
    // finials
    ctx.fillStyle = '#b0894e';
    ctx.fillRect(145, 181, 4, 5);
    ctx.fillRect(303, 181, 4, 5);
    ctx.fillStyle = '#d3b26a';
    ctx.fillRect(146, 181, 2, 2);
    ctx.fillRect(304, 181, 2, 2);

    // top rail
    ctx.fillStyle = '#3b2417';
    ctx.fillRect(135, 195, 182, 13);
    ctx.fillStyle = '#7b5130';
    ctx.fillRect(135, 195, 182, 3);
    ctx.fillStyle = '#a27646';
    ctx.fillRect(135, 195, 182, 1);
    ctx.fillStyle = '#25150d';
    ctx.fillRect(135, 207, 182, 4);
    ctx.fillStyle = '#5a3822';
    ctx.fillRect(135, 195, 4, 13);
    ctx.fillRect(313, 195, 4, 13);

    // front panel
    ctx.fillStyle = '#3c2417';
    ctx.fillRect(142, 211, 168, 55);
    ctx.fillStyle = '#2b190f';
    ctx.fillRect(150, 217, 63, 42);
    ctx.fillRect(238, 217, 63, 42);
    ctx.fillStyle = '#4c2f1d';
    ctx.fillRect(151, 218, 61, 2);
    ctx.fillRect(239, 218, 61, 2);
    ctx.fillStyle = '#5d3b24';
    ctx.fillRect(151, 218, 2, 39);
    ctx.fillRect(239, 218, 2, 39);
    ctx.fillStyle = '#1f120b';
    ctx.fillRect(151, 257, 61, 2);
    ctx.fillRect(239, 257, 61, 2);

    // brass studs
    ctx.fillStyle = '#a9874d';
    ctx.fillRect(146, 213, 2, 2);
    ctx.fillRect(304, 213, 2, 2);
    ctx.fillRect(146, 257, 2, 2);
    ctx.fillRect(304, 257, 2, 2);

    // nameplate
    ctx.fillStyle = '#1b110b';
    ctx.fillRect(198, 211, 56, 12);
    ctx.fillStyle = '#a9874d';
    ctx.fillRect(199, 212, 54, 10);
    ctx.fillStyle = '#6e552c';
    ctx.fillRect(200, 213, 52, 1);
    this.text(ctx, 'SANIK', 226, 218, 4.5, '#2b1c0f', 'Press Start 2P, monospace', 'center');
  }

  drawWitnessStand(ctx) {
    ctx.fillStyle = '#2b190f';
    ctx.fillRect(412, 196, 10, 68);
    ctx.fillRect(548, 196, 10, 68);
    ctx.fillStyle = '#6a4328';
    ctx.fillRect(412, 196, 3, 68);
    ctx.fillRect(550, 196, 3, 68);

    ctx.fillStyle = '#3b2417';
    ctx.fillRect(404, 202, 162, 11);
    ctx.fillStyle = '#7b5130';
    ctx.fillRect(404, 202, 162, 3);
    ctx.fillStyle = '#a27646';
    ctx.fillRect(404, 202, 162, 1);
    ctx.fillStyle = '#25150d';
    ctx.fillRect(404, 213, 162, 3);

    ctx.fillStyle = '#3c2417';
    ctx.fillRect(410, 216, 150, 50);
    ctx.fillStyle = '#2b190f';
    ctx.fillRect(419, 221, 132, 38);
    ctx.fillStyle = '#4c2f1d';
    ctx.fillRect(420, 222, 130, 2);
    ctx.fillStyle = '#5d3b24';
    ctx.fillRect(420, 222, 2, 35);
    ctx.fillStyle = '#1f120b';
    ctx.fillRect(420, 255, 130, 2);

    ctx.fillStyle = '#1b110b';
    ctx.fillRect(464, 216, 52, 11);
    ctx.fillStyle = '#a9874d';
    ctx.fillRect(465, 217, 50, 9);
    this.text(ctx, 'TANIK', 490, 223, 4.5, '#2b1c0f', 'Press Start 2P, monospace', 'center');
  }

  drawEmptyDock(ctx) {
    ctx.fillStyle = '#2b190f';
    ctx.fillRect(142, 186, 10, 78);
    ctx.fillRect(300, 186, 10, 78);
    ctx.fillStyle = '#5a3822';
    ctx.fillRect(135, 195, 182, 13);
    ctx.fillStyle = '#3c2417';
    ctx.fillRect(142, 211, 168, 55);
    ctx.fillStyle = '#2b190f';
    ctx.fillRect(150, 217, 63, 42);
    ctx.fillRect(238, 217, 63, 42);
  }

  drawSuspect(ctx, look, t) {
    const ent = easeOut(this.entrance);
    const breathe = Math.sin(t * 1.8) * 0.7;
    ctx.save();
    ctx.globalAlpha = ent;
    ctx.translate(0, Math.round((1 - ent) * 10));
    this.drawPerson(ctx, look, 222, 116 + breathe, 2, this.mood, false);
    ctx.restore();
  }

  drawWitness(ctx, look, t) {
    const ent = easeOut(clamp((this.entrance - 0.12) / 0.88, 0, 1));
    const breathe = Math.sin(t * 1.6 + 2) * 0.5;
    ctx.save();
    ctx.globalAlpha = ent * 0.94;
    ctx.translate(0, Math.round((1 - ent) * 8));
    this.drawPerson(ctx, look, 486, 130 + breathe, 2, 'worried', true);
    ctx.restore();
  }

  drawPerson(ctx, look, cx, topY, u = 2, mood = 'worried', muted = false) {
    const outline = '#160f0c';
    const skin = look.skin;
    const skinShade = look.shade;
    const hair = look.hair;
    const hairDark = look.hairDark;
    const outfit = look.outfit;
    const outfitDark = look.outfitDark;
    const shirt = look.shirt;
    const accent = look.accent;
    const broad = look.build === 'broad' ? 2 : look.build === 'slim' ? -1 : 0;
    const shoulderW = 15 + broad;
    const headW = 10;
    const headH = 12;
    const headTop = topY + 3 * u;
    const headX = Math.round(cx - (headW * u) / 2);

    // body silhouette (stacked rows for a slightly tapered coat)
    const bodyTop = topY + 16 * u;
    const bodyBottom = topY + 43 * u;
    const rows = 14;
    for (let i = 0; i < rows; i++) {
      const p = i / (rows - 1);
      const w = Math.round((shoulderW - p * 2.2) * u);
      const x = Math.round(cx - w / 2);
      const y = Math.round(bodyTop + p * (bodyBottom - bodyTop));
      const h = Math.ceil((bodyBottom - bodyTop) / rows) + 1;
      ctx.fillStyle = outline;
      ctx.fillRect(x - 1, y, w + 2, h);
      ctx.fillStyle = i < 2 ? shade(outfit, 10) : outfit;
      ctx.fillRect(x, y, w, h);
      // shaded edges
      ctx.fillStyle = outfitDark;
      ctx.fillRect(x, y, Math.max(1, u - 1), h);
      ctx.fillRect(x + w - Math.max(1, u - 1), y, Math.max(1, u - 1), h);
    }

    // arms
    const armW = 3 * u;
    ctx.fillStyle = outline;
    ctx.fillRect(Math.round(cx - shoulderW * u / 2 - 1), Math.round(bodyTop + 2 * u), armW + 2, Math.round(19 * u));
    ctx.fillRect(Math.round(cx + shoulderW * u / 2 - armW - 1), Math.round(bodyTop + 2 * u), armW + 2, Math.round(19 * u));
    ctx.fillStyle = shade(outfit, -4);
    ctx.fillRect(Math.round(cx - shoulderW * u / 2), Math.round(bodyTop + 2 * u), armW, Math.round(19 * u));
    ctx.fillRect(Math.round(cx + shoulderW * u / 2 - armW), Math.round(bodyTop + 2 * u), armW, Math.round(19 * u));
    ctx.fillStyle = outfitDark;
    ctx.fillRect(Math.round(cx - shoulderW * u / 2), Math.round(bodyTop + 2 * u), 1, Math.round(19 * u));
    ctx.fillRect(Math.round(cx + shoulderW * u / 2 - 1), Math.round(bodyTop + 2 * u), 1, Math.round(19 * u));

    // neck
    ctx.fillStyle = outline;
    ctx.fillRect(Math.round(cx - 3 * u), Math.round(topY + 13 * u), 6 * u, 4 * u);
    ctx.fillStyle = skinShade;
    ctx.fillRect(Math.round(cx - 2.5 * u), Math.round(topY + 13 * u), 5 * u, 3.5 * u);

    // shirt & collar
    ctx.fillStyle = shirt;
    ctx.fillRect(Math.round(cx - 3 * u), Math.round(bodyTop), 6 * u, 6 * u);
    ctx.fillStyle = '#c7b897';
    ctx.fillRect(Math.round(cx + 1 * u), Math.round(bodyTop), 2 * u, 6 * u);
    const collarY = Math.round(bodyTop + u);
    ctx.fillStyle = shirt;
    ctx.fillRect(Math.round(cx - 3.5 * u), collarY, 2 * u, 2 * u);
    ctx.fillRect(Math.round(cx + 1.5 * u), collarY, 2 * u, 2 * u);
    ctx.fillStyle = outline;
    ctx.fillRect(Math.round(cx - 1.5 * u), Math.round(bodyTop + u), u, u);
    ctx.fillRect(Math.round(cx + 0.5 * u), Math.round(bodyTop + u), u, u);

    // tie / bow tie / brooch
    if (look.accessory === 'bowtie') {
      ctx.fillStyle = accent;
      ctx.fillRect(Math.round(cx - 3 * u), Math.round(bodyTop + 2 * u), 2 * u, u);
      ctx.fillRect(Math.round(cx + u), Math.round(bodyTop + 2 * u), 2 * u, u);
      ctx.fillStyle = shade(accent, 26);
      ctx.fillRect(Math.round(cx - u), Math.round(bodyTop + 2 * u), 2 * u, u);
    } else if (look.accessory === 'brooch') {
      ctx.fillStyle = '#d8b45f';
      ctx.fillRect(Math.round(cx + 2 * u), Math.round(bodyTop + 3 * u), 2 * u, 2 * u);
      ctx.fillStyle = '#f4da95';
      ctx.fillRect(Math.round(cx + 2 * u + 1), Math.round(bodyTop + 3 * u + 1), 2, 2);
    } else {
      ctx.fillStyle = accent;
      ctx.fillRect(Math.round(cx - u), Math.round(bodyTop + 2 * u), 2 * u, 6 * u);
      ctx.fillStyle = outline;
      ctx.fillRect(Math.round(cx - u), Math.round(bodyTop + 2 * u), 2 * u, 1);
      ctx.fillRect(Math.round(cx - u), Math.round(bodyTop + 7 * u), 2 * u, 1);
    }

    // ears
    ctx.fillStyle = outline;
    ctx.fillRect(headX - u, Math.round(headTop + 5 * u), u, 3 * u);
    ctx.fillRect(headX + headW * u, Math.round(headTop + 5 * u), u, 3 * u);
    ctx.fillStyle = skinShade;
    ctx.fillRect(headX - u + 1, Math.round(headTop + 5 * u + 1), u - 1, 2 * u);
    ctx.fillRect(headX + headW * u, Math.round(headTop + 5 * u + 1), u - 1, 2 * u);

    // head shape
    const headRows = [6, 8, 10, 10, 10, 10, 10, 10, 9, 9, 8, 6];
    headRows.forEach((wUnits, i) => {
      const w = wUnits * u;
      const x = Math.round(cx - w / 2);
      const y = Math.round(headTop + i * u);
      ctx.fillStyle = outline;
      ctx.fillRect(x - 1, y, w + 2, u + 1);
      ctx.fillStyle = i > 7 ? skinShade : skin;
      ctx.fillRect(x, y, w, u + 1);
      ctx.fillStyle = i > 8 ? skinShade : shade(skin, -7);
      ctx.fillRect(x + w - 2 * u, y, 2 * u, u + 1);
      if (i < 3) {
        ctx.fillStyle = 'rgba(255,235,200,0.18)';
        ctx.fillRect(x + 2 * u, y, w - 4 * u, 1);
      }
    });

    // hair
    this.drawHair(ctx, look, cx, headTop, headW, u, hair, hairDark, outline);

    // facial features
    const eyeY = Math.round(headTop + 5.5 * u);
    const leftEye = Math.round(cx - 3 * u);
    const rightEye = Math.round(cx + u);
    const browDrop = mood === 'guilty' ? 1 : 0;
    const eyeH = mood === 'innocent' ? 1 : Math.max(1, Math.round(1.5 * u));
    ctx.fillStyle = outline;
    if (mood === 'innocent') {
      ctx.fillRect(leftEye, eyeY + 1, 2 * u, 1);
      ctx.fillRect(rightEye, eyeY + 1, 2 * u, 1);
    } else {
      ctx.fillRect(leftEye, eyeY, 1.5 * u, eyeH);
      ctx.fillRect(rightEye, eyeY, 1.5 * u, eyeH);
      if (eyeH > 2) {
        ctx.fillStyle = 'rgba(255,245,220,0.55)';
        ctx.fillRect(leftEye + 1, eyeY + 1, 1, 1);
        ctx.fillRect(rightEye + 1, eyeY + 1, 1, 1);
        ctx.fillStyle = outline;
      }
    }

    // brows
    ctx.fillStyle = hairDark;
    if (mood === 'guilty') {
      ctx.fillRect(leftEye - 1, eyeY - 3 + browDrop, 2 * u, 1);
      ctx.fillRect(rightEye, eyeY - 2 + browDrop, 2 * u, 1);
    } else if (mood === 'innocent') {
      ctx.fillRect(leftEye, eyeY - 3, 2 * u, 1);
      ctx.fillRect(rightEye, eyeY - 3, 2 * u, 1);
    } else {
      ctx.fillRect(leftEye - 1, eyeY - 3, 2 * u, 1);
      ctx.fillRect(rightEye, eyeY - 3, 2 * u, 1);
      ctx.fillRect(leftEye + 2 * u, eyeY - 2, u, 1);
    }

    // nose
    ctx.fillStyle = skinShade;
    ctx.fillRect(Math.round(cx), Math.round(headTop + 7.5 * u), u, 1.5 * u);

    // mouth
    const mouthY = Math.round(headTop + 9.5 * u);
    ctx.fillStyle = '#4a2824';
    if (mood === 'guilty') {
      ctx.fillRect(Math.round(cx - 2 * u), mouthY + 1, 4 * u, 1);
      ctx.fillRect(Math.round(cx - 1 * u), mouthY, 2 * u, 1);
    } else if (mood === 'innocent') {
      ctx.fillRect(Math.round(cx - 2 * u), mouthY, 4 * u, 1);
      ctx.fillRect(Math.round(cx - 1.5 * u), mouthY - 1, 3 * u, 1);
    } else {
      ctx.fillRect(Math.round(cx - 2 * u), mouthY, 4 * u, 1);
    }

    // moustache / beard
    if (look.accessory === 'mustache') {
      ctx.fillStyle = hair;
      ctx.fillRect(Math.round(cx - 2.5 * u), mouthY - 2, 5 * u, 1);
    }
    if (look.accessory === 'beard' || look.accessory === 'mustache') {
      ctx.fillStyle = hair;
      const jawY = Math.round(headTop + 9 * u);
      ctx.fillRect(Math.round(cx - 4 * u), jawY, u, 2 * u);
      ctx.fillRect(Math.round(cx + 3 * u), jawY, u, 2 * u);
      ctx.fillRect(Math.round(cx - 3 * u), jawY + 2 * u, 6 * u, 1);
    }

    // glasses
    if (look.accessory === 'glasses') {
      ctx.strokeStyle = 'rgba(42,30,20,0.9)';
      ctx.lineWidth = 1;
      ctx.strokeRect(leftEye - 2, eyeY - 2, 4 * u, 3 * u);
      ctx.strokeRect(rightEye - 1, eyeY - 2, 4 * u, 3 * u);
      ctx.fillStyle = 'rgba(42,30,20,0.9)';
      ctx.fillRect(leftEye + 2 * u, eyeY - 1, u, 1);
      ctx.fillRect(rightEye - 2, eyeY - 1, u, 1);
    }

    // earrings
    if (look.accessory === 'earrings') {
      ctx.fillStyle = '#e2bf6d';
      ctx.fillRect(headX - 1, Math.round(headTop + 8 * u), 1, 2);
      ctx.fillRect(headX + headW * u, Math.round(headTop + 8 * u), 1, 2);
    }

    // top light rim
    ctx.fillStyle = 'rgba(255,226,170,0.13)';
    ctx.fillRect(Math.round(cx - shoulderW * u / 2) + 2, Math.round(bodyTop), Math.round(shoulderW * u * 0.55), 1);
  }

  drawHair(ctx, look, cx, headTop, headW, u, hair, hairDark, outline) {
    const style = look.hairStyle;
    const left = Math.round(cx - headW * u / 2);
    const top = Math.round(headTop);
    const w = headW * u;
    ctx.fillStyle = outline;
    ctx.fillRect(left - 1, top - 2 * u, w + 2, 2 * u);
    ctx.fillStyle = hair;

    if (style === 'bald') {
      ctx.fillStyle = outline;
      ctx.fillRect(left, top, u, 2 * u);
      ctx.fillRect(left + w - u, top, u, 2 * u);
      ctx.fillStyle = hair;
      ctx.fillRect(left, top + 1 * u, u, 3 * u);
      ctx.fillRect(left + w - u, top + 1 * u, u, 3 * u);
      ctx.fillStyle = shade(hair, -16);
      ctx.fillRect(left + u, top, w - 2 * u, 1);
      return;
    }

    if (style === 'cap') {
      ctx.fillStyle = look.outfitDark;
      ctx.fillRect(left - 1, top - 3 * u, w + 2, 4 * u);
      ctx.fillStyle = shade(look.outfitDark, 20);
      ctx.fillRect(left, top - 2.5 * u, w, 2 * u);
      ctx.fillStyle = '#1a120d';
      ctx.fillRect(left - u, top + 1 * u, w + 2 * u, u);
      return;
    }

    if (style === 'beanie') {
      ctx.fillStyle = look.accent;
      ctx.fillRect(left - 1, top - 3.5 * u, w + 2, 5 * u);
      ctx.fillStyle = shade(look.accent, -36);
      ctx.fillRect(left - 1, top + 1 * u, w + 2, 1.5 * u);
      ctx.fillStyle = shade(look.accent, 18);
      ctx.fillRect(left, top - 3 * u, w, u);
      return;
    }

    if (style === 'buzz') {
      ctx.fillRect(left, top - u, w, 2 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(left, top + 1.5 * u, u, 3 * u);
      ctx.fillRect(left + w - u, top + 1.5 * u, u, 3 * u);
      ctx.fillRect(left + 2 * u, top, w - 4 * u, u);
      return;
    }

    // common hair cap
    ctx.fillRect(left, top - 2 * u, w, 3 * u);
    ctx.fillStyle = hairDark;
    ctx.fillRect(left, top + u, w, u);
    ctx.fillStyle = hair;

    if (style === 'short' || style === 'sidepart') {
      ctx.fillRect(left - u, top + 2 * u, u, 2.5 * u);
      ctx.fillRect(left + w, top + 2 * u, u, 2.5 * u);
      if (style === 'sidepart') {
        ctx.fillStyle = hairDark;
        ctx.fillRect(left + w * 0.56, top - 2 * u, w * 0.4, u * 1.5);
        ctx.fillStyle = hair;
        ctx.fillRect(left + 2 * u, top + u, w * 0.45, u);
      } else {
        ctx.fillRect(left + 2 * u, top + u, w - 4 * u, u);
      }
    } else if (style === 'messy') {
      for (let i = 0; i < 5; i++) {
        const bx = left + i * 2 * u - u;
        const bh = (i % 2 === 0 ? 2 : 1.2) * u;
        ctx.fillRect(bx, top - 2 * u - bh, 1.5 * u, bh + u);
      }
      ctx.fillRect(left - u, top + 2 * u, u, 3 * u);
      ctx.fillRect(left + w, top + 2 * u, u, 3 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(left + u, top + u, w * 0.35, u);
    } else if (style === 'bun') {
      ctx.fillRect(left - u, top + 2 * u, u, 2 * u);
      ctx.fillRect(left + w, top + 2 * u, u, 2 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(Math.round(cx + 2 * u), top - 4 * u, 4 * u, 3 * u);
      ctx.fillStyle = hair;
      ctx.fillRect(Math.round(cx + 2.5 * u), top - 3.5 * u, 3 * u, 2 * u);
    } else if (style === 'updo') {
      ctx.fillRect(left - u, top + 2 * u, u, 2 * u);
      ctx.fillRect(left + w, top + 2 * u, u, 2 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(Math.round(cx - 3 * u), top - 5 * u, 6 * u, 3.5 * u);
      ctx.fillStyle = hair;
      ctx.fillRect(Math.round(cx - 2.5 * u), top - 4.5 * u, 5 * u, 2.5 * u);
      ctx.fillStyle = look.accent;
      ctx.fillRect(Math.round(cx + u), top - 4 * u, u, u);
    } else if (style === 'curly') {
      for (let i = 0; i < 6; i++) {
        const bx = left + i * 1.7 * u;
        ctx.fillRect(bx, top - 2 * u - (i % 2) * u, 2 * u, 2 * u);
      }
      ctx.fillRect(left - u, top + 2 * u, u, 3.5 * u);
      ctx.fillRect(left + w, top + 2 * u, u, 3.5 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(left + u, top + u, u, 2 * u);
    } else if (style === 'long') {
      ctx.fillRect(left - u, top + 2 * u, 1.5 * u, 8 * u);
      ctx.fillRect(left + w - 0.5 * u, top + 2 * u, 1.5 * u, 8 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(left - u, top + 5 * u, 1.5 * u, 5 * u);
      ctx.fillRect(left + w - 0.5 * u, top + 5 * u, 1.5 * u, 5 * u);
    } else if (style === 'ponytail') {
      ctx.fillRect(left - u, top + 2 * u, u, 2.5 * u);
      ctx.fillRect(left + w, top + 2 * u, u, 2.5 * u);
      ctx.fillStyle = hairDark;
      ctx.fillRect(left + w + u, top + 4 * u, 2 * u, 6 * u);
      ctx.fillStyle = hair;
      ctx.fillRect(left + w + u, top + 4 * u, u, 6 * u);
    }
  }

  drawDust(ctx, t) {
    for (const d of this.dust) {
      const x = (d.x + t * d.drift + Math.sin(t * 0.4 + d.y) * 6) % 300 + 70;
      const y = 60 + ((d.y + t * d.speed) % 160);
      ctx.fillStyle = `rgba(255,230,175,${d.alpha})`;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }

  drawBench(ctx, t, name) {
    // desk top
    const top = ctx.createLinearGradient(0, 250, 0, 284);
    top.addColorStop(0, '#70482a');
    top.addColorStop(0.5, '#5c3a22');
    top.addColorStop(1, '#432818');
    ctx.fillStyle = top;
    ctx.fillRect(0, 250, W, 34);
    ctx.fillStyle = '#8d6038';
    ctx.fillRect(0, 250, W, 3);
    ctx.fillStyle = '#a87a47';
    ctx.fillRect(0, 250, W, 1);
    // surface grain
    for (let i = 0; i < 14; i++) {
      const y = 256 + i * 2;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(28,16,9,0.22)' : 'rgba(150,100,60,0.10)';
      ctx.fillRect((i * 91) % W, y, 40 + ((i * 37) % 80), 1);
    }
    // front lip
    ctx.fillStyle = '#2a170e';
    ctx.fillRect(0, 284, W, 6);
    ctx.fillStyle = '#5d3b23';
    ctx.fillRect(0, 284, W, 2);

    // bench face
    const face = ctx.createLinearGradient(0, 290, 0, 360);
    face.addColorStop(0, '#3d2516');
    face.addColorStop(1, '#2a180f');
    ctx.fillStyle = face;
    ctx.fillRect(0, 290, W, 70);

    // recessed panels
    const panels = [[28, 196], [234, 172], [432, 178]];
    for (const [x, w] of panels) {
      ctx.fillStyle = '#2b190f';
      ctx.fillRect(x, 300, w, 46);
      ctx.fillStyle = '#4c2f1d';
      ctx.fillRect(x, 300, w, 2);
      ctx.fillRect(x, 300, 2, 46);
      ctx.fillStyle = '#1e110a';
      ctx.fillRect(x + 2, 344, w - 2, 2);
      ctx.fillStyle = '#62402a';
      ctx.fillRect(x + 10, 306, w - 20, 1);
      ctx.fillStyle = '#a9874d';
      ctx.fillRect(x + 3, 303, 2, 2);
      ctx.fillRect(x + w - 5, 303, 2, 2);
    }

    // centre nameplate
    ctx.fillStyle = '#1a0f09';
    ctx.fillRect(263, 296, 114, 34);
    const brass = ctx.createLinearGradient(0, 298, 0, 328);
    brass.addColorStop(0, '#e0c079');
    brass.addColorStop(0.45, '#b48f4e');
    brass.addColorStop(1, '#8b6b36');
    ctx.fillStyle = brass;
    ctx.fillRect(265, 298, 110, 30);
    ctx.fillStyle = '#f1dda0';
    ctx.fillRect(265, 298, 110, 1);
    ctx.fillStyle = '#6c5128';
    ctx.fillRect(267, 325, 106, 1);
    ctx.fillStyle = '#2b1c0d';
    this.text(ctx, 'SAYIN', 320, 305, 4.5, '#2b1c0d', 'Press Start 2P, monospace', 'center');
    this.text(ctx, 'HÂKİM', 320, 318, 9, '#241708', 'Press Start 2P, monospace', 'center');
    ctx.fillStyle = '#6c5128';
    ctx.fillRect(279, 312, 82, 1);

    // law books (left)
    const books = [
      { x: 22, w: 92, y: 266, c: '#5c2a26', c2: '#7b3a34' },
      { x: 28, w: 80, y: 259, c: '#2f473a', c2: '#415f4d' },
      { x: 34, w: 68, y: 252, c: '#3c3a5e', c2: '#54527d' },
    ];
    for (const b of books) {
      ctx.fillStyle = '#170e09';
      ctx.fillRect(b.x - 2, b.y, b.w + 4, 9);
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x, b.y + 1, b.w, 7);
      ctx.fillStyle = b.c2;
      ctx.fillRect(b.x, b.y + 1, b.w, 1);
      ctx.fillStyle = '#c8a45c';
      ctx.fillRect(b.x + 5, b.y + 4, b.w - 10, 1);
      ctx.fillRect(b.x + 3, b.y + 2, 1, 5);
    }
    // papers
    ctx.fillStyle = '#d8cbb0';
    ctx.fillRect(150, 261, 58, 4);
    ctx.fillStyle = '#ece0c5';
    ctx.fillRect(154, 257, 54, 4);
    ctx.fillStyle = '#9a8b6d';
    for (let i = 0; i < 3; i++) ctx.fillRect(158, 258.5 + i, 34, 0.5);

    // gavel
    this.drawGavel(ctx, t);
  }

  drawGavel(ctx, t) {
    let angle = -0.14;
    if (this.gavelAnim) {
      const p = clamp((this.time - this.gavelAnim.start) / this.gavelAnim.duration, 0, 1);
      if (p < 0.1) angle = -0.14 - easeOut(p / 0.1) * 0.65;
      else if (p < 0.27) {
        const q = (p - 0.1) / 0.17;
        angle = -0.79 + easeIn(q) * 0.83;
      } else if (p < 0.36) angle = 0.04 - Math.sin(((p - 0.27) / 0.09) * Math.PI) * 0.14;
      else angle = -0.1 + Math.sin((p - 0.36) * 9) * 0.02;
    }
    const pivotX = 595;
    const pivotY = 268;
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle);

    // handle
    ctx.fillStyle = '#3c2416';
    ctx.fillRect(-74, 2, 62, 8);
    ctx.fillStyle = '#6b4327';
    ctx.fillRect(-74, 2, 62, 5);
    ctx.fillStyle = '#91613a';
    ctx.fillRect(-74, 2, 62, 1);
    ctx.fillStyle = '#2a180e';
    ctx.fillRect(-18, 1, 8, 10);
    ctx.fillStyle = '#c9a45c';
    ctx.fillRect(-17, 2, 2, 8);

    // head
    ctx.fillStyle = '#24140c';
    ctx.fillRect(-98, -10, 32, 30);
    ctx.fillStyle = '#72482a';
    ctx.fillRect(-95, -8, 26, 26);
    ctx.fillStyle = '#8d5d35';
    ctx.fillRect(-95, -8, 26, 5);
    ctx.fillStyle = '#5a361f';
    ctx.fillRect(-95, 14, 26, 4);
    ctx.fillStyle = '#c9a45c';
    ctx.fillRect(-95, -8, 26, 2);
    ctx.fillRect(-95, 15, 26, 2);
    ctx.fillStyle = '#e2c47a';
    ctx.fillRect(-93, -6, 20, 1);

    // sound block
    ctx.restore();
    ctx.fillStyle = '#24140c';
    ctx.fillRect(500, 274, 48, 8);
    ctx.fillStyle = '#6b4327';
    ctx.fillRect(502, 274, 44, 5);
    ctx.fillStyle = '#8d5d35';
    ctx.fillRect(502, 274, 44, 1);
  }

  drawSlamBurst(ctx) {
    if (this.flash <= 0) return;
    const headX = 516;
    const headY = 272;
    ctx.save();
    ctx.globalAlpha = this.flash;
    ctx.strokeStyle = 'rgba(255,231,170,0.8)';
    ctx.lineWidth = 2;
    const r = 8 + (1 - this.flash) * 26;
    ctx.beginPath();
    ctx.arc(headX, headY, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  text(ctx, str, x, y, size, color, font, align = 'left') {
    ctx.save();
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(str, x, y);
    ctx.restore();
  }
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255})`;
}

/* A small bust portrait for the docket, using the same person renderer. */
export function drawPortrait(canvas, look) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;

  const bg = ctx.createRadialGradient(w / 2, h * 0.42, 4, w / 2, h * 0.42, w * 0.62);
  bg.addColorStop(0, '#5b3c26');
  bg.addColorStop(1, '#1b110c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // pixel vignette lines
  ctx.fillStyle = 'rgba(255,220,160,0.05)';
  for (let i = 0; i < 4; i++) ctx.fillRect(0, i * 2, w, 1);

  const scene = Object.create(CourtroomScene.prototype);
  scene.drawPerson(ctx, look, w / 2, 1, 3.6, 'worried', false);

  const vg = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(8,5,3,0.5)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}

const canvas = document.getElementById('scene') as HTMLCanvasElement | null;
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  const sceneCanvas = canvas;
  const sceneCtx = ctx;
  const titleBlock = document.getElementById('titleBlock');
  const freqTelemetry = document.getElementById('freqTelemetry');
  const layerTelemetry = document.getElementById('layerTelemetry');
  const stateReadout = document.getElementById('stateReadout');
  const defaultFreqText = freqTelemetry?.dataset.defaultText ?? '';

  let w = 0;
  let h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = sceneCanvas.getBoundingClientRect();
    w = rect.width || window.innerWidth;
    h = rect.height || window.innerHeight;
    sceneCanvas.width = w * dpr;
    sceneCanvas.height = h * dpr;
    sceneCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Web Audio bass string synthesis
  let audioCtx: AudioContext | null = null;
  let masterBus: DynamicsCompressorNode | null = null;

  function ensureAudioContext(): AudioContext | null {
    try {
      if (!audioCtx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        audioCtx = new AudioCtx();

        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
        compressor.knee.setValueAtTime(12, audioCtx.currentTime);
        compressor.ratio.setValueAtTime(4, audioCtx.currentTime);
        compressor.attack.setValueAtTime(0.005, audioCtx.currentTime);
        compressor.release.setValueAtTime(0.18, audioCtx.currentTime);
        compressor.connect(audioCtx.destination);
        masterBus = compressor;
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    } catch {
      return null;
    }
  }

  function playSubtleBassTone(freq: number, velocity = 0.75) {
    const ctxAudio = ensureAudioContext();
    if (!ctxAudio || !masterBus) return;

    const vel = Math.max(0.35, Math.min(1.0, velocity));
    const bus = masterBus;

    const triggerVoice = () => {
      const now = ctxAudio.currentTime;
      const duration = 2.4;

      const filter = ctxAudio.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(2.4, now);
      const attackCutoff = Math.min(2800, Math.max(freq * 10, 620)) * (0.65 + 0.35 * vel);
      filter.frequency.setValueAtTime(attackCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 3.2, now + 0.28);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

      const voiceGain = ctxAudio.createGain();
      const peakGain = 0.28 * vel;
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.linearRampToValueAtTime(peakGain, now + 0.01);
      voiceGain.gain.exponentialRampToValueAtTime(peakGain * 0.42, now + 0.22);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      filter.connect(voiceGain);
      voiceGain.connect(bus);

      const voices: Array<{
        type: OscillatorType;
        startFreq: number;
        endFreq?: number;
        detune?: number;
        gain: number;
      }> = [
        { type: 'triangle', startFreq: freq * 1.008, endFreq: freq, gain: 0.55 },
        { type: 'sawtooth', startFreq: freq, detune: 3.5, gain: 0.32 },
        { type: 'triangle', startFreq: freq * 2, gain: 0.22 },
      ];

      voices.forEach((v) => {
        const osc = ctxAudio.createOscillator();
        osc.type = v.type;
        osc.frequency.setValueAtTime(v.startFreq, now);
        if (v.endFreq) osc.frequency.exponentialRampToValueAtTime(v.endFreq, now + 0.045);
        if (v.detune) osc.detune.setValueAtTime(v.detune, now);

        const gainNode = ctxAudio.createGain();
        gainNode.gain.setValueAtTime(v.gain, now);

        osc.connect(gainNode);
        gainNode.connect(filter);
        osc.start(now);
        osc.stop(now + duration + 0.05);
      });
    };

    if (ctxAudio.state === 'running') {
      triggerVoice();
    } else {
      ctxAudio.resume().then(triggerVoice).catch(() => {});
    }
  }

  ['pointerdown', 'touchstart', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, () => ensureAudioContext(), { passive: true });
  });

  interface BassString {
    hz: number;
    label: string;
    yFrac: number;
    gauge: number;
    amp: number;
    vel: number;
    phase: number;
  }

  const strings: BassString[] = [
    { hz: 98.0, label: '98.00 Hz [G2]', yFrac: 0.24, gauge: 1.0, amp: 0, vel: 0, phase: 0 },
    { hz: 73.42, label: '73.42 Hz [D2]', yFrac: 0.36, gauge: 1.35, amp: 0, vel: 0, phase: 1.2 },
    { hz: 55.0, label: '55.00 Hz [A1]', yFrac: 0.48, gauge: 1.75, amp: 0, vel: 0, phase: 2.4 },
    { hz: 41.2, label: '41.20 Hz [E1]', yFrac: 0.6, gauge: 2.25, amp: 0, vel: 0, phase: 3.6 },
  ];

  interface WaveLine {
    progress: number;
    c1: number;
    c2: number;
    c3: number;
    w1: number;
    w2: number;
    w3: number;
    a1: number;
    a2: number;
    a3: number;
    f1: number;
    f2: number;
    ph: number;
    boost: number;
    isHighlight: boolean;
  }

  const NUM_LINES = 58;
  const lines: WaveLine[] = [];

  function createLineProps(progress: number, index: number): WaveLine {
    return {
      progress,
      c1: -0.18 + (Math.random() - 0.5) * 0.24,
      c2: 0.16 + (Math.random() - 0.5) * 0.24,
      c3: (Math.random() - 0.5) * 0.22,
      w1: 0.05 + Math.random() * 0.065,
      w2: 0.045 + Math.random() * 0.06,
      w3: 0.04 + Math.random() * 0.055,
      a1: 0.25 + Math.random() * 0.65,
      a2: 0.25 + Math.random() * 0.65,
      a3: 0.2 + Math.random() * 0.55,
      f1: 14 + Math.random() * 14,
      f2: 24 + Math.random() * 18,
      ph: Math.random() * Math.PI * 2,
      boost: 0,
      isHighlight: index % 19 === 0,
    };
  }

  for (let i = 0; i < NUM_LINES; i++) {
    lines.push(createLineProps(i / NUM_LINES, i));
  }

  let spawnCounter = NUM_LINES;
  let prevY: number | null = null;
  let pointerX = w * 0.5;
  let pointerY = h * 0.35;
  let resonanceEnergy = 0;
  let freqTimer: ReturnType<typeof setTimeout> | undefined;

  function getOriginAndTopY() {
    const canvasRect = sceneCanvas.getBoundingClientRect();
    const rect = titleBlock?.getBoundingClientRect();
    const relTop = rect ? rect.top - canvasRect.top : h * 0.68;
    return {
      originY: Math.max(h * 0.52, relTop - 22),
      topLimitY: h * 0.05,
    };
  }

  setTimeout(() => {
    strings[2].amp = 16;
    resonanceEnergy = 0.65;
  }, 800);

  function pluckString(s: BassString, direction: number, speed = 20) {
    const bounds = getOriginAndTopY();
    const spanH = Math.max(100, bounds.originY - bounds.topLimitY);
    const sy = s.yFrac * h;
    const clampedSpeed = Math.min(Math.max(speed, 10), 38);

    s.amp = (direction >= 0 ? 1 : -1) * Math.max(14, clampedSpeed * 1.25);
    resonanceEnergy = Math.min(1.6, resonanceEnergy + 0.55);

    const targetProg = Math.max(0, Math.min(1, (bounds.originY - sy) / spanH));
    for (const line of lines) {
      const dist = Math.abs(line.progress - targetProg);
      if (dist < 0.18) {
        line.boost = Math.min(1.6, line.boost + (1 - dist / 0.18) * 0.85);
      }
    }

    const normVel = Math.min(1.0, 0.45 + (clampedSpeed / 38) * 0.55);
    playSubtleBassTone(s.hz, normVel);

    if (freqTelemetry) {
      freqTelemetry.textContent = `RESONANCE // ${s.label}`;
      freqTelemetry.classList.add('active');
      clearTimeout(freqTimer);
      freqTimer = setTimeout(() => {
        freqTelemetry.classList.remove('active');
        freqTelemetry.textContent = defaultFreqText;
      }, 1600);
    }
  }

  sceneCanvas.addEventListener(
    'pointerdown',
    (e) => {
      const rect = sceneCanvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      prevY = pointerY;

      let closest: BassString | null = null;
      let minDist = Infinity;
      for (const s of strings) {
        const d = Math.abs(pointerY - s.yFrac * h);
        if (d < minDist) {
          minDist = d;
          closest = s;
        }
      }

      if (closest && minDist < h * 0.14) {
        pluckString(closest, pointerY >= closest.yFrac * h ? 1 : -1, 24);
      }
    },
    { passive: true },
  );

  window.addEventListener(
    'pointermove',
    (e) => {
      const rect = sceneCanvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      if (pointerY < 0 || pointerY > h) {
        prevY = null;
        return;
      }

      if (prevY !== null) {
        for (const s of strings) {
          const sy = s.yFrac * h;
          if ((prevY < sy && pointerY >= sy) || (prevY > sy && pointerY <= sy)) {
            pluckString(s, pointerY > prevY ? 1 : -1, Math.min(Math.abs(pointerY - prevY), 38));
          }
        }
      }
      prevY = pointerY;

      if (layerTelemetry) {
        const zVal = (Math.max(0, Math.min(1, 1 - pointerY / h)) * 48.0).toFixed(2);
        layerTelemetry.textContent = `Z: ${zVal}mm // 215°C`;
      }
    },
    { passive: true },
  );

  let t = 0;

  function tracePoints(points: Array<{ x: number; y: number }>) {
    sceneCtx.beginPath();
    sceneCtx.moveTo(points[0].x, points[0].y);
    for (let j = 1; j < points.length; j++) {
      sceneCtx.lineTo(points[j].x, points[j].y);
    }
  }

  function traceStringWave(s: BassString, sy: number) {
    const segments = 72;
    sceneCtx.beginPath();
    sceneCtx.moveTo(0, sy);
    for (let i = 1; i <= segments; i++) {
      const u = i / segments;
      const env = Math.sin(u * Math.PI);
      const overtone = Math.sin(u * Math.PI * 3 + s.phase) * 0.16;
      sceneCtx.lineTo(u * w, sy + (env + overtone * env) * s.amp);
    }
  }

  function drawBottomEmergingWaves() {
    const { originY, topLimitY } = getOriginAndTopY();
    const totalSpanY = Math.max(120, originY - topLimitY);
    const maxPeakHeight = Math.min(h * 0.115, 96);

    resonanceEnergy *= 0.965;

    for (let i = 0; i < NUM_LINES; i++) {
      lines[i].progress += 0.00085;
      lines[i].boost *= 0.96;
      if (lines[i].progress >= 1.0) {
        spawnCounter++;
        lines[i] = createLineProps(lines[i].progress - 1.0, spawnCounter);
      }
    }

    const sorted = [...lines].sort((a, b) => b.progress - a.progress);
    const numSamples = 110;
    const relCursorX = (pointerX / w) * 2 - 1;

    for (const row of sorted) {
      const p = row.progress;
      const baseY = originY - Math.pow(p, 0.94) * totalSpanY;
      const spanWidth = Math.min(w * 0.88, 860) * (1.0 - 0.28 * p);
      const startX = (w - spanWidth) * 0.5;
      const rowEnv = Math.min(1, p * 6.5) * Math.pow(Math.max(0, 1 - p), 1.35);

      const points: Array<{ x: number; y: number }> = [];

      for (let j = 0; j <= numSamples; j++) {
        const uNorm = j / numSamples;
        const u = uNorm * 2 - 1;
        const edgeFeather = Math.pow(Math.max(0, 1 - u * u), 1.8);
        const centerEnvelope = Math.exp(-Math.pow(u / 0.46, 4));
        const g1 = row.a1 * Math.exp(-Math.pow((u - row.c1) / row.w1, 2));
        const g2 = row.a2 * Math.exp(-Math.pow((u - row.c2) / row.w2, 2));
        const g3 = row.a3 * Math.exp(-Math.pow((u - row.c3) / row.w3, 2));

        const phase = t * 0.024 + row.ph;
        const jagged =
          0.54 + 0.28 * Math.sin(u * row.f1 + phase) + 0.2 * Math.cos(u * row.f2 - phase * 1.25);
        const cursorWave = Math.exp(-Math.pow(Math.abs(u - relCursorX) / 0.22, 2)) * 0.18;
        const boostSignal =
          (row.boost * 0.5 + resonanceEnergy * 0.35) * (0.65 + 0.35 * Math.sin(u * 16 - t * 0.15));

        const ridgeHeight =
          (g1 + g2 + g3 + cursorWave + boostSignal) *
          jagged *
          centerEnvelope *
          maxPeakHeight *
          rowEnv *
          edgeFeather;

        points.push({ x: startX + uNorm * spanWidth, y: baseY - ridgeHeight });
      }

      const curtainBottomY = Math.min(originY, baseY + 12);
      tracePoints(points);
      sceneCtx.lineTo(points[points.length - 1].x, curtainBottomY);
      sceneCtx.lineTo(points[0].x, curtainBottomY);
      sceneCtx.closePath();
      sceneCtx.fillStyle = `rgba(4, 4, 6, ${0.92 * rowEnv})`;
      sceneCtx.fill();

      const grad = sceneCtx.createLinearGradient(startX, baseY, startX + spanWidth, baseY);
      const alpha = Math.min(0.88, (0.16 + 0.54 * rowEnv + row.boost * 0.28) * rowEnv);

      if (row.isHighlight) {
        grad.addColorStop(0.0, 'rgba(223, 155, 82, 0)');
        grad.addColorStop(0.18, `rgba(223, 155, 82, ${alpha * 0.45})`);
        grad.addColorStop(0.5, `rgba(223, 155, 82, ${Math.min(0.92, alpha * 1.35)})`);
        grad.addColorStop(0.82, `rgba(223, 155, 82, ${alpha * 0.45})`);
        grad.addColorStop(1.0, 'rgba(223, 155, 82, 0)');
        sceneCtx.lineWidth = 1.25;
      } else {
        const warm = Math.min(1, row.boost * 0.65);
        const rgb = `${Math.round(205 + warm * 35)}, ${Math.round(220 - warm * 35)}, ${Math.round(226 - warm * 95)}`;
        grad.addColorStop(0.0, `rgba(${rgb}, 0)`);
        grad.addColorStop(0.16, `rgba(${rgb}, ${alpha * 0.35})`);
        grad.addColorStop(0.5, `rgba(${rgb}, ${alpha})`);
        grad.addColorStop(0.84, `rgba(${rgb}, ${alpha * 0.35})`);
        grad.addColorStop(1.0, `rgba(${rgb}, 0)`);
        sceneCtx.lineWidth = 0.9 + warm * 0.35;
      }

      tracePoints(points);
      sceneCtx.strokeStyle = grad;
      sceneCtx.stroke();
    }
  }

  function drawForegroundStrings() {
    for (const s of strings) {
      const sy = s.yFrac * h;
      s.vel = (s.vel - 0.22 * s.amp) * 0.92;
      s.amp += s.vel;
      s.phase += 0.38;

      const energy = Math.min(Math.abs(s.amp) / 20, 1);

      traceStringWave(s, sy);
      sceneCtx.strokeStyle = 'rgba(4, 4, 6, 0.78)';
      sceneCtx.lineWidth = s.gauge + 4;
      sceneCtx.stroke();

      traceStringWave(s, sy);
      if (energy > 0.02) {
        sceneCtx.shadowColor = 'rgba(223, 155, 82, 0.9)';
        sceneCtx.shadowBlur = 18 * energy + 4;
        sceneCtx.strokeStyle = `rgba(235, 175, 105, ${0.55 + energy * 0.45})`;
      } else {
        sceneCtx.shadowColor = 'rgba(240, 237, 230, 0.25)';
        sceneCtx.shadowBlur = 4;
        sceneCtx.strokeStyle = 'rgba(240, 237, 230, 0.36)';
      }

      sceneCtx.lineWidth = s.gauge;
      sceneCtx.stroke();
      sceneCtx.shadowBlur = 0;
    }
  }

  const states = ['<state:materializing />', '<layer:slicing />', '<signal:resonant />'];

  function tick() {
    t += 1;
    sceneCtx.clearRect(0, 0, w, h);

    drawBottomEmergingWaves();
    drawForegroundStrings();

    if (t % 240 === 0 && stateReadout) {
      stateReadout.textContent = states[Math.floor(t / 240) % states.length];
    }

    requestAnimationFrame(tick);
  }

  tick();
}

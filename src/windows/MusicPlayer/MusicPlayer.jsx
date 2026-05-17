import { useEffect, useRef, useState } from 'react';
import './MusicPlayer.css';

const TRACKS = [
  { title: 'lofi_beats_to_debug_to.mp3', artist: 'Aditya', duration: 184 },
  { title: 'kernel_panic_blues.flac', artist: 'CPU & The Cycles', duration: 212 },
  { title: 'lane_segmentation_anthem.ogg', artist: 'Wisconsin Autonomous', duration: 167 },
  { title: 'four_point_oh.wav', artist: 'GPA Records', duration: 248 },
  { title: 'koopman_dream.mp3', artist: 'Latent Space', duration: 196 },
  { title: 'on_device_inference.mp3', artist: 'NPU Sessions', duration: 273 },
];

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [vol, setVol] = useState(0.6);
  const [bars, setBars] = useState(() => Array(14).fill(0));
  const timerRef = useRef(null);

  const track = TRACKS[idx];

  useEffect(() => {
    if (!playing) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= track.duration) {
          setIdx((i) => (i + 1) % TRACKS.length);
          return 0;
        }
        return p + 1;
      });
      setBars(() => Array.from({ length: 14 }, () => Math.random() * vol));
    }, 200);
    return () => clearInterval(timerRef.current);
  }, [playing, track.duration, vol]);

  useEffect(() => {
    setPos(0);
  }, [idx]);

  const toggle = () => setPlaying((p) => !p);
  const stop = () => {
    setPlaying(false);
    setPos(0);
    setBars(Array(14).fill(0));
  };
  const next = () => setIdx((i) => (i + 1) % TRACKS.length);
  const prev = () => setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setPos(Math.floor(track.duration * Math.max(0, Math.min(1, ratio))));
  };

  return (
    <div className="amp-window">
      <div className="amp-title">AdityaAMP v1.337 (mock playback)</div>

      <div className="amp-lcd">
        <div className="amp-marquee">
          <span>{idx + 1}. {track.title} — {track.artist}</span>
        </div>
        <div className="amp-time">{fmt(pos)} / {fmt(track.duration)}</div>
      </div>

      <div className="amp-vis">
        {bars.map((h, i) => (
          <div key={i} className="amp-bar" style={{ height: `${Math.max(2, h * 36)}px` }} />
        ))}
      </div>

      <div className="amp-seek win95-inset-thin" onClick={seek}>
        <div
          className="amp-seek-fill"
          style={{ width: `${(pos / track.duration) * 100}%` }}
        />
      </div>

      <div className="amp-controls">
        <button className="win95-button" onClick={prev}>⏮</button>
        <button className="win95-button" onClick={toggle}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="win95-button" onClick={stop}>⏹</button>
        <button className="win95-button" onClick={next}>⏭</button>
        <label className="amp-volume">
          Vol
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={vol}
            onChange={(e) => setVol(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <ul className="amp-playlist win95-inset win95-scrollbar">
        {TRACKS.map((t, i) => (
          <li
            key={t.title}
            className={`amp-track ${i === idx ? 'active' : ''}`}
            onClick={() => setIdx(i)}
            onDoubleClick={() => {
              setIdx(i);
              setPlaying(true);
            }}
          >
            <span className="amp-track-num">{(i + 1).toString().padStart(2, '0')}</span>
            <span className="amp-track-title">{t.title}</span>
            <span className="amp-track-dur">{fmt(t.duration)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

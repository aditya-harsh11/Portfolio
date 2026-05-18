import { useEffect, useRef, useState } from 'react';
import './MusicPlayer.css';

const TRACKS = [
  { title: 'late_night_side_project.mp3', artist: 'Aditya', duration: 184 },
  { title: 'running_on_coffee.wav', artist: 'Campus WiFi', duration: 212 },
  { title: '2am_debug_session.flac', artist: 'The Stack Traces', duration: 167 },
  { title: 'probably_needs_refactoring.mp3', artist: 'Technical Debt', duration: 248 },
  { title: 'final_final_v2_REAL.mp3', artist: 'Last Minute Fixes', duration: 196 },
  { title: 'forgot_to_commit_changes.ogg', artist: 'Git Panic', duration: 273 },
  { title: 'works_on_my_machine.mp3', artist: 'Local Environment', duration: 201 },
  { title: 'one_more_small_fix.flac', artist: 'Scope Creep', duration: 178 },
  { title: 'meeting_that_could_have_been_an_email.mp3', artist: 'Corporate Core', duration: 259 },
  { title: 'compile_and_pray.wav', artist: 'The Build System', duration: 214 },
  { title: 'ship_it_anyway.mp3', artist: 'Continuous Deployment', duration: 192 },
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
      <div className="amp-title">AdityaAMP v1.345</div>

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

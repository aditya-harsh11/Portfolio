class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.4;
    this.down = null;
    this.up = null;
    if (typeof Audio !== 'undefined') {
      try {
        this.down = new Audio('/audio/click_down.mp3');
        this.up = new Audio('/audio/click_up.mp3');
        this.down.volume = this.volume;
        this.up.volume = this.volume;
        this.down.preload = 'auto';
        this.up.preload = 'auto';
      } catch {
        /* ignore */
      }
    }
  }

  setEnabled(v) {
    this.enabled = v;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.down) this.down.volume = this.volume;
    if (this.up) this.up.volume = this.volume;
  }

  play(audio) {
    if (!this.enabled || !audio) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      /* ignore */
    }
  }

  playDown() {
    this.play(this.down);
  }
  playUp() {
    this.play(this.up);
  }
}

export const soundManager = new SoundManager();

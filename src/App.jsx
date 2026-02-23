import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Star, Lock, X } from "lucide-react";

// ─── Google Font injector ───────────────────────────────────────────────────
const injectFont = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap";
  document.head.appendChild(link);
};

// ─── Confetti ────────────────────────────────────────────────────────────────
const launchConfetti = async () => {
  if (!window._confettiLoaded) {
    await new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
      s.onload = resolve;
      document.head.appendChild(s);
    });
    window._confettiLoaded = true;
  }
  const fire = (angle, origin) =>
    window.confetti({
      particleCount: 80, spread: 70, angle, origin,
      colors: ["#f9a8d4", "#f472b6", "#fde68a", "#fbbf24", "#e879f9", "#ffffff"],
      gravity: 0.8, scalar: 1.1,
    });
  const run = () => { fire(60, { x: 0, y: 0.65 }); fire(120, { x: 1, y: 0.65 }); };
  run();
  const id = setInterval(run, 600);
  setTimeout(() => clearInterval(id), 4000);
};

// ─── Floating particles ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  type: i % 3 === 0 ? "heart" : i % 3 === 1 ? "sparkle" : "star",
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 12 + Math.random() * 10,
  size: 10 + Math.random() * 14,
  opacity: 0.25 + Math.random() * 0.4,
}));

// ─── Typewriter ──────────────────────────────────────────────────────────────
const useTypewriter = (text, speed = 60, start = true) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    let i = 0; setDisplayed(""); setDone(false);
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { displayed, done };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PASSWORD GATE
// ═══════════════════════════════════════════════════════════════════════════════
function PasswordGate({ onUnlock, onStartMusic }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (value === "2210") {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 600);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Bất kỳ tương tác nào với trang → thử phát nhạc (vượt autoplay policy)
  const handleInteract = () => onStartMusic();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      onClick={handleInteract}
      style={{
        minHeight: "100dvh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 28, padding: "24px 16px", textAlign: "center",
      }}
    >
      {/* Lock icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #f9a8d4, #c084fc)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(240,100,180,0.4)",
        }}
      >
        <Lock size={30} color="white" />
      </motion.div>

      <div>
        <h2
          className="handwriting"
          style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", color: "#c084fc", marginBottom: 8 }}
        >
          Bí mật chỉ dành cho cậu thôi 🔒
        </h2>
        <p style={{ fontSize: "clamp(0.85rem,2.5vw,1rem)", color: "#a78bfa", fontStyle: "italic", letterSpacing: "0.04em" }}>
          Hint: <span style={{ color: "#f472b6" }}>ngày sinh của mày đó</span> 🌙
        </p>
      </div>

      {/* Input */}
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "min(320px, 90vw)" }}
      >
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onFocus={handleInteract}
          placeholder="Nhập mật khẩu..."
          autoFocus
          style={{
            width: "100%", padding: "14px 20px", borderRadius: 999,
            border: error ? "2px solid #f87171" : "1.5px solid rgba(200,150,230,0.5)",
            background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)",
            fontSize: "1.1rem", textAlign: "center", color: "#6b4460",
            outline: "none", fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.3em",
            boxShadow: error ? "0 0 0 4px rgba(248,113,113,0.15)" : "0 4px 20px rgba(220,150,200,0.15)",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
        />
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="handwriting"
            style={{ color: "#f87171", fontSize: "clamp(1rem,3vw,1.25rem)", marginTop: -12 }}
          >
            có mỗi sinh nhật cũng ghi sai 😒
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); handleSubmit(); }}
        style={{
          padding: "13px 40px", borderRadius: 999,
          background: "linear-gradient(135deg, #f472b6, #c084fc)",
          color: "white", fontSize: "clamp(0.9rem,2.5vw,1rem)",
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: "0.06em", cursor: "pointer", border: "none",
          boxShadow: "0 8px 32px rgba(240,100,180,0.35)",
        }}
      >
        Mở khoá ✨
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIFT MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function GiftModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        background: "rgba(240,200,230,0.35)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 18, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(440px, 94vw)",
          background: "linear-gradient(160deg, #fffdf9 0%, #fdf0f8 100%)",
          borderRadius: 20,
          padding: "clamp(28px,6vw,52px) clamp(24px,6vw,48px)",
          boxShadow: "0 24px 80px rgba(220,100,180,0.28), 0 4px 20px rgba(200,80,160,0.12)",
          border: "1px solid rgba(255,210,235,0.9)",
          position: "relative", textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(200,150,200,0.15)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#c084fc",
          }}
        >
          <X size={15} />
        </button>

        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          style={{ fontSize: "clamp(3rem,10vw,4.5rem)", marginBottom: 16, display: "block" }}
        >
          🎁
        </motion.div>

        <h3
          className="handwriting"
          style={{
            fontSize: "clamp(1.6rem,5vw,2.2rem)",
            background: "linear-gradient(135deg, #f472b6, #c084fc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", marginBottom: 20, lineHeight: 1.3,
          }}
        >
          Điều ước của cậu đây! ✨
        </h3>

        <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(240,150,200,0.4), transparent)", marginBottom: 24 }} />

        <p className="handwriting" style={{ fontSize: "clamp(1.15rem,4.5vw,1.6rem)", color: "#6b4460", lineHeight: 2, marginBottom: 28 }}>
          Xuống nhà đi —
          <br />
          <motion.span
            animate={{ color: ["#f472b6", "#c084fc", "#f472b6"] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            style={{ fontWeight: 700, display: "inline-block" }}
          >
            tớ có quà cho mày nè 🎀
          </motion.span>
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          {["#f9a8d4", "#c084fc", "#fde68a", "#f472b6", "#ddd6fe"].map((c, i) => (
            <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.8 + i * 0.3, delay: i * 0.15 }}>
              <Heart size={18} fill={c} color={c} />
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
          onClick={onClose}
          style={{
            padding: "12px 32px", borderRadius: 999,
            background: "linear-gradient(135deg, #f472b6, #c084fc)",
            color: "white", fontSize: "clamp(0.85rem,2.5vw,0.95rem)",
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.06em", cursor: "pointer", border: "none",
            boxShadow: "0 6px 24px rgba(240,100,180,0.35)",
          }}
        >
          Okie tớ xuống liền! 🏃‍♀️
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  useEffect(() => { injectFont(); }, []);

  const [phase, setPhase] = useState("password");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [wishClicked, setWishClicked] = useState(false);
  const [showGift, setShowGift] = useState(false);

  // ── Music ──────────────────────────────────────────────────────────────────
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    // Khởi tạo audio một lần
    const audio = new Audio("/frad_-_first_date.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // Gọi hàm này khi người dùng tương tác lần đầu → vượt autoplay policy
  const startMusic = () => {
    if (musicStarted) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => {
      setPlaying(true);
      setMusicStarted(true);
    }).catch(() => {});
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const { displayed: typedGreeting, done: greetingDone } = useTypewriter(
    "Chào cậu, Như Nguyệt...", 70, phase === "greeting"
  );

  const handleEnvelopeClick = () => {
    if (!envelopeOpen) {
      setEnvelopeOpen(true);
      setTimeout(() => setPhase("letter"), 1200);
    }
  };

  const handleWish = () => {
    setWishClicked(true);
    launchConfetti();
    setTimeout(() => { setShowGift(true); setWishClicked(false); }, 1400);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #fdf6fb 0%, #f0e6f6 40%, #fce8f3 70%, #fff0f8 100%)",
        overflow: "hidden", position: "relative",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        .handwriting { font-family: 'Dancing Script', cursive !important; }
        @keyframes floatUp {
          0%   { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .particle { position: fixed; pointer-events: none; animation: floatUp linear infinite; }
        .glass {
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 8px 40px rgba(230,150,200,0.18), 0 2px 8px rgba(200,100,180,0.08);
        }
        .envelope-wrap { perspective: 900px; }
        .envelope-body {
          width: min(340px, 90vw); height: min(220px, 58vw);
          position: relative; cursor: pointer;
          filter: drop-shadow(0 12px 40px rgba(220,120,180,0.35));
        }
        .env-back {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, #f9d0e8 0%, #f3bcd8 60%, #eaa8d0 100%);
          border-radius: 6px; border: 1px solid rgba(255,255,255,0.6);
        }
        .env-bottom-fold {
          position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
          background: linear-gradient(180deg, #f0b2ce 0%, #e89dc4 100%);
          clip-path: polygon(0 100%, 50% 0%, 100% 100%);
          border-radius: 0 0 6px 6px;
        }
        .env-left-fold {
          position: absolute; top: 0; left: 0; bottom: 0; width: 55%;
          background: rgba(240,170,210,0.6); clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
        .env-right-fold {
          position: absolute; top: 0; right: 0; bottom: 0; width: 55%;
          background: rgba(230,155,200,0.55); clip-path: polygon(100% 0, 0 50%, 100% 100%);
        }
        .env-flap {
          position: absolute; top: 0; left: 0; right: 0; height: 55%;
          background: linear-gradient(180deg, #f9d0e8 0%, #f0b2ce 100%);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top center;
          transition: transform 0.7s cubic-bezier(.4,0,.2,1);
          z-index: 10; border-radius: 6px 6px 0 0;
        }
        .env-flap.open { transform: rotateX(-180deg); }
        .env-seal {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #f472b6, #e879f9);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 12px rgba(240,100,180,0.5); z-index: 20;
        }
        .letter-page {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 16px;
        }
        .letter-paper {
          width: min(560px, 98vw); max-height: 92dvh; overflow-y: auto;
          padding: clamp(24px, 6vw, 52px) clamp(20px, 6vw, 52px);
          background: linear-gradient(170deg, #fffdf9 0%, #fff8f5 100%);
          border-radius: 12px;
          box-shadow: 0 20px 80px rgba(220,120,180,0.22), 0 4px 16px rgba(200,100,160,0.12);
          border: 1px solid rgba(255,220,235,0.8); position: relative;
        }
        .letter-paper::before {
          content: ''; position: absolute; top: 0; left: clamp(40px,12vw,70px);
          width: 1px; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255,180,210,0.4), transparent);
        }
        .ruled-line {
          position: absolute; left: 0; right: 0; height: 1px;
          background: rgba(255,200,220,0.3); pointer-events: none;
        }
        input:focus { outline: none; }
        .letter-paper::-webkit-scrollbar { width: 4px; }
        .letter-paper::-webkit-scrollbar-thumb { background: rgba(240,150,200,0.3); border-radius: 99px; }

        /* Music button vinyl animation */
        .music-btn-playing .vinyl { animation: spin 3s linear infinite; }
      `}</style>

      {/* ── Floating Particles ── */}
      {PARTICLES.map((p) => (
        <div key={p.id} className="particle" style={{ left: `${p.x}%`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, opacity: p.opacity }}>
          {p.type === "heart"   && <Heart    size={p.size} fill="#f9a8d4" color="#f9a8d4" />}
          {p.type === "sparkle" && <Sparkles size={p.size} color="#d8b4fe" />}
          {p.type === "star"    && <Star     size={p.size} fill="#fde68a" color="#fde68a" />}
        </div>
      ))}

      {/* ── Music Button (luôn hiện sau lần tương tác đầu) ── */}
      <AnimatePresence>
        {musicStarted && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleMusic}
            className={playing ? "music-btn-playing" : ""}
            title={playing ? "Tắt nhạc" : "Bật nhạc"}
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 999,
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #f472b6, #c084fc)",
              border: "2px solid rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: playing
                ? "0 4px 24px rgba(240,100,180,0.6), 0 0 0 4px rgba(244,114,182,0.2)"
                : "0 4px 20px rgba(240,100,180,0.4)",
              transition: "box-shadow 0.3s",
              flexDirection: "column", gap: 1,
            }}
          >
            {/* Vinyl disc */}
            <div
              className="vinyl"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "radial-gradient(circle at 50%, #fff 18%, #f9a8d4 20%, #c084fc 45%, #9d4edd 60%, #1a0a2e 100%)",
                border: "1.5px solid rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white", opacity: 0.9 }} />
            </div>
            {/* Playing indicator */}
            {playing && (
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 8, marginTop: -2 }}>
                {[5, 8, 6, 9, 5].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [h, h + 5, h] }}
                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, delay: i * 0.08 }}
                    style={{ width: 2, background: "white", borderRadius: 1, height: h }}
                  />
                ))}
              </div>
            )}
            {!playing && (
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: -2, letterSpacing: "0.02em" }}>▶</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ══ PASSWORD ══ */}
        {phase === "password" && (
          <PasswordGate key="password" onUnlock={() => setPhase("greeting")} onStartMusic={startMusic} />
        )}

        {/* ══ GREETING ══ */}
        {phase === "greeting" && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(20px,5vh,40px)", padding: "24px 16px", textAlign: "center" }}
          >
            <motion.p style={{ fontSize: "clamp(1.1rem,3.5vw,1.5rem)", color: "#c084fc", letterSpacing: "0.06em", minHeight: "1.8em", fontStyle: "italic" }}>
              {typedGreeting}
              <span style={{ display: "inline-block", width: 2, height: "1em", background: "#c084fc", marginLeft: 3, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
            </motion.p>

            <AnimatePresence>
              {greetingDone && (
                <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="handwriting" style={{ fontSize: "clamp(2rem,8vw,4.5rem)", background: "linear-gradient(135deg, #f472b6, #c084fc, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.2 }}>
                    Chúc mừng tuổi 16<br />rực rỡ nhất! ✨
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {greetingDone && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
                style={{ fontSize: "clamp(0.9rem,2.5vw,1.1rem)", color: "#a78bfa", letterSpacing: "0.1em", fontStyle: "italic" }}>
                dành tặng Như Nguyệt yêu quý 🌙
              </motion.p>
            )}

            {greetingDone && (
              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => setPhase("envelope")}
                className="glass"
                style={{ marginTop: 8, padding: "14px 36px", borderRadius: 999, fontSize: "clamp(0.9rem,2.5vw,1rem)", color: "#9d4edd", cursor: "pointer", border: "1.5px solid rgba(200,150,230,0.5)", letterSpacing: "0.05em", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Mở quà bí mật ✉️
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ══ ENVELOPE ══ */}
        {phase === "envelope" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, padding: "24px 16px" }}
          >
            <motion.p initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ color: "#c084fc", fontSize: "clamp(0.9rem,2.5vw,1.1rem)", letterSpacing: "0.08em", fontStyle: "italic" }}>
              Có một lá thư đang chờ cậu...
            </motion.p>

            <div className="envelope-wrap">
              <motion.div className="envelope-body" onClick={handleEnvelopeClick}
                whileHover={!envelopeOpen ? { y: -8, scale: 1.03 } : {}}
                whileTap={!envelopeOpen ? { scale: 0.97 } : {}}
              >
                <div className="env-back" />
                <div className="env-left-fold" />
                <div className="env-right-fold" />
                <div className="env-bottom-fold" />
                <div className={`env-flap${envelopeOpen ? " open" : ""}`} />
                {!envelopeOpen && <div className="env-seal"><Heart size={16} fill="white" color="white" /></div>}
                {envelopeOpen && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: -30, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ position: "absolute", bottom: 10, left: "10%", right: "10%", height: 70, background: "#fffdf9", borderRadius: "6px 6px 0 0", boxShadow: "0 -4px 20px rgba(220,120,180,0.2)", zIndex: 5 }}
                  />
                )}
              </motion.div>
            </div>

            {!envelopeOpen && (
              <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ color: "#d8b4fe", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                Nhấn để mở phong bì 💌
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ LETTER ══ */}
      <AnimatePresence>
        {phase === "letter" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="letter-page"
            style={{ background: "rgba(253,240,252,0.6)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              className="letter-paper"
              initial={{ y: 80, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="ruled-line" style={{ top: `${60 + i * 32}px` }} />
              ))}

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                <Heart size={18} fill="#f9a8d4" color="#f9a8d4" />
                <Heart size={14} fill="#ddd6fe" color="#ddd6fe" />
                <Heart size={10} fill="#fde68a" color="#fde68a" />
              </motion.div>

              {[
                { delay: 0.2,  text: "Gửi Như Nguyệt," },
                { delay: 0.45, text: "16 tuổi rồi nhé! Người ta nói tuổi 16 là lứa tuổi đẹp nhất, và tớ thấy may mắn vì được đồng hành cùng cậu trong những năm tháng này." },
                { delay: 0.65, text: "Cảm ơn cậu vì đã luôn là một người bạn tuyệt vời (đôi khi hơi vô chi :) )." },
                { delay: 0.82, text: "Chúc cậu tuổi mới luôn tỏa sáng, xinh đẹp và hạnh phúc như chính cái tên của mình." },
                { delay: 0.98, text: "Dù sau này có thế nào, hãy nhớ là tớ vẫn luôn ở đây, phía sau ủng hộ cậu vô điều kiện." },
                { delay: 1.1,  text: "Happy Sweet 16 nha Nguyệt :3", style: { fontSize: "clamp(1.3rem,4vw,1.8rem)", background: "linear-gradient(135deg, #f472b6, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginTop: 8 } },
              ].map((item, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay, duration: 0.7 }}
                  className="handwriting"
                  style={{ fontSize: i === 0 ? "clamp(1.3rem,4.5vw,1.9rem)" : "clamp(1.05rem,3.5vw,1.4rem)", color: "#6b4460", lineHeight: 1.85, marginBottom: i === 0 ? 20 : 12, ...item.style }}
                >
                  {item.text}
                </motion.p>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }}
                style={{ marginTop: 32, textAlign: "right", borderTop: "1px solid rgba(255,180,210,0.3)", paddingTop: 20 }}>
                <p className="handwriting" style={{ color: "#c084fc", fontSize: "clamp(1rem,3vw,1.3rem)", fontStyle: "italic" }}>
                  — Người bạn thân của cậu 🌙
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.7 }}
                style={{ marginTop: 36, textAlign: "center" }}>
                <motion.button
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                  onClick={handleWish}
                  style={{
                    padding: "15px 36px", borderRadius: 999,
                    background: wishClicked ? "linear-gradient(135deg, #fbbf24, #f472b6)" : "linear-gradient(135deg, #f472b6, #c084fc)",
                    color: "white", fontSize: "clamp(0.9rem,2.5vw,1rem)",
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: "0.06em", cursor: "pointer", border: "none",
                    boxShadow: "0 8px 32px rgba(240,100,180,0.4)",
                    transition: "background 0.4s",
                  }}
                >
                  {wishClicked ? "🎉 Đang chuẩn bị quà..." : "✨ Nhấn vào đây để nhận điều ước"}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ GIFT MODAL ══ */}
      <AnimatePresence>
        {showGift && <GiftModal key="gift" onClose={() => setShowGift(false)} />}
      </AnimatePresence>
    </div>
  );
}
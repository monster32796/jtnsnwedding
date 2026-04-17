import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand } from "lucide-react";

export default function WeddingInvitationWebsite() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCurtainOpened, setIsCurtainOpened] = useState(false);
  const [isCurtainOpening, setIsCurtainOpening] = useState(false);
  const RSVP_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxAA__B0KP3g5ZBNhU_xmMzYX2ZsNm_jSRdt1QaLBomT0QoxBajMRR1ek4B6HTbwawDnw/exec";

  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [kidsCount, setKidsCount] = useState("0");
  const [guestMessage, setGuestMessage] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isHalal, setIsHalal] = useState(false);
  const [allergyNotes, setAllergyNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showThankYouScreen, setShowThankYouScreen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const openInvitation = () => {
    if (isCurtainOpening || isCurtainOpened) return;

    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch((error) => console.error("Audio play blocked", error));
    }

    setIsCurtainOpening(true);
    window.setTimeout(() => {
      setIsCurtainOpened(true);
    }, 1900);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.volume = 0.45;
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      console.error("Audio toggle failed", error);
    }
  };

  useEffect(() => {
    const target = new Date("2026-09-19T00:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleSubmitRSVP = async () => {
    if (!guestName.trim() && guestCount !== "0") {
      alert("Please enter your name.");
      return;
    }

    if (!RSVP_WEB_APP_URL.trim()) {
  alert("Please paste your Google Apps Script Web App URL first.");
  return;
}


    setIsSubmitting(true);
    setSubmitStatus("idle");

    const payload = {
      submittedAt: new Date().toISOString(),
      attendance: guestCount === "0" ? "No" : "Yes",
      guestName,
      phoneNumber,
      adults: guestCount === "0" ? "0" : guestCount,
      kids: guestCount === "0" ? "0" : kidsCount,
      vegetarian: isVegetarian ? "Yes" : "No",
      halal: isHalal ? "Yes" : "No",
      allergyNotes,
      guestMessage,
    };

    try {
      await fetch(RSVP_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      setSubmitStatus("success");
      setShowThankYouScreen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("RSVP submission failed", error);
      setSubmitStatus("error");
      alert("Failed to submit RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#120707] text-[#f7ead7]">
      <audio ref={audioRef} src="/music.mp3" preload="auto" onEnded={() => setIsMusicPlaying(false)} />

      <button
        type="button"
        onClick={toggleMusic}
        className="fixed left-4 top-4 z-[100] flex items-center gap-3"
      >
        {/* CD */}
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl animate-spin`}
          style={{ animationDuration: isMusicPlaying ? "5s" : "10s" }}
        >
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#d4c4a8,#f5e6c8,#cbb89a,#f5e6c8,#d4c4a8)] border border-[#bfae90]" />
          <div className="absolute inset-1 rounded-full border border-[#bfae90] opacity-60" />
          <div className="absolute inset-2 rounded-full border border-[#bfae90] opacity-40" />
          <div className="absolute h-8 w-8 rounded-full bg-[#7a3727] flex items-center justify-center text-[8px] text-white font-serif tracking-wide">
            CD
          </div>
          <div className="absolute h-2 w-2 rounded-full bg-black" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_40%)]" />
        </div>

        {/* TEXT */}
        <span className={`text-sm font-serif tracking-wide transition-opacity duration-500 ${isMusicPlaying ? "text-white opacity-100" : "text-white/70 opacity-60"}`}>
          {isMusicPlaying ? "暂停音乐 · Stop Music" : "播放音乐 · Play Music"}
        </span>
      </button>
      <AnimatePresence mode="wait">
        {showThankYouScreen ? (
          <motion.section
            key="thank-you"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-screen items-center justify-center bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-16 text-[#7a3727]"
          >
            <div className="w-full max-w-2xl rounded-[2rem] border border-[#e5d8cb] bg-white/90 p-10 text-center shadow-xl">
              <p
                className="text-lg"
                style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1.6", letterSpacing: "0.04em" }}
              >
                感谢您的回复
              </p>
              <h2
                className="mt-3 text-4xl font-serif"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.06em" }}
              >
                Thank You
              </h2>
              <p
                className="mt-6 text-base leading-relaxed"
                style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1.8", letterSpacing: "0.03em" }}
              >
                我们已收到您的 RSVP，期待与您共度这美好时刻。
                <br />
                We have received your RSVP and look forward to celebrating with you.
              </p>
              {guestName && (
                <p
                  className="mt-6 text-xl"
                  style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.04em" }}
                >
                  Dear {guestName}, see you soon.
                </p>
              )}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setShowThankYouScreen(false)}
                  className="rounded-full border border-[#d7c6b7] px-6 py-3 text-[#7a3727]"
                >
                  Back to Invitation
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-full bg-[#7a3727] px-6 py-3 text-white"
                >
                  Submit Another
                </button>
              </div>
            </div>
          </motion.section>
        ) : !isCurtainOpened ? (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2b0606]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,230,0.18),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.03),rgba(0,0,0,0.45))]" />

            <motion.div
              initial={{ opacity: 0.18, scale: 0.96 }}
              animate={isCurtainOpening ? { opacity: 0.36, scale: 1.08 } : { opacity: 0.18, scale: 1 }}
              transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,236,214,0.24),transparent_34%)]"
            />

            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 overflow-hidden">
              <motion.div
                initial={false}
                animate={isCurtainOpening ? { x: "-115%", scaleX: 1.03 } : { x: 0, scaleX: 1 }}
                transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-y-0 left-0 w-full origin-left"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#5e0908_0%,#7d0f0d_7%,#9a1711_13%,#76100d_21%,#a01812_28%,#7b100d_36%,#9e1912_44%,#71100c_52%,#991710_60%,#6d0c0a_69%,#8d120f_78%,#6a0a08_89%,#4f0606_100%)]" />
                <div className="absolute inset-0 opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,244,228,0)_0px,rgba(255,244,228,0)_26px,rgba(255,231,214,0.68)_31px,rgba(255,231,214,0.14)_34px,rgba(0,0,0,0.16)_39px,rgba(255,244,228,0)_58px)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_30%_55%,rgba(255,255,255,0.10),transparent_14%),linear-gradient(to_right,rgba(255,255,255,0.04),transparent_18%,transparent_70%,rgba(0,0,0,0.24))]" />
                <div className="absolute inset-y-0 right-0 w-[8px] bg-[linear-gradient(to_bottom,rgba(255,243,230,0.85),rgba(255,243,230,0.45),rgba(255,243,230,0.85))] blur-[0.5px]" />
              </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 overflow-hidden">
              <motion.div
                initial={false}
                animate={isCurtainOpening ? { x: "115%", scaleX: 1.03 } : { x: 0, scaleX: 1 }}
                transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-y-0 right-0 w-full origin-right"
              >
                <div className="absolute inset-0 bg-[linear-gradient(270deg,#5e0908_0%,#7d0f0d_7%,#9a1711_13%,#76100d_21%,#a01812_28%,#7b100d_36%,#9e1912_44%,#71100c_52%,#991710_60%,#6d0c0a_69%,#8d120f_78%,#6a0a08_89%,#4f0606_100%)]" />
                <div className="absolute inset-0 opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,244,228,0)_0px,rgba(255,244,228,0)_26px,rgba(255,231,214,0.68)_31px,rgba(255,231,214,0.14)_34px,rgba(0,0,0,0.16)_39px,rgba(255,244,228,0)_58px)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_70%_55%,rgba(255,255,255,0.10),transparent_14%),linear-gradient(to_left,rgba(255,255,255,0.04),transparent_18%,transparent_70%,rgba(0,0,0,0.24))]" />
                <div className="absolute inset-y-0 left-0 w-[8px] bg-[linear-gradient(to_bottom,rgba(255,243,230,0.85),rgba(255,243,230,0.45),rgba(255,243,230,0.85))] blur-[0.5px]" />
              </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[11] w-[6px] -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(255,247,235,0.95),rgba(255,247,235,0.5),rgba(255,247,235,0.95))] shadow-[0_0_18px_rgba(255,240,220,0.45)]" />

            <div className="relative z-20 flex flex-col items-center px-6 text-center text-white">
              <motion.button
                onClick={openInvitation}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="group flex flex-col items-center"
                type="button"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.07, 1],
                    opacity: [0.78, 1, 0.78],
                    boxShadow: [
                      "0 0 0 rgba(255,255,255,0.12)",
                      "0 0 34px rgba(255,255,255,0.24)",
                      "0 0 0 rgba(255,255,255,0.12)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-[2px] sm:h-24 sm:w-24"
                >
                  <span className="absolute inset-0 rounded-full border border-white/15" />
                  <span className="absolute inset-3 rounded-full border border-white/15" />
                  <Hand className="h-7 w-7 text-white/80 sm:h-8 sm:w-8" strokeWidth={1.6} />
                </motion.div>
                <p className="mt-5 text-sm tracking-[0.18em] text-white/80 sm:text-base">
                  {isCurtainOpening ? "Opening..." : "Tap to continue"}
                </p>
              </motion.button>
            </div>
          </motion.section>
        ) : (
          <motion.main
            key="site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] text-[#6d3122]"
          >
            <section className="relative min-h-screen overflow-hidden bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px]">
              <div className="absolute inset-y-0 left-0 z-10 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] bg-[linear-gradient(90deg,#64100d_0%,#8c1712_18%,#73120e_36%,#971912_52%,#6d100d_70%,#8d1610_84%,#5a0c0a_100%)] opacity-95" />
              <div className="absolute inset-y-0 right-0 z-10 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] bg-[linear-gradient(270deg,#64100d_0%,#8c1712_18%,#73120e_36%,#971912_52%,#6d100d_70%,#8d1610_84%,#5a0c0a_100%)] opacity-95" />
              <div className="absolute inset-y-0 left-0 z-20 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,239,225,0)_0px,rgba(255,239,225,0)_24px,rgba(255,236,220,0.88)_28px,rgba(255,236,220,0.10)_31px,rgba(0,0,0,0.16)_37px,rgba(255,239,225,0)_56px)]" />
              <div className="absolute inset-y-0 right-0 z-20 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,239,225,0)_0px,rgba(255,239,225,0)_24px,rgba(255,236,220,0.88)_28px,rgba(255,236,220,0.10)_31px,rgba(0,0,0,0.16)_37px,rgba(255,239,225,0)_56px)]" />

              <div className="relative z-30 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:px-10">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                  className="text-sm text-[#7a3727] sm:text-base md:text-lg"
                    style={{ lineHeight: "1.6", letterSpacing: "0.08em", fontFamily: "'Noto Serif SC', serif" }}
                >
                  我们终于步入人生新篇章!
                  <br />
				  <span
                    className="text-sm text-[#7a3727] sm:text-base md:text-lg"
                    style={{ lineHeight: "1.6", letterSpacing: "0.08em", fontFamily: "'Playfair Display', serif" }}
                  >
                  We finally tied the knot!
				  </span>
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-8 text-4xl text-[#7a3727] sm:text-5xl md:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.08em", lineHeight: "1.1" }}
                >
                  吴佳得
                  <br />
                  <span
                    className="block mt-2 text-lg md:text-xl"
                    style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.6", letterSpacing: "0.02em" }}
                  >
                    Goh Jia Teck
                  </span>
                  <span className="text-3xl md:text-4xl"
				  style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1", letterSpacing: "0.02em" }}>&</span><br />
                  <br />
				  <span
                    className="mt-8 text-4xl text-[#7a3727] sm:text-5xl md:text-6xl lg:text-7xl"
                    style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1", letterSpacing: "0.02em" }}
                  >
                  黄薪霓
				  </span>
                  <br />
                  <span
                    className="block mt-2 text-lg md:text-xl"
                    style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.6", letterSpacing: "0.02em" }}
                  >
                    Shannon Ng
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-10 max-w-3xl space-y-5 px-2 sm:px-4"
                >
                  <p
                    className="text-sm text-[#7a3727] sm:text-base md:text-lg"
                    style={{ lineHeight: "1.6", letterSpacing: "0.08em", fontFamily: "'Noto Serif SC', serif" }}
                  >
                    您的到来，将让这份喜悦更加圆满
                    <br />
                    期待与您共享这美好时刻
                    <br />
                    <span style={{ fontFamily: "'Playfair Display', serif" }}>
                      Your presence will only extend <br />the joy and the smiles on our face
                      <br />
                      We cannot afford to miss the pleasure <br />of your presences at our wedding
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="mt-14 flex flex-col items-center text-[#7a3727] sm:mt-16"
                >
                  <span className="text-xs uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.32em]"
				  style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.6", letterSpacing: "0.02em" }}>下滑 · Scroll</span>
                  <span className="mt-3 text-4xl leading-none">↓</span>
                </motion.div>
              </div>
            </section>

            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <div className="mx-auto max-w-4xl">
                <img
                  src="/wedding.JPG"
                  alt="Wedding-picture"
                  className="w-full max-w-lg mx-auto rounded-[2rem] shadow-lg"
                />
                <p className="mt-10 text-2xl"
				style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1", letterSpacing: "0.02em" }}>
                  <br />
				  预留此日
				  <br />
				  <span className="mt-10 text-2xl"
				  style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1", letterSpacing: "0.02em" }}>Save the Date</span>
				  <br />
				  <br />
				  <br />
                  <span className="block mt-2 text-3xl sm:text-4xl font-semibold" style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1", letterSpacing: "0.02em" }}>
                    2026年9月19日
                  </span>


              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-12 w-full"
              >
                <div className="mx-auto max-w-[260px] text-[#5e3a31]">
                  <div className="border-y border-[#7a3727]/60 py-3 text-center">
                    <p
                      className="text-[15px] uppercase tracking-[0.35em]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      September&nbsp;&nbsp;&nbsp;2026
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.12em] text-[#6f4a3f]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-7 items-center text-center text-lg">
                    {[14, 15, 16, 17, 18].map((date) => (
                      <span key={date} style={{ fontFamily: "'Playfair Display', serif" }}>{date}</span>
                    ))}

                    <motion.div
                      initial={{ scale: 0.9, opacity: 0.7 }}
                      animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="mx-auto relative flex h-12 w-12 items-center justify-center"
                    >
                      <svg viewBox="0 0 40 36" className="absolute inset-0 h-full w-full overflow-visible" style={{ filter: "drop-shadow(0 0 4px rgba(155,107,91,0.18))" }}>
                        <path
                          d="M20 33
                             C 18 31, 5 20, 5 11
                             C 5 5.8, 8.8 2.5, 13.4 2.5
                             C 16.4 2.5, 18.8 4, 20 6.4
                             C 21.2 4, 23.6 2.5, 26.6 2.5
                             C 31.2 2.5, 35 5.8, 35 11
                             C 35 20, 22 31, 20 33 Z"
                          fill="none"
                          stroke="#9b6b5b"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>

                      <span
                        className="relative z-10 text-[#7a3727] text-sm"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        19
                      </span>
                    </motion.div>

                    <span style={{ fontFamily: "'Playfair Display', serif" }}>20</span>
                  </div>
                </div>
              </motion.div>
                </p>
              </div>
			  <div className="mt-10 flex flex-wrap justify-center gap-6">
                {[
                  ["天", "DAYS", timeLeft.days],
                  ["时", "HOURS", timeLeft.hours],
                  ["分", "MIN", timeLeft.minutes],
                  ["秒", "SEC", timeLeft.seconds],
                ].map(([cn, en, value]) => (
                  <div key={en as string} className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-[#7a3727] text-xl text-[#7a3727]">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="mt-2 text-center text-xs tracking-[0.2em] text-[#8a4a3a]">
                      <div>{cn}</div>
                      <div>{en}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-2xl" style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1", letterSpacing: "0.02em" }}>距婚礼之日</p>
			  <span className="mt-10 text-2xl"
				  style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.2", letterSpacing: "0.02em" }}>until the big day</span>
            </section>

            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <h2 className="text-3xl italic text-[#7a3727]">婚礼地点</h2>
			  <h3 className="text-3xl italic text-[#7a3727]">Venue</h3>
              <h4 className="mt-6 text-3xl font-serif text-[#7a3727]">
                北京楼柔佛再也· 2号厅
              </h4>
			  <h5 className="mt-6 text-3xl font-serif text-[#7a3727]">
                Restaurant Pekin Johor Jaya · Hall 2
              </h5>
              <div className="mt-10 overflow-hidden rounded-2xl border border-[#e5d8cb] shadow-sm">
                <iframe
                  src="https://www.google.com/maps?q=Restaurant+Pekin+Johor+Jaya&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mt-6 flex flex-col items-center gap-3">
              <a
                href="https://share.google/9RL9lEQIqXmD6aTnx"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-[#e5d8cb] hover:shadow-lg transition"
              >
                <img src="/google-maps.png" alt="Google Maps" className="w-8 h-8" />
                <span className="text-[#7a3727] font-serif text-base">
                  Google
                </span>
              </a>

              <a
                href="https://ul.waze.com/ul?place=ChIJr1npfG9s2jERhBLU6DKztWI&ll=1.52385010%2C103.80705860&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#e8f4f8] shadow-md border border-[#d6e6ee] hover:shadow-lg transition"
              >
                <img src="/waze.png" alt="Waze" className="w-8 h-8" />
                <span className="text-[#5a7d8a] font-serif text-base">
                  Waze
                </span>
              </a>

            </div>
            </section>

            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <h2 className="text-3xl italic text-[#7a3727]">婚礼流程</h2>
			  <h3 className="text-3xl italic text-[#7a3727]">About Wedding</h3>
              <div className="mt-12 flex flex-col items-center gap-6 text-[#7a3727]">

                <div className="text-center">
                  <p className="text-lg">18:00</p>
                  <p className="mt-2 text-xl">签到合影</p>
                  <p className="mt-1 text-base italic">Arrival</p>
                </div>

                <div className="text-2xl">|</div>

                <div className="text-center">
                  <p className="text-lg">19:00</p>
                  <p className="mt-2 text-xl">晚宴</p>
                  <p className="mt-1 text-base italic">Dinner</p>
                </div>

                <div className="text-2xl">|</div>

                <div className="text-center">
                  <p className="text-lg">22:00</p>
                  <p className="mt-2 text-xl">圆满结束</p>
                  <p className="mt-1 text-base italic">End</p>
                </div>

              </div>

               <div className="mt-10 text-center">
                <p className="text-base text-[#7a3727] tracking-wide">
                  *敬请<span className="font-semibold underline">7时</span>准时入席
                </p>
                <p className="mt-2 text-base italic text-[#7a3727] tracking-wide">
                  *Dinner begins at <span className="font-semibold underline">19:00</span>
                </p>
              </div>

            </section>

            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <h2 className="text-4xl font-serif text-[#7a3727]">着装要求</h2>
			  <h2 className="text-4xl font-serif text-[#7a3727]">Dress Code</h2>
              <div className="mt-10 flex justify-center">
                <img
                  src="/formal.png"
                  alt="Dress Code"
                  className="max-w-md w-full"
                />
              </div>
			  <br />
              <h3 className="text-3xl italic text-[#7a3727]">正式服装</h3>
			  <h3 className="text-3xl italic text-[#7a3727]">Formal attire</h3>
              <p className="mt-4 italic text-[#7a3727]">
                请把白色着装留给新娘<br />Please leave the white to the bride
              </p>
			  <br />
			  <h2 className="text-3xl text-[#7a3727]">婚礼色调</h2>
              <p className="mt-2 text-xl italic text-[#7a3727]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Wedding Palette
              </p>
			  <div className="mt-8 flex justify-center gap-10">
                <div className="flex flex-col items-center">
                  <div className="h-5 w-5 rounded-full border-2 border-[#4a0d0d] bg-[#b30000] shadow-inner" />
                  <p className="mt-2 text-sm text-[#7a3727]">红色 · Red</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-5 w-5 rounded-full border-2 border-[#222] bg-[#000000] shadow-inner" />
                  <p className="mt-2 text-sm text-[#7a3727]">黑色 · Black</p>
                </div>
              </div>
			  
            </section>
			
			

            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24">
              <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#e5d8cb] bg-white/80 p-8 shadow-sm md:p-10">
                <div className="text-center">
                  <h2 className="font-serif text-5xl italic text-[#7a3727]">出席回复</h2>
				  <h2 className="font-serif text-5xl italic text-[#7a3727]">RSVP</h2>
				  <p className="text-base text-[#7a3727] tracking-wide">
                  by <span className="font-semibold underline">30th May 2026</span>
                </p>
				  <p className="mt-3 text-base text-[#8a4a3a]">让我们知道您是否能出席我们的婚礼</p>
                  <p className="mt-3 text-base text-[#8a4a3a]">Let us know if you can make it</p>
                </div>

                <form className="mt-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <p className="text-2xl font-serif text-[#6d3122]">您会参加吗？ · Will you be attending?</p>
                    <div className="mt-5 space-y-4 text-[#6d3122]">
                      <label className="flex items-center gap-3 text-base">
                        <input
                          type="radio"
                          name="attendance"
                          value="yes"
                          checked={guestCount !== "0"}
                          onChange={() => setGuestCount("1")}
                          className="h-4 w-4 accent-[#a37b3a]"
                        />
                        <span>是，我会出席 · Yes, I&apos;ll be there</span>
                      </label>
                      <label className="flex items-center gap-3 text-base">
                        <input
                          type="radio"
                          name="attendance"
                          value="no"
                          checked={guestCount === "0"}
                          onChange={() => setGuestCount("0")}
                          className="h-4 w-4 accent-[#a37b3a]"
                        />
                        <span>很遗憾，我不能出席 · Unfortunately, I can&apos;t make it</span>
                      </label>
                    </div>
                  </div>

                  {guestCount !== "0" ? (
                    <>
                      <div className="grid gap-8 md:grid-cols-2">
                        <div>
                          <p className="text-xl font-serif text-[#6d3122]">成人数量 · How many adults?</p>
                          <div className="mt-4 flex items-center gap-5">
                            <button type="button" onClick={() => setGuestCount((prev) => String(Math.max(1, Number(prev || 1) - 1)))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">−</button>
                            <span className="min-w-8 text-center text-lg text-[#6d3122]">{guestCount}</span>
                            <button type="button" onClick={() => setGuestCount((prev) => String(Number(prev || 1) + 1))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">+</button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xl font-serif text-[#6d3122]">小孩数量 · How many kids?</p>
                          <div className="mt-4 flex items-center gap-5">
                            <button type="button" onClick={() => setKidsCount((prev) => String(Math.max(0, Number(prev || 0) - 1)))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">−</button>
                            <span className="min-w-8 text-center text-lg text-[#6d3122]">{kidsCount}</span>
                            <button type="button" onClick={() => setKidsCount((prev) => String(Number(prev || 0) + 1))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">+</button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] bg-[#faf7f3] p-5">
                        <p className="text-base text-[#8a6c4e]">联络人 · Main contact</p>
                        <div className="mt-4 space-y-4">
                          <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="名字 · Full name" className="w-full rounded-xl border border-[#eadfd4] bg-white px-5 py-4 text-[#6d3122] outline-none" />
                          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="电话号码 · Phone Number" className="w-full rounded-xl border border-[#eadfd4] bg-white px-5 py-4 text-[#6d3122] outline-none" />
                        </div>
                      </div>

                      <div>
                        <p className="text-xl font-serif text-[#6d3122]">饮食要求 · Dietary requirements</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setIsVegetarian((prev) => !prev)} className={`rounded-full border px-5 py-2 text-sm ${isVegetarian ? "bg-[#7a3727] text-white" : "bg-white"}`}>素食 · Vegetarian</button>
                          <button type="button" onClick={() => setIsHalal((prev) => !prev)} className={`rounded-full border px-5 py-2 text-sm ${isHalal ? "bg-[#7a3727] text-white" : "bg-white"}`}>清真 · Halal</button>
                        </div>
                        <textarea value={allergyNotes} onChange={(e) => setAllergyNotes(e.target.value)} placeholder="过敏史或备注 · Allergies or notes" className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                      </div>

                      <div>
                        <p className="text-xl font-serif text-[#6d3122]">新人祝语 · Wishes</p>
                        <textarea value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} placeholder="祝语 · Your message" className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                       
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-xl font-serif text-[#6d3122]">新人祝语 · Message for the couple</p>
                      <textarea value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} placeholder="祝语 · Your message" className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                       
                    </div>
                  )}

                  <button type="button" onClick={handleSubmitRSVP} disabled={isSubmitting} className="w-full rounded-2xl bg-[#7a3727] px-6 py-4 text-white uppercase disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting..." : "Submit RSVP"}</button>

                  {submitStatus === "success" && (
                    <p className="text-center text-sm text-green-700">RSVP submitted successfully.</p>
                  )}

                  {submitStatus === "error" && (
                    <p className="text-center text-sm text-red-700">Submission failed. Please try again.</p>
                  )}
                </form>
              </div>
            </section>

            <section className="border-t border-[#e5d8cb] bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-10 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a4a3a] sm:tracking-[0.42em]">
                百年好合 · 永结同心 · We look forward to celebrating with you
              </p>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

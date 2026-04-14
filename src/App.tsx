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
  const [isPublicMessage, setIsPublicMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
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
      publicMessage: isPublicMessage ? "Yes" : "No",
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
      alert("我们收到啦！ .  We got it !");
    } catch (error) {
      console.error("RSVP submission failed", error);
      setSubmitStatus("error");
      alert("在发多一次哦！ . Re-submit Again !");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#120707] text-[#f7ead7]">
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

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
        {!isCurtainOpened ? (
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
                  {isCurtainOpening ? "Opening..." : "点击惊喜 . Tap for surprise"}
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
            className="bg-[#f6f1ea] text-[#6d3122]"
          >
            <section className="relative min-h-screen overflow-hidden bg-[#f6f1ea]">
              <div className="absolute inset-y-0 left-0 z-10 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] bg-[linear-gradient(90deg,#64100d_0%,#8c1712_18%,#73120e_36%,#971912_52%,#6d100d_70%,#8d1610_84%,#5a0c0a_100%)] opacity-95" />
              <div className="absolute inset-y-0 right-0 z-10 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] bg-[linear-gradient(270deg,#64100d_0%,#8c1712_18%,#73120e_36%,#971912_52%,#6d100d_70%,#8d1610_84%,#5a0c0a_100%)] opacity-95" />
              <div className="absolute inset-y-0 left-0 z-20 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,239,225,0)_0px,rgba(255,239,225,0)_24px,rgba(255,236,220,0.88)_28px,rgba(255,236,220,0.10)_31px,rgba(0,0,0,0.16)_37px,rgba(255,239,225,0)_56px)]" />
              <div className="absolute inset-y-0 right-0 z-20 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,239,225,0)_0px,rgba(255,239,225,0)_24px,rgba(255,236,220,0.88)_28px,rgba(255,236,220,0.10)_31px,rgba(0,0,0,0.16)_37px,rgba(255,239,225,0)_56px)]" />

              <div className="relative z-30 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:px-10">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                  className="mx-auto max-w-[92%] text-[10px] uppercase tracking-[0.16em] text-[#7a3727] sm:text-xs sm:tracking-[0.24em] md:tracking-[0.32em]"
                >
                  诚挚邀请您参加我们的婚礼
                  <br />
                  YOU ARE CORDIALLY INVITED
					<br />
				TO CELEBRATE THE WEDDING OF
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-8 font-serif text-4xl leading-[1.05] tracking-tight text-[#7a3727] sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  Jia Teck
                  <br />
					吴佳得
					<br />
                  <span className="text-3xl sm:text-4xl md:text-5xl">&</span>
                  <br />
                  Shannon Ng
					<br />
					黄薪霓
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-10 max-w-3xl space-y-5 px-2 sm:px-4"
                >
                  <p className="text-sm leading-7 tracking-[0.06em] text-[#7a3727] sm:text-base sm:leading-8 sm:tracking-[0.1em] md:text-lg md:tracking-[0.16em]">
                    希望您见证我们的婚礼,<br />
					  与我们共度人生中最特别的一天。
                    <br />
                    CELEBRATE WITH US THE <br />MOST SPECIAL DAY <br />OF OUR LIVES. <br />IT WOULD BE AN HONOR TO <br />HAVE YOU PRESENT AT <br />THIS IMPORTANT MOMENT.
                  </p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="mt-14 flex flex-col items-center text-[#7a3727] sm:mt-16"
                >
                  <span className="text-xs uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.32em]">下滑 · Scroll</span>
                  <span className="mt-3 text-4xl leading-none">↓</span>
                </motion.div>
              </div>
            </section>

            <section className="bg-[#f6f1ea] px-6 py-24 text-center">
              <div className="mx-auto max-w-4xl">
                <img
                  src="/wedding.JPG"
                  alt="Wedding-picture"
                  className="w-full max-w-lg mx-auto rounded-[2rem] shadow-lg"
                />
                <p className="mt-10 text-2xl italic text-[#7a3727]">
                  我们要结婚啦 · We&apos;re getting married
                  <br />
                  <span className="block mt-2 text-3xl sm:text-4xl font-semibold">
                    2026年9月19日
					  <br />
					  19th September 2026
                  </span>
				  <br />
                </p>
              </div>
			  <h2 className="text-3xl italic text-[#7a3727]">倒计时 · Countdown</h2>
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
			  <br />
              <p className="text-3xl italic text-[#7a3727]">距离大喜之日 · until the big day</p>
            </section>

            <section className="bg-[#f6f1ea] px-6 py-24 text-center">
              <h2 className="text-3xl italic text-[#7a3727]">婚礼地点 · Venue</h2>
              <h3 className="mt-6 text-3xl font-serif text-[#7a3727]">
                北京楼柔佛再也2号厅 · Restaurant Pekin Johor Jaya Hall 2
              </h3>
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
                className="text-[#7a3727] underline"
              >
                打开谷歌查询 · Open in Google Maps
              </a>

              <a
                href="https://ul.waze.com/ul?place=ChIJr1npfG9s2jERhBLU6DKztWI&ll=1.52385010%2C103.80705860&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                target="_blank"
                rel="noreferrer"
                className="text-[#7a3727] underline"
              >
                打开Waze查询 · Open in Waze
              </a>
            </div>
            </section>

            <section className="bg-[#f6f1ea] px-6 py-24 text-center">
              <h2 className="text-3xl italic text-[#7a3727]">婚礼流程 · Wedding Time</h2>
              <div className="relative mx-auto mt-16 max-w-3xl">
                <div className="absolute bottom-0 left-1/2 top-0 hidden w-[1px] -translate-x-1/2 bg-[#d8c4aa] md:block" />

                {[
                  { time: "18:00", text: "📷 签到合影 · Guest Arrival", side: "right" },
                  { time: "19:00", text: "🥂婚礼晚宴 · Banquet", side: "left" },
                  { time: "22:00", text: "🎉圆满结束 · Finish", side: "right" },
                ].map((item, i) => (
                  <div key={i} className="relative mb-8 md:mb-12">
                    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-[#eadfd4] bg-white/70 p-5 text-center shadow-sm md:hidden">
                      <p className="text-lg font-medium text-[#7a3727]">{item.time}</p>
                      <p className="mt-2 text-sm tracking-[0.08em] text-[#8a4a3a]">{item.text}</p>
                    </div>

                    <div className="relative hidden items-center md:flex">
                      {item.side === "left" ? (
                        <>
                          <div className="w-1/2 pr-8 text-right">
                            <p className="text-lg font-medium text-[#7a3727]">{item.time}</p>
                            <p className="mt-1 text-sm uppercase tracking-[0.12em] text-[#8a4a3a]">
                              {item.text}
                            </p>
                          </div>
                          <div className="z-10 mx-auto h-4 w-4 rounded-full border-2 border-white bg-[#7a3727]" />
                          <div className="w-1/2" />
                        </>
                      ) : (
                        <>
                          <div className="w-1/2" />
                          <div className="z-10 mx-auto h-4 w-4 rounded-full border-2 border-white bg-[#7a3727]" />
                          <div className="w-1/2 pl-8 text-left">
                            <p className="text-lg font-medium text-[#7a3727]">{item.time}</p>
                            <p className="mt-1 text-sm uppercase tracking-[0.12em] text-[#8a4a3a]">
                              {item.text}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-10 italic text-[#7a3727]">
                请准时出席，晚宴将于 19:00 准时开始。 Please be punctual. Dinner will start at 19:00 sharp.
              </p>
            </section>

            <section className="bg-[#f6f1ea] px-6 py-24 text-center">
              <h2 className="text-4xl font-serif text-[#7a3727]">服装搭配 · Dress Code</h2>
              <div className="mt-10 flex justify-center">
                <img
                  src="/formal.png"
                  alt="Dress Code"
                  className="max-w-md w-full"
                />
              </div>
              <p className="mt-8 text-base text-[#7a3727]">
                我们诚邀您盛装出席，与我们一同庆祝这个特别的日子
              </p>
              <p className="mt-4 text-base text-[#7a3727]">
                We invite you to dress elegantly and formally to celebrate this special day with us.
              </p>
              <h3 className="mt-8 text-2xl font-serif text-[#7a3727]">正式服装 · Formal attire</h3>
              <p className="mt-4 italic text-[#7a3727]">
                请把白色着装留给新娘。 · Please leave the white to the bride
              </p>
            </section>

            <section className="bg-[#f6f1ea] px-6 py-24">
              <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#e5d8cb] bg-white/80 p-8 shadow-sm md:p-10">
                <div className="text-center">
                  <h2 className="font-serif text-5xl italic text-[#7a3727]">回复出席 · RSVP</h2>
                  <p className="mt-3 text-base text-[#8a4a3a]">让我们知道您是否能出席我们的婚礼 · Let us know if you can make it</p>
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
                        <p className="text-base text-[#8a6c4e]">联络人 · Person (Main contact)</p>
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
                        <p className="text-xl font-serif text-[#6d3122]">新人祝语 · Message for the couple</p>
                        <textarea value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} placeholder="祝语 · Your message" className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => setIsPublicMessage((prev) => !prev)}
                            className={`rounded-full border px-6 py-2 text-sm transition-all duration-300 ${
                              isPublicMessage
                                ? "bg-[#7a3727] text-white shadow-md"
                                : "bg-white text-[#7a3727] hover:bg-[#f3e8e2]"
                            }`}
                          >
                            {isPublicMessage
                              ? "✔ 已设为公开祝语 · Public Message"
                              : "设为公开祝语 · Make my wishes public"}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-xl font-serif text-[#6d3122]">新人祝语 · Message for the couple</p>
                      <textarea value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} placeholder="祝语 · Your message" className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => setIsPublicMessage((prev) => !prev)}
                            className={`rounded-full border px-6 py-2 text-sm transition-all duration-300 ${
                              isPublicMessage
                                ? "bg-[#7a3727] text-white shadow-md"
                                : "bg-white text-[#7a3727] hover:bg-[#f3e8e2]"
                            }`}
                          >
                            {isPublicMessage
                              ? "✔ 已设为公开祝语 · Public Message"
                              : "设为公开祝语 · Make my wishes public"}
                          </button>
                        </div>
                    </div>
                  )}

                  <button type="button" onClick={handleSubmitRSVP} disabled={isSubmitting} className="w-full rounded-2xl bg-[#7a3727] px-6 py-4 text-white uppercase disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting..." : "提交 . Submit RSVP"}</button>

                  {submitStatus === "success" && (
                    <p className="text-center text-sm text-green-700">我们收到啦！ . We got it !</p>
                  )}

                  {submitStatus === "error" && (
                    <p className="text-center text-sm text-red-700">Submission failed. Please try again.</p>
                  )}
                </form>
              </div>
            </section>

            <section className="border-t border-[#e5d8cb] bg-[#f6f1ea] px-6 py-10 text-center">
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

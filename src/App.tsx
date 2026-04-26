import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand } from "lucide-react";

type Language = "en" | "cn" | null;

type Dictionary = {
  musicPlay: string;
  musicStop: string;
  thankYouTitle: string;
  thankYouBody: string;
  thankYouBack: string;
  thankYouAnother: string;
  tapToContinue: string;
  opening: string;
  selectLanguage: string;
  languageCn: string;
  languageEn: string;
  introTop1: string;
  groomCn: string;
  groomEn: string;
  relationship: string;
  relationshipPlaceholder: string;
  relationshipOptions: string[];
  brideCn: string;
  brideEn: string;
  introBody1: string;
  introBody2: string;
  scroll: string;
  saveDate: string;
  date: string;
  venue: string;
  venuePlace: string;
  programme: string;
  timeline: Array<{ time: string; ac: string }>;
  punctual: string;
  dress: string;
  formal: string;
  leaveWhite: string;
  palette: string;
  redLabel: string;
  whiteLabel: string;
  rsvp: string;
  rsvpBy: string;
  rsvpLead: string;
  attending: string;
  yes: string;
  no: string;
  adults: string;
  kids: string;
  contact: string;
  fullName: string;
  phone: string;
  dietary: string;
  vegetarian: string;
  halal: string;
  allergy: string;
  wishes: string;
  wishesPlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  footer: string;
};

const TEXT: Record<Exclude<Language, null>, Dictionary> = {
  cn: {
    musicPlay: "播放音乐",
    musicStop: "暂停音乐",
    thankYouTitle: "感谢您的回复",
    thankYouBody: "我们已收到您的回复，期待与您共度这美好时刻。",
    thankYouBack: "返回请帖",
    thankYouAnother: "再提交一次",
    tapToContinue: "点击惊喜 . Tap to continue",
    opening: "打开中... Opening...",
    selectLanguage: "请选择语言 · Select Language",
    languageCn: "中文",
    languageEn: "English",
    introTop1: "我们终于步入人生新篇章!",
    groomCn: "吴佳得",
    groomEn: "Goh Jia Teck",
    brideCn: "黄薪霓",
    brideEn: "Ng Sze Ni",
    introBody1: "您的到来，将让这份喜悦更加圆满。",
    introBody2: "期待与您共享这美好时刻。",
    scroll: "下滑",
    saveDate: "预留此日",
    date: "2026年9月19日",
    venue: "婚礼地点",
    venuePlace: "新山 · 北京楼柔佛再也 · 2号厅",
    programme: "婚礼流程",
    timeline: [
      { time: "18:00", ac: "签到合影"},
	  { time: "18:30", ac: "入席"},
      { time: "19:00", ac: "晚宴"},
      { time: "22:00", ac: "圆满结束"},
    ],
    punctual: "*敬请7时准时入席",
    dress: "着装要求",
    formal: "休闲正装",
    leaveWhite: "请把白色着装留给新娘",
    palette: "婚礼色调",
    redLabel: "红色",
    whiteLabel: "白色",
    rsvp: "敬请回复",
    rsvpBy: "请于2026年5月31日前回复",
    rsvpLead: "让我们知道您是否能出席我们的婚礼",
    attending: "您会参加吗？",
    yes: "我会出席",
    no: "很遗憾，我不能出席",
    adults: "成人数量",
    kids: "小孩数量",
    contact: "联络人",
	relationship: "宾客关系",
    relationshipPlaceholder: "请选择宾客关系",
    relationshipOptions: ["新郎朋友", "新郎亲戚", "新娘朋友", "新娘亲戚", "新郎父母朋友", "新娘父母朋友"],
    fullName: "名字",
    phone: "电话号码",
    dietary: "饮食要求",
    vegetarian: "素食",
    halal: "清真",
    allergy: "过敏史或备注",
    wishes: "新人祝语",
    wishesPlaceholder: "祝语",
    submit: "提交",
    submitting: "提交中...",
    success: "我们收到啦！",
    error: "提交失败，请再试一次。",
    footer: "期待 • 婚礼相见",
  },
  en: {
    musicPlay: "Play Music",
    musicStop: "Stop Music",
    thankYouTitle: "Thank You",
    thankYouBody: "We have received your RSVP and look forward to celebrating with you",
    thankYouBack: "Back to Invitation",
    thankYouAnother: "Submit Another",
    tapToContinue: "点击惊喜 . Tap to continue",
    opening: "打开中... Opening...",
    selectLanguage: "Select Language · 请选择语言",
    languageCn: "中文",
    languageEn: "English",
    introTop1: "We finally tied the knot!",
    groomEn: "吴佳得",
    groomCn: "Goh Jia Teck",
    brideEn: "黄薪霓",
    brideCn: "Ng Sze Ni",
    introBody1: "Your presence will make our joy complete",
    introBody2: "We hope you can join us on our special day",
    scroll: "Scroll",
    saveDate: "Save the Date",
    date: "19th September 2026",
    venue: "Venue",
    venuePlace: "Johor Bahru · Restaurant Pekin Johor Jaya · Hall 2",
    programme: "About Wedding",
    timeline: [
      { time: "18:00", ac: "Arrival"},
	  { time: "18:30", ac: "Be Seated"},
      { time: "19:00", ac: "Dinner"},
      { time: "22:00", ac: "End"},
    ],
    punctual: "*Dinner begins at 19:00",
    dress: "Dress Code",
    formal: "Smart Casual",
    leaveWhite: "Please leave the white to the bride",
    palette: "Wedding Palette",
    redLabel: "Red",
    whiteLabel: "White",
    rsvp: "RSVP",
    rsvpBy: "By 31st May 2026",
    rsvpLead: "Let us know if you can make it",
    attending: "Will you be attending?",
    yes: "I'll be there",
    no: "Unfortunately, I can't make it",
    adults: "How many adults?",
    kids: "How many kids?",
    contact: "Main contact",
	relationship: "Guest relationship",
    relationshipPlaceholder: "Please select relationship",
    relationshipOptions: ["Groom friend", "Groom relative", "Bride friend", "Bride relative", "Groom parent friend", "Bride parent friend"],
    fullName: "Full name",
    phone: "Phone Number",
    dietary: "Dietary",
    vegetarian: "Vegetarian",
    halal: "Halal",
    allergy: "Allergies or notes",
    wishes: "Wishes",
    wishesPlaceholder: "Your message",
    submit: "Submit RSVP",
    submitting: "Submitting...",
    success: "RSVP submitted successfully.",
    error: "Submission failed. Please try again.",
    footer: "Thank you for witnessing our special moment",
  },
};

export default function WeddingInvitationWebsite() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCurtainOpened, setIsCurtainOpened] = useState(false);
  const [isCurtainOpening, setIsCurtainOpening] = useState(false);
  const RSVP_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyDnquZD-s3X3z2SvXc0aV9DBy9ghTZGM97grzU0eJlNS1JxZzTGE_fGXmhWQnpJYjPGQ/exec";

  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guestRelationship, setGuestRelationship] = useState("");
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
  const [language, setLanguage] = useState<Language>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const t = language ? TEXT[language] : TEXT.cn;
  const fontFamily = language === "en"
    ? "'Playfair Display', serif"
    : "'Noto Serif SC', serif";

  const openInvitation = () => {
    if (isCurtainOpening || isCurtainOpened) return;

    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
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
    } catch {
      setIsMusicPlaying(false);
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
      alert(language === "en" ? "Please enter your name" : "请输入姓名");
      return;
    }
	if (!guestRelationship) {
    alert(language === "en" ? "Please select relationship" : "请选择宾客关系");
    return;
  }
   if (!phoneNumber.trim()) {
    alert(language === "en" ? "Please enter phone number" : "请输入电话号码");
    return;
  }
  if (!/^\d+$/.test(phoneNumber)) {
    alert(language === "en" ? "Phone number must be numeric only" : "电话号码只能输入数字");
    return;
  }
  
    if (!RSVP_WEB_APP_URL.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const payload = {
      submittedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace('T',' ').replace('Z',''),
      language: language || "cn",
      attendance: guestCount === "0" ? "No" : "Yes",
      guestName,
    phoneNumber: `'${phoneNumber}`,
	  guestRelationship,
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
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setSubmitStatus("success");
      setShowThankYouScreen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitStatus("error");
      alert(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!language) return;
    setShowConfetti(true);
    const timer = window.setTimeout(() => setShowConfetti(false), 3500);
    return () => window.clearTimeout(timer);
  }, [language]);

  const labelA = language === "en" ? "DAYS" : "天";
  const labelB = language === "en" ? "HOURS" : "时";
  const labelC = language === "en" ? "MIN" : "分";
  const labelD = language === "en" ? "SEC" : "秒";
  

  return (
    <div className="min-h-screen overflow-hidden bg-[#120707] text-[#f7ead7]">
      <audio ref={audioRef} src="/music.mp3" preload="auto" onEnded={() => setIsMusicPlaying(false)} />

      <button type="button" onClick={toggleMusic} className="fixed left-4 top-4 z-[100] flex items-center gap-3">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl animate-spin" style={{ animationDuration: isMusicPlaying ? "5s" : "10s" }}>
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#d4c4a8,#f5e6c8,#cbb89a,#f5e6c8,#d4c4a8)] border border-[#bfae90]" />
          <div className="absolute inset-1 rounded-full border border-[#bfae90] opacity-60" />
          <div className="absolute inset-2 rounded-full border border-[#bfae90] opacity-40" />
          <div className="absolute h-8 w-8 rounded-full bg-[#7a3727] flex items-center justify-center text-[8px] text-white font-serif tracking-wide">CD</div>
          <div className="absolute h-2 w-2 rounded-full bg-black" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_40%)]" />
        </div>
        <span className={`text-sm font-serif tracking-wide transition-opacity duration-500 ${isMusicPlaying ? "text-white opacity-100" : "text-white/70 opacity-60"}`}>
          {isMusicPlaying ? t.musicStop : t.musicPlay}
        </span>
      </button>

      <AnimatePresence mode="wait">
        {showThankYouScreen ? (
          <motion.section key="thank-you" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.6 }} className="flex min-h-screen items-center justify-center bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-16 text-[#7a3727]">
            <div className="w-full max-w-2xl rounded-[2rem] border border-[#e5d8cb] bg-white/90 p-10 text-center shadow-xl">
				<motion.div
			initial={{ rotate: 0, opacity: 0, scale: 0.9 }}
			animate={{ rotate: [0, 16, -10, 14, -6, 0], opacity: 1, scale: 1 }}
			transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 }}
			className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf7f3] text-3xl shadow-[0_8px_22px_rgba(122,55,39,0.10)]">
			👋
			</motion.div>
              <p className="text-lg" style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1.6", letterSpacing: "0.04em" }}>{t.thankYouTitle}</p>
              <p className="mt-6 text-base leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: "1.8", letterSpacing: "0.03em" }}>{t.thankYouBody}</p>
              {guestName && <p className="mt-6 text-xl" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.04em" }}>{language === "en" ? `${guestName}, see you there.` : `${guestName}，婚礼见。`}</p>}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button type="button" onClick={() => setShowThankYouScreen(false)} className="rounded-full border border-[#d7c6b7] px-6 py-3 text-[#7a3727]">{t.thankYouBack}</button>
                <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-[#7a3727] px-6 py-3 text-white">{t.thankYouAnother}</button>
              </div>
            </div>
          </motion.section>
        ) : !isCurtainOpened ? (
          <motion.section key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2b0606]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,230,0.18),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.03),rgba(0,0,0,0.45))]" />
            <motion.div initial={{ opacity: 0.18, scale: 0.96 }} animate={isCurtainOpening ? { opacity: 0.36, scale: 1.08 } : { opacity: 0.18, scale: 1 }} transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,236,214,0.24),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 overflow-hidden"><motion.div initial={false} animate={isCurtainOpening ? { x: "-115%", scaleX: 1.03 } : { x: 0, scaleX: 1 }} transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-y-0 left-0 w-full origin-left"><div className="absolute inset-0 bg-[linear-gradient(90deg,#5e0908_0%,#7d0f0d_7%,#9a1711_13%,#76100d_21%,#a01812_28%,#7b100d_36%,#9e1912_44%,#71100c_52%,#991710_60%,#6d0c0a_69%,#8d120f_78%,#6a0a08_89%,#4f0606_100%)]" /><div className="absolute inset-0 opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,244,228,0)_0px,rgba(255,244,228,0)_26px,rgba(255,231,214,0.68)_31px,rgba(255,231,214,0.14)_34px,rgba(0,0,0,0.16)_39px,rgba(255,244,228,0)_58px)]" /></motion.div></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 overflow-hidden"><motion.div initial={false} animate={isCurtainOpening ? { x: "115%", scaleX: 1.03 } : { x: 0, scaleX: 1 }} transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-y-0 right-0 w-full origin-right"><div className="absolute inset-0 bg-[linear-gradient(270deg,#5e0908_0%,#7d0f0d_7%,#9a1711_13%,#76100d_21%,#a01812_28%,#7b100d_36%,#9e1912_44%,#71100c_52%,#991710_60%,#6d0c0a_69%,#8d120f_78%,#6a0a08_89%,#4f0606_100%)]" /><div className="absolute inset-0 opacity-80 [background-image:repeating-linear-gradient(90deg,rgba(255,244,228,0)_0px,rgba(255,244,228,0)_26px,rgba(255,231,214,0.68)_31px,rgba(255,231,214,0.14)_34px,rgba(0,0,0,0.16)_39px,rgba(255,244,228,0)_58px)]" /></motion.div></div>
            <div className="relative z-20 flex flex-col items-center px-6 text-center text-white">
              <motion.button onClick={openInvitation} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} className="group flex flex-col items-center" type="button">
                <motion.div animate={{ scale: [1, 1.07, 1], opacity: [0.78, 1, 0.78] }} transition={{ duration: 2, repeat: Infinity }} className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-[2px] sm:h-24 sm:w-24">
                  <span className="absolute inset-0 rounded-full border border-white/15" />
                  <span className="absolute inset-3 rounded-full border border-white/15" />
                  <Hand className="h-7 w-7 text-white/80 sm:h-8 sm:w-8" strokeWidth={1.6} />
                </motion.div>
                <p className="mt-5 text-sm tracking-[0.18em] text-white/80 sm:text-base">{isCurtainOpening ? t.opening : t.tapToContinue}</p>
              </motion.button>
            </div>
          </motion.section>
        ) : !language ? (
          <motion.section key="language-select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen items-center justify-center bg-[#f5efe6] text-[#7a3727]">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-serif">{t.selectLanguage}</h2>
              <div className="flex gap-6 justify-center">
                <button onClick={() => setLanguage("cn")} className="px-8 py-4 rounded-xl border border-[#7a3727] hover:bg-[#7a3727] hover:text-white transition">{t.languageCn}</button>
                <button onClick={() => setLanguage("en")} className="px-8 py-4 rounded-xl border border-[#7a3727] hover:bg-[#7a3727] hover:text-white transition">{t.languageEn}</button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.main key="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] text-[#6d3122]">
            <section className="relative min-h-screen overflow-hidden bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px]">
              <div className="absolute inset-y-0 left-0 z-10 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] bg-[linear-gradient(90deg,#64100d_0%,#8c1712_18%,#73120e_36%,#971912_52%,#6d100d_70%,#8d1610_84%,#5a0c0a_100%)] opacity-95" />
              <div className="absolute inset-y-0 right-0 z-10 w-[13%] min-w-[54px] md:w-[16%] md:min-w-[90px] lg:w-[20%] lg:min-w-[140px] bg-[linear-gradient(270deg,#64100d_0%,#8c1712_18%,#73120e_36%,#971912_52%,#6d100d_70%,#8d1610_84%,#5a0c0a_100%)] opacity-95" />
			  {showConfetti && (
              <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
                {Array.from({ length: 36 }).map((_, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      y: -40,
                      x: `${(index * 37) % 100}vw`,
                      rotate: 0,
                      opacity: 0,
                    }}
                    animate={{
                      y: "110vh",
                      rotate: 360 + index * 18,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2.8 + (index % 5) * 0.25,
                      delay: (index % 12) * 0.08,
                      ease: "easeOut",
                    }}
                    className="absolute block h-3 w-1.5 rounded-sm"
                    style={{
                      backgroundColor: ["#8b2f22", "#c9a27a", "#f5efe6", "#ffffff", "#a55a45"][index % 5],
                      boxShadow: "0 0 8px rgba(201,162,122,0.28)",
                    }}
                  />
                ))}
              </div>
            )}
            
              <div className="relative z-30 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:px-10">
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="text-sm text-[#7a3727] sm:text-base md:text-lg" style={{ lineHeight: "1.6", letterSpacing: "0.08em", fontFamily: "'Noto Serif SC', serif" }}>
                  {t.introTop1}
                  <br />
                </motion.p>
				<motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-8 text-4xl text-[#7a3727] sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.08em", lineHeight: "1.1" }}>
                  {t.groomCn}
                  <br />
                  <span className="block mt-2 text-lg md:text-xl" style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.6", letterSpacing: "0.02em" }}>{t.groomEn}</span>
                  <span className="text-3xl md:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>&</span>
                  <br />
                  {t.brideCn}
                  <br />
                  <span className="block mt-2 text-lg md:text-xl" style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.6", letterSpacing: "0.02em" }}>{t.brideEn}</span>
                </motion.h1>

                <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="mt-10 max-w-3xl space-y-5 px-2 sm:px-4">
                  <p className="text-sm text-[#7a3727] sm:text-base md:text-lg" style={{ lineHeight: "1.7", letterSpacing: "0.06em", fontFamily: "'Noto Serif SC', serif" }}>
                    {t.introBody1}
                    <br />
                    {t.introBody2}
                  </p>
                </motion.div>

                <motion.div
                  onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="mt-14 flex flex-col items-center text-[#7a3727] sm:mt-16 cursor-pointer"
                >
                  <span className="text-xs uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.32em]" style={{ fontFamily: "'Playfair Display', serif" }}>{t.scroll}</span>
                  <span className="mt-3 text-4xl leading-none">↓</span>
                </motion.div>
              </div>
            </section>

              <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <div className="mx-auto max-w-4xl">
                <img src="/wedding.JPG" alt="Wedding-picture" className="w-full max-w-lg mx-auto rounded-[2rem] shadow-lg" />
				<br />
				<br />
                <h2 className="block mt-2 text-lg md:text-xl underline font-bold" style={{ fontFamily }}>
				{t.saveDate}
				</h2>
				<p className="block mt-6 text-2xl sm:text-3xl" style={{ fontFamily: language === "en" ? "'Playfair Display', serif" : "'Noto Serif SC', serif" }}>
				{t.date}
				</p>
                <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-12 w-full">
                  <div className="mx-auto max-w-[260px] text-[#5e3a31]">
                      <div className="border-y border-[#7a3727]/60 py-3 text-center">
                        <p className="text-[15px] tracking-[0.35em]" style={{ fontFamily }}>{language === "en" ? "September 2026" : "九月 2026"}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.12em] text-[#6f4a3f]">
                        {(language === "en"
                        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                        : ["一", "二", "三", "四", "五", "六", "日"]
                      ).map((day) => <span key={day}>{day}</span>)}
                      </div>
                      <div className="mt-3 grid grid-cols-7 items-center text-center text-lg">
                        {[14, 15, 16, 17, 18].map((date) => <span key={date} style={{ fontFamily }}>{date}</span>)}
                        <motion.div initial={{ scale: 0.9, opacity: 0.7 }} animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} className="mx-auto relative flex h-12 w-12 items-center justify-center">
                          <svg viewBox="0 0 40 36" className="absolute inset-0 h-full w-full overflow-visible" style={{ filter: "drop-shadow(0 0 4px rgba(155,107,91,0.18))" }}>
                            <path d="M20 33 C 18 31, 5 20, 5 11 C 5 5.8, 8.8 2.5, 13.4 2.5 C 16.4 2.5, 18.8 4, 20 6.4 C 21.2 4, 23.6 2.5, 26.6 2.5 C 31.2 2.5, 35 5.8, 35 11 C 35 20, 22 31, 20 33 Z" fill="none" stroke="#9b6b5b" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                          </svg>
                          <span className="relative z-10 text-[#7a3727] text-sm" style={{ fontFamily }}>19</span>
                        </motion.div>
                        <span style={{ fontFamily }}>20</span>
                      </div>
                    </div>
                </motion.div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-6">
                {[
                  [labelA, timeLeft.days],
                  [labelB, timeLeft.hours],
                  [labelC, timeLeft.minutes],
                  [labelD, timeLeft.seconds],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center text-xl text-[#7a3727]">{String(value).padStart(2, "0")}</div>
                    <div className="mt-2 text-center text-xs tracking-[0.2em] text-[#8a4a3a]">{label}</div>
                  </div>
                ))}
              </div>
            </section>
<div className="flex items-center justify-center gap-4 mb-12">
  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
  <span className="text-[#c9a27a] text-sm">✦</span>
  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
</div>
            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <h2 className="block mt-2 text-lg md:text-xl underline font-bold" style={{ fontFamily }}>{t.venue}</h2>
			  <br />
              <p className="block mt-2 text-lg md:text-xl" style={{ fontFamily }}>{t.venuePlace}</p>
              <div className="mt-10 overflow-hidden rounded-2xl border border-[#e5d8cb] shadow-sm">
                <iframe src="https://www.google.com/maps?q=Restaurant+Pekin+Johor+Jaya&output=embed" width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
              </div>
              <div className="mt-6 flex flex-col items-center gap-3">
                <a href="https://share.google/9RL9lEQIqXmD6aTnx" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-[#e5d8cb] hover:shadow-lg transition"><img src="/google-maps.png" alt="Google Maps" className="w-8 h-8" /><span className="text-[#7a3727] font-serif text-base" style={{ fontFamily }}>Google</span></a>
                <a href="https://ul.waze.com/ul?place=ChIJr1npfG9s2jERhBLU6DKztWI&ll=1.52385010%2C103.80705860&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#e8f4f8] shadow-md border border-[#d6e6ee] hover:shadow-lg transition"><img src="/waze.png" alt="Waze" className="w-8 h-8" /><span className="text-[#5a7d8a] font-serif text-base" style={{ fontFamily }}>Waze</span></a>
              </div>
            </section>
<div className="flex items-center justify-center gap-4 mb-12">
  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
  <span className="text-[#c9a27a] text-sm">✦</span>
  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
</div>
            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center">
              <h2 className="block mt-2 text-lg md:text-xl underline font-bold" style={{ fontFamily }}>{t.programme}</h2>
			  <br />
              <div className="block mt-2 text-lg md:text-xl items-center gap-6 text-[#7a3727]">
                {t.timeline.map((item, idx) => (
                  <div key={item.time} className="text-center" >
                    <p className="block mt-2 text-lg md:text-xl" style={{ fontFamily }}>{item.time}</p>
                    <p className="block mt-2 text-lg md:text-xl" style={{ fontFamily }}>{item.ac}</p>
                    {idx < t.timeline.length - 1 && <div className="text-2xl mt-4">|</div>}
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <p className="block mt-2 text-lg md:text-xl" style={{ fontFamily }}>{t.punctual}</p>
              </div>
            </section>
			<div className="flex items-center justify-center gap-4 mb-12">
  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
  <span className="text-[#c9a27a] text-sm">✦</span>
  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
</div>
            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 text-center style={{ fontFamily }}">
              <h2 className="block mt-2 text-lg md:text-xl underline font-bold" style={{ fontFamily }}>{t.dress}</h2>
              <div className="mt-10 flex justify-center"><img src="/formal.png" alt="Dress Code" className="max-w-md w-full" /></div>
			  <br />
              <p className="block mt-2 text-lg md:text-xl">{t.formal}</p>
              <p className="mt-2 text-sm text-[#7a3727] style={{ fontFamily }}">{t.leaveWhite}<br /></p>
              <br />
              <p className="block mt-2 text-lg md:text-xl">{t.palette}</p>
              <div className="mt-8 flex justify-center gap-10">
                <div className="flex flex-col items-center"><div className="h-5 w-5 rounded-full border-2 border-[#4a0d0d] bg-[#b30000] shadow-inner" /><p className="mt-2 text-sm text-[#7a3727] style={{ fontFamily }}">{t.redLabel}</p></div>
                <div className="flex flex-col items-center"><div className="h-5 w-5 rounded-full border-2 border-[#333] bg-[#ffffff] shadow-inner" /><p className="mt-2 text-sm text-[#7a3727] style={{ fontFamily }}">{t.whiteLabel}</p></div>
              </div>
            </section>
			<div className="flex items-center justify-center gap-4 mb-12">
			  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
			  <span className="text-[#c9a27a] text-sm">✦</span>
			  <div className="w-16 h-[1px] bg-[#d7c6b7]" />
			</div>
            <section className="bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-24 style={{ fontFamily }}">
              <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#e5d8cb] bg-white/80 p-8 shadow-sm md:p-10">
                <div className="text-center">
                  <h2 className="block mt-2 text-lg md:text-xl underline font-bold">{t.rsvp}</h2>
                  <p className="block mt-2 text-lg md:text-xl">{t.rsvpBy}</p>
                  <p className="block mt-2 text-lg md:text-xl">{t.rsvpLead}</p>
                </div>

                <form className="mt-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <p className="block mt-2 text-lg md:text-xl">{t.attending}</p>
                    <div className="mt-5 space-y-4 text-[#6d3122]">
                      <label className="flex items-center gap-3 text-base"><input type="radio" name="attendance" value="yes" checked={guestCount !== "0"} onChange={() => setGuestCount("1")} className="h-4 w-4 accent-[#a37b3a]" /><span>{t.yes}</span></label>
                      <label className="flex items-center gap-3 text-base"><input type="radio" name="attendance" value="no" checked={guestCount === "0"} onChange={() => setGuestCount("0")} className="h-4 w-4 accent-[#a37b3a]" /><span>{t.no}</span></label>
                    </div>
                  </div>

                  {guestCount !== "0" ? (
                    <>
                      <div className="grid gap-8 md:grid-cols-2">
                        <div>
                          <p className="block mt-2 text-lg md:text-xl">{t.adults}</p>
                          <div className="mt-4 flex items-center gap-5"><button type="button" onClick={() => setGuestCount((prev) => String(Math.max(1, Number(prev || 1) - 1)))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">−</button><span className="min-w-8 text-center text-lg text-[#6d3122]">{guestCount}</span><button type="button" onClick={() => setGuestCount((prev) => String(Number(prev || 1) + 1))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">+</button></div>
                        </div>
                        <div>
                          <p className="block mt-2 text-lg md:text-xl">{t.kids}</p>
                          <div className="mt-4 flex items-center gap-5"><button type="button" onClick={() => setKidsCount((prev) => String(Math.max(0, Number(prev || 0) - 1)))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">−</button><span className="min-w-8 text-center text-lg text-[#6d3122]">{kidsCount}</span><button type="button" onClick={() => setKidsCount((prev) => String(Number(prev || 0) + 1))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5d8cb] bg-[#faf7f3] text-xl text-[#8a6c4e]">+</button></div>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] bg-[#faf7f3] p-5">
                        <p className="block mt-2 text-lg md:text-xl">{t.contact}</p>
                        <div className="mt-4 space-y-4">
                          <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t.fullName} className="w-full rounded-xl border border-[#eadfd4] bg-white px-5 py-4 text-[#6d3122] outline-none" />
                          <input value={phoneNumber}onChange={(e) => {const value = e.target.value.replace(/[^0-9]/g, ""); setPhoneNumber(value);}} inputMode="numeric" pattern="[0-9]*" placeholder={t.phone} className="w-full rounded-xl border border-[#eadfd4] bg-white px-5 py-4 text-[#6d3122] outline-none" />
						<p className="block mt-2 text-lg md:text-xl">{t.relationship}</p>
						  <select
                          value={guestRelationship}
                          onChange={(e) => setGuestRelationship(e.target.value)}
                          className="w-full rounded-xl border border-[#eadfd4] bg-white px-5 py-4 text-[#6d3122] outline-none"
                        >
                          <option value="">{t.relationshipPlaceholder}</option>
                          {t.relationshipOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        </div>
                      </div>
					  
					  

                      <div>
                        <p className="block mt-2 text-lg md:text-xl">{t.dietary}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setIsVegetarian((prev) => !prev)} className={`rounded-full border px-5 py-2 text-sm ${isVegetarian ? "bg-[#7a3727] text-white" : "bg-white"}`}>{t.vegetarian}</button>
                          <button type="button" onClick={() => setIsHalal((prev) => !prev)} className={`rounded-full border px-5 py-2 text-sm ${isHalal ? "bg-[#7a3727] text-white" : "bg-white"}`}>{t.halal}</button>
                        </div>
                        <textarea value={allergyNotes} onChange={(e) => setAllergyNotes(e.target.value)} placeholder={t.allergy} className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                      </div>

                      <div>
                        <p className="block mt-2 text-lg md:text-xl">{t.wishes}</p>
                        <textarea value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} placeholder={t.wishesPlaceholder} className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4" />
                      </div>
                    </>
                  ) : (
				  <div className="space-y-6">
                      <div className="rounded-[1.5rem] bg-[#faf7f3] p-5">
                        <p className="text-xl font-serif text-[#6d3122]">{t.fullName}</p>
                        <input
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder={t.fullName}
                          className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-white px-5 py-4 text-[#6d3122] outline-none"
                        />
                      </div>

                      <div>
					  <div className="rounded-[1.5rem] bg-[#faf7f3] p-5">
                        <p className="text-xl font-serif text-[#6d3122]">{t.wishes}</p>
                        <textarea
                          value={guestMessage}
                          onChange={(e) => setGuestMessage(e.target.value)}
                          placeholder={t.wishesPlaceholder}
                          className="mt-4 w-full rounded-xl border border-[#eadfd4] bg-[#faf7f3] px-5 py-4"
                        />
                      </div>
					  </div>
                    </div>
                  )}

                  <button type="button" onClick={handleSubmitRSVP} disabled={isSubmitting} className="w-full rounded-2xl bg-[#7a3727] px-6 py-4 text-white uppercase disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? t.submitting : t.submit}</button>
                  {submitStatus === "success" && <p className="text-center text-sm text-green-700">{t.success}</p>}
                  {submitStatus === "error" && <p className="text-center text-sm text-red-700">{t.error}</p>}
                </form>
              </div>
            </section>

            <section className="border-t border-[#e5d8cb] bg-[#f5efe6] bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px] px-6 py-10 text-center ">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a4a3a] sm:tracking-[0.42em] style={{ fontFamily }}">{t.footer}</p>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

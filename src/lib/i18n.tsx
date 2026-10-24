import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ja";

const dict = {
  dashboard: { en: "Dashboard", ja: "ダッシュボード" },
  advisors: { en: "Tax & Compliance", ja: "税務・法務" },
  jv: { en: "Joint Ventures", ja: "合弁事業" },
  distributors: { en: "Find Distributors", ja: "販売代理店" },
  tutors: { en: "Language Training", ja: "語学研修" },
  surveys: { en: "Dealer Surveys", ja: "販売店調査" },
  consultations: { en: "My Consultations", ja: "相談予約" },
  connections: { en: "Connections", ja: "つながり" },
  profile: { en: "Profile", ja: "プロフィール" },
  signIn: { en: "Sign in", ja: "ログイン" },
  signOut: { en: "Sign out", ja: "ログアウト" },
  getStarted: { en: "Get started", ja: "はじめる" },
  heroTitle: { en: "Your bridge from Nippon to India.", ja: "日本からインドへの架け橋。" },
  heroSub: {
    en: "A JETRO-backed platform helping Japanese SMEs enter India — with trusted advisors, partners, distributors, language training and on-ground market insight.",
    ja: "JETROが支援する、日本の中小企業のインド進出プラットフォーム。専門家、パートナー、販売代理店、語学研修、現地の市場調査をひとつに。",
  },
  advisorsDesc: { en: "Connect with Chartered Accountants and Company Secretaries for GST, tax and incorporation.", ja: "GST・税務・会社設立のため、公認会計士やカンパニーセクレタリーとつながる。" },
  jvDesc: { en: "Find a partner like Maruti × Suzuki. Post or browse joint venture proposals.", ja: "マルチ×スズキのようなパートナーを。合弁案件を掲載・検索。" },
  distDesc: { en: "Tell us your product — see where it sells best, then meet distributors in that state.", ja: "製品を選ぶと人気の州と、その州の販売代理店がわかります。" },
  tutorsDesc: { en: "Japanese and Hindi tutors to train your teams in both languages.", ja: "社員研修のための日本語・ヒンディー語講師。" },
  surveysDesc: { en: "Paid questionnaires answered by local dealers and vendors — real field insight.", ja: "現地の販売店・業者が回答する有償アンケートで現場の声を。" },
  consultationsDesc: { en: "Track pending and confirmed consultations with compliance experts.", ja: "専門家との相談予約の状況を確認。" },
} as const;

export type TKey = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("n2j-lang");
    if (saved === "ja" || saved === "en") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("n2j-lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);

export function LangToggle() {
  const { lang, setLang } = useT();
  return (
    <div className="inline-flex rounded-md border border-border p-0.5 text-xs">
      {(["en", "ja"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded px-2 py-1 transition-colors ${lang === l ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {l === "en" ? "EN" : "日本語"}
        </button>
      ))}
    </div>
  );
}

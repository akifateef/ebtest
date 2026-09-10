import type { LanguageCode } from "./languages";

// The 300 general questions are tagged in the source data with one of these
// 10 official BAMF topic names (in German). State-specific questions are
// tagged with the German Bundesland name instead, which is already shown
// untranslated elsewhere in the app (e.g. in the state picker), so those are
// intentionally not included here — getCategoryLabel() falls back to the
// raw value for anything not in this table.
type GeneralCategory =
  | "Politik"
  | "Recht"
  | "Staat"
  | "Geschichte"
  | "Wirtschaft"
  | "Bildung und Arbeit"
  | "Gesellschaft und Familie"
  | "Europa und Welt"
  | "Bund und Länder"
  | "Religion und Kultur";

const GENERAL_CATEGORY_LABELS: Record<
  LanguageCode,
  Record<GeneralCategory, string>
> = {
  de: {
    Politik: "Politik",
    Recht: "Recht",
    Staat: "Staat",
    Geschichte: "Geschichte",
    Wirtschaft: "Wirtschaft",
    "Bildung und Arbeit": "Bildung und Arbeit",
    "Gesellschaft und Familie": "Gesellschaft und Familie",
    "Europa und Welt": "Europa und Welt",
    "Bund und Länder": "Bund und Länder",
    "Religion und Kultur": "Religion und Kultur",
  },
  en: {
    Politik: "Politics",
    Recht: "Law",
    Staat: "State",
    Geschichte: "History",
    Wirtschaft: "Economy",
    "Bildung und Arbeit": "Education and Work",
    "Gesellschaft und Familie": "Society and Family",
    "Europa und Welt": "Europe and the World",
    "Bund und Länder": "Federal State and Länder",
    "Religion und Kultur": "Religion and Culture",
  },
  tr: {
    Politik: "Siyaset",
    Recht: "Hukuk",
    Staat: "Devlet",
    Geschichte: "Tarih",
    Wirtschaft: "Ekonomi",
    "Bildung und Arbeit": "Eğitim ve Çalışma",
    "Gesellschaft und Familie": "Toplum ve Aile",
    "Europa und Welt": "Avrupa ve Dünya",
    "Bund und Länder": "Federal Devlet ve Eyaletler",
    "Religion und Kultur": "Din ve Kültür",
  },
  ar: {
    Politik: "السياسة",
    Recht: "القانون",
    Staat: "الدولة",
    Geschichte: "التاريخ",
    Wirtschaft: "الاقتصاد",
    "Bildung und Arbeit": "التعليم والعمل",
    "Gesellschaft und Familie": "المجتمع والأسرة",
    "Europa und Welt": "أوروبا والعالم",
    "Bund und Länder": "الدولة الاتحادية والولايات",
    "Religion und Kultur": "الدين والثقافة",
  },
  ru: {
    Politik: "Политика",
    Recht: "Право",
    Staat: "Государство",
    Geschichte: "История",
    Wirtschaft: "Экономика",
    "Bildung und Arbeit": "Образование и труд",
    "Gesellschaft und Familie": "Общество и семья",
    "Europa und Welt": "Европа и мир",
    "Bund und Länder": "Федеративное государство и земли",
    "Religion und Kultur": "Религия и культура",
  },
  uk: {
    Politik: "Політика",
    Recht: "Право",
    Staat: "Держава",
    Geschichte: "Історія",
    Wirtschaft: "Економіка",
    "Bildung und Arbeit": "Освіта та праця",
    "Gesellschaft und Familie": "Суспільство та сім'я",
    "Europa und Welt": "Європа та світ",
    "Bund und Länder": "Федеративна держава та землі",
    "Religion und Kultur": "Релігія та культура",
  },
  pl: {
    Politik: "Polityka",
    Recht: "Prawo",
    Staat: "Państwo",
    Geschichte: "Historia",
    Wirtschaft: "Gospodarka",
    "Bildung und Arbeit": "Edukacja i praca",
    "Gesellschaft und Familie": "Społeczeństwo i rodzina",
    "Europa und Welt": "Europa i świat",
    "Bund und Länder": "Państwo federalne i landy",
    "Religion und Kultur": "Religia i kultura",
  },
  fr: {
    Politik: "Politique",
    Recht: "Droit",
    Staat: "État",
    Geschichte: "Histoire",
    Wirtschaft: "Économie",
    "Bildung und Arbeit": "Éducation et travail",
    "Gesellschaft und Familie": "Société et famille",
    "Europa und Welt": "Europe et monde",
    "Bund und Länder": "État fédéral et Länder",
    "Religion und Kultur": "Religion et culture",
  },
  es: {
    Politik: "Política",
    Recht: "Derecho",
    Staat: "Estado",
    Geschichte: "Historia",
    Wirtschaft: "Economía",
    "Bildung und Arbeit": "Educación y trabajo",
    "Gesellschaft und Familie": "Sociedad y familia",
    "Europa und Welt": "Europa y el mundo",
    "Bund und Länder": "Estado federal y estados federados",
    "Religion und Kultur": "Religión y cultura",
  },
  it: {
    Politik: "Politica",
    Recht: "Diritto",
    Staat: "Stato",
    Geschichte: "Storia",
    Wirtschaft: "Economia",
    "Bildung und Arbeit": "Istruzione e lavoro",
    "Gesellschaft und Familie": "Società e famiglia",
    "Europa und Welt": "Europa e mondo",
    "Bund und Länder": "Stato federale e Länder",
    "Religion und Kultur": "Religione e cultura",
  },
  zh: {
    Politik: "政治",
    Recht: "法律",
    Staat: "国家",
    Geschichte: "历史",
    Wirtschaft: "经济",
    "Bildung und Arbeit": "教育与工作",
    "Gesellschaft und Familie": "社会与家庭",
    "Europa und Welt": "欧洲与世界",
    "Bund und Länder": "联邦国家与联邦州",
    "Religion und Kultur": "宗教与文化",
  },
  ja: {
    Politik: "政治",
    Recht: "法律",
    Staat: "国家",
    Geschichte: "歴史",
    Wirtschaft: "経済",
    "Bildung und Arbeit": "教育と労働",
    "Gesellschaft und Familie": "社会と家族",
    "Europa und Welt": "ヨーロッパと世界",
    "Bund und Länder": "連邦国家と州",
    "Religion und Kultur": "宗教と文化",
  },
  ur: {
    Politik: "سیاست",
    Recht: "قانون",
    Staat: "ریاست",
    Geschichte: "تاریخ",
    Wirtschaft: "معیشت",
    "Bildung und Arbeit": "تعلیم اور روزگار",
    "Gesellschaft und Familie": "معاشرہ اور خاندان",
    "Europa und Welt": "یورپ اور دنیا",
    "Bund und Länder": "وفاقی ریاست اور صوبے",
    "Religion und Kultur": "مذہب اور ثقافت",
  },
};

function isGeneralCategory(value: string): value is GeneralCategory {
  return value in GENERAL_CATEGORY_LABELS.de;
}

/**
 * Returns a localized label for a question's category.
 *
 * General-question topics are translated via the lookup table above.
 * State-specific questions are tagged with the (untranslated) German
 * Bundesland name, which is returned as-is, matching how state names are
 * displayed elsewhere in the app.
 */
export function getCategoryLabel(
  category: string | null,
  language: LanguageCode
): string | null {
  if (!category) return null;
  if (isGeneralCategory(category)) {
    return GENERAL_CATEGORY_LABELS[language][category];
  }
  return category;
}

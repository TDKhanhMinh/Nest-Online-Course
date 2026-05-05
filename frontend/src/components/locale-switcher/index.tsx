"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

const localeLabels: Record<string, string> = {
  vi: "🇻🇳 Tiếng Việt",
  en: "🇬🇧 English",
};

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "vi" | "en" });
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <Globe size={16} className="text-muted-foreground" />
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-transparent border border-border rounded-lg px-3 py-2 pr-8 text-sm font-medium cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        aria-label={t("label")}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}

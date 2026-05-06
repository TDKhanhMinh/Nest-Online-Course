"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: "en" | "vi") => {
    // Replace the current route with the new locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            aria-label="Switch language"
          >
            <Languages className="h-5 w-5" />
            <span className="sr-only">Switch language</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => switchLanguage("vi")}
          className={`cursor-pointer ${locale === "vi" ? "bg-brand-bg2 font-bold" : ""}`}
        >
          Tiếng Việt
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage("en")}
          className={`cursor-pointer ${locale === "en" ? "bg-brand-bg2 font-bold" : ""}`}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

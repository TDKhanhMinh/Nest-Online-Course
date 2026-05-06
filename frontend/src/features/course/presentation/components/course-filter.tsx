import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-sora text-[15px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

export function CourseFilter() {
  const t = useTranslations("CourseCatalog.filters");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category");

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const categories = [
    { id: "programming", label: "Programming", value: "Frontend" },
    { id: "design", label: "Design", value: "Design" },
    { id: "marketing", label: "Marketing", value: "Marketing" },
    { id: "business", label: "Business", value: "Business" },
    { id: "data", label: "Data & AI", value: "AI & Data Science" },
    { id: "security", label: "Cybersecurity", value: "Cybersecurity" },
  ];

  const levels = [
    { id: "beginner", label: t("level_options.beginner"), value: "beginner" },
    { id: "intermediate", label: t("level_options.intermediate"), value: "intermediate" },
    { id: "advanced", label: t("level_options.advanced"), value: "advanced" },
  ];

  return (
    <div className="space-y-8">
      {/* Categories */}
      <FilterSection title={t("categories")}>
        {categories.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <Checkbox 
              id={item.id} 
              checked={activeCategory === item.value}
              onCheckedChange={() => handleFilterChange("category", item.value)}
              className="border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black" 
            />
            <Label
              htmlFor={item.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              {item.label}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Levels */}
      <FilterSection title={t("levels")}>
        {levels.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <Checkbox 
              id={item.id} 
              checked={searchParams.get("level") === item.value}
              onCheckedChange={() => handleFilterChange("level", item.value)}
              className="border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black" 
            />
            <Label
              htmlFor={item.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              {item.label}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Price - Mocked for UI */}
      <FilterSection title={t("price")}>
        {["free", "paid"].map((p) => (
          <div key={p} className="flex items-center space-x-3">
            <Checkbox id={p} className="border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black" />
            <Label
              htmlFor={p}
              className="text-sm font-medium leading-none cursor-pointer text-slate-700 dark:text-slate-300 capitalize"
            >
              {t(`price_options.${p}`)}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Ratings - Mocked for UI */}
      <FilterSection title={t("ratings")}>
        {[4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-3">
            <Checkbox id={`rating-${rating}`} className="border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black" />
            <Label
              htmlFor={`rating-${rating}`}
              className="flex items-center gap-1.5 text-sm font-medium leading-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill={i < rating ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs">{rating} {t("rating_up")}</span>
            </Label>
          </div>
        ))}
      </FilterSection>
    </div>
  );
}

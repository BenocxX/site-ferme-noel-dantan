import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useI18nPersistence } from "@/lib/hooks/useI18nPersistence";

const languages = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { changeLanguage, currentLanguage } = useI18nPersistence();

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage}>
      <SelectTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "w-max border-none",
          className
        )}
        hideChevron
      >
        <Languages size="20px" />
      </SelectTrigger>
      <SelectContent className="!w-16">
        {languages.map(({ value, label }) => (
          <SelectItem
            value={value}
            key={value}
            onClick={() => changeLanguage(value)}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

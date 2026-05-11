import React from "react";
import { cn } from "../lib/utils";

export interface TypographyProps {
  children: React.ReactNode;
  variant?:
  | "display-3xl"
  | "display-2xl"
  | "display-xl"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body-xl"
  | "body-lg"
  | "body-sm"
  | "caption"
  | "overline";
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles = {
  // Display - Hero (largest, clear hierarchy)
  // Mobile → Small → Medium → Desktop
  "display-3xl": "text-[30px] sm:text-[35px] md:text-[40px] lg:text-[65px] font-bold",
  "display-2xl": "text-[28px] sm:text-[32px] md:text-[35px] lg:text-[38px] font-bold",
  "display-xl": "text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-bold",

  // Headings (clear size differences - each level smaller)
  h1: "text-[22px] sm:text-[23px] md:text-[24px] lg:text-[25px] font-semibold",
  h2: "text-[20px] sm:text-[21px] md:text-[22px] lg:text-[25px] font-semibold",
  h3: "text-[18px] sm:text-[19px] md:text-[19px] lg:text-[20px] font-medium",
  h4: "text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-medium",

  // Body Text (clear hierarchy - distinct from headings)
  "body-xl": "text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal",
  "body-lg": "text-[14px] sm:text-[14px] md:text-[15px] lg:text-[15px] font-normal",
  "body-sm": "text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-normal",

  // Special (smallest)
  caption: "text-[11px] sm:text-[11px] md:text-[12px] lg:text-[12px] font-medium uppercase tracking-wider",
  overline: "text-[10px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-semibold uppercase tracking-widest",
};

const defaultFontFamily = {
  "display-3xl": "font-robotoSlab",
  "display-2xl": "font-robotoSlab",
  "display-xl": "font-robotoSlab",
  h1: "font-robotoSlab",
  h2: "font-robotoSlab",
  h3: "font-robotoSlab",
  h4: "font-robotoSlab",
  "body-xl": "font-robotoSlab",
  "body-lg": "font-robotoSlab",
  "body-sm": "font-robotoSlab",
  caption: "font-robotoSlab",
  overline: "font-robotoSlab",
};

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body-lg",
  className,
  style,
}) => {
  const baseStyles = "text-black";
  const variantClass = variantStyles[variant];

  // Check if className contains a font class override
  const hasFontOverride = className?.includes("font-robotoSlab");

  // Check if className contains a font weight override
  const hasFontWeightOverride = className?.includes("font-thin") ||
    className?.includes("font-extralight") ||
    className?.includes("font-light") ||
    className?.includes("font-normal") ||
    className?.includes("font-medium") ||
    className?.includes("font-semibold") ||
    className?.includes("font-bold") ||
    className?.includes("font-extrabold") ||
    className?.includes("font-black");

  // Remove font weight from variantClass if override is present in className
  let finalVariantClass = variantClass;
  if (hasFontWeightOverride && variantClass) {
    // Remove any font weight classes from variantClass (but keep font family classes)
    const fontFamilyClasses = ['font-robotoSlab'];
    finalVariantClass = variantClass
      .split(/\s+/)
      .filter(cls => {
        // Keep font family classes
        if (fontFamilyClasses.includes(cls)) return true;
        // Remove font weight classes (font-thin, font-light, font-normal, etc.)
        if (cls.startsWith('font-') && !fontFamilyClasses.includes(cls)) return false;
        // Keep everything else
        return true;
      })
      .join(' ')
      .trim();
  }

  const fontFamilyClass = hasFontOverride ? "" : defaultFontFamily[variant];

  const getTag = () => {
    if (variant === "display-3xl" || variant === "display-2xl" || variant === "display-xl" || variant === "h1" || variant === "h2" || variant === "h3" || variant === "h4") {
      return variant === "display-3xl" || variant === "display-2xl" || variant === "display-xl" ? "h1" : variant;
    }
    return variant === "caption" || variant === "overline" ? "span" : "p";
  };

  const elementProps: any = {
    className: cn(baseStyles, finalVariantClass, fontFamilyClass, className),
  };

  // Merge style prop
  if (style || className?.includes('normal-case')) {
    elementProps.style = {
      ...style,
      ...(className?.includes('normal-case') && { textTransform: 'none' }),
    };
  }

  return React.createElement(
    getTag(),
    elementProps,
    children
  );
};

export default Typography;

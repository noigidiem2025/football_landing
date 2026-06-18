"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/i18n/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="font-display text-6xl font-extrabold text-pitch">404</span>
      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{t("notFound.desc")}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-pitch px-6 py-2.5 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
      >
        {t("common.backHome")}
      </Link>
    </Container>
  );
}

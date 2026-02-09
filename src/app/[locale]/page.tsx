import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
          {t("welcome")}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          {tCommon("appName")} — {t("title")}
        </p>
      </main>
    </div>
  );
}

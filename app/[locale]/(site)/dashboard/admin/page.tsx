import { redirect } from "next/navigation";

/** The administrator space moved to the dedicated internal backoffice. */
export default async function LegacyAdminRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin`);
}

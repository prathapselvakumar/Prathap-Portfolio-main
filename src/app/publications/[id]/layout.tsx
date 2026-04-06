import { publications } from "@/lib/publications";

export async function generateStaticParams() {
  return publications.map((pub) => ({
    id: String(pub.id),
  }));
}

export default function PublicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

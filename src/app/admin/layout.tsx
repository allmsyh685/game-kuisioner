import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - GameFix2025",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: 'light' }}>
      {children}
    </section>
  );
}



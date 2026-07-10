import Navbar from "@/_component/Navbar/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-full">
      <Navbar />
      <main className="w-full">{children}</main>
    </section>
  );
}

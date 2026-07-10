import Navbar from "@/_component/Navbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className=" min-h-screen min-w-screen bg-gray-200">
      <Navbar />
      {children}
    </section>
  );
}

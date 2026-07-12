import About from "@/_component/About/About";
import Hero from "@/_component/Hero/Hero";
import Skills from "@/_component/Skills/Skills";

export default function Home() {
  return (
    <div className="w-full">
      <Hero id="hero" />
      <About id="about" />
      <Skills id="skills" />
    </div>
  );
}

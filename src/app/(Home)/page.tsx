import About from "@/_components/About/About";
import Contact from "@/_components/Contact/Contact";
import Hero from "@/_components/Hero/Hero";
import Projects from "@/_components/Projects/Projects";
import Skills from "@/_components/Skills/Skills";

export default function Home() {
  return (
    <div className="w-full">
      <Hero id="hero" />
      <About id="about" />
      <Skills id="skills" />
      <Projects id="projects" />
      <Contact id="contact" />
    </div>
  );
}

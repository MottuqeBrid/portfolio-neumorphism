import About from "@/_component/About/About";
import Contact from "@/_component/Contact/Contact";
import Hero from "@/_component/Hero/Hero";
import Projects from "@/_component/Projects/Projects";
import Skills from "@/_component/Skills/Skills";

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

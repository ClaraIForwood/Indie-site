import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <div aria-hidden="true" style={{ height: "64px" }} />
      <Projects />
      <Footer />
    </>
  );
}

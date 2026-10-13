import { Header } from "@/components/Header";
import { FilmHero } from "@/components/FilmHero";
import { Manifesto, Menu, Craft, Story, Visit, Booking, Footer } from "@/components/Sections";
import { Effects } from "@/components/Effects";

export default function Page() {
  return (
    <>
      <Effects />
      <Header />
      <main>
        <FilmHero />
        <Manifesto />
        <Menu />
        <Craft />
        <Story />
        <Visit />
        <Booking />
      </main>
      <Footer />
    </>
  );
}

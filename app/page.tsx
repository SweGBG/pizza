import { Header } from "@/components/Header";
import { FilmHero } from "@/components/FilmHero";
import { Manifesto, Menu, Craft, Story, Visit, Booking, Footer } from "@/components/Sections";
import { Effects } from "@/components/Effects";
import { CrintroLoader } from "@/components/CrintroLoader";

export default function Page() {
  return (
    <>
      <CrintroLoader />
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

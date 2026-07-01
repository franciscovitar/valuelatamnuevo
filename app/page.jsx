import {
  AIProcesses,
  BackgroundCanvas,
  Contact,
  CoverStory,
  Financing,
  Footer,
  Header,
  Intro,
  Liquidity,
  Metrics,
  Payments,
  Process,
  Regulation,
  Solutions,
  SoundToggle,
  Team,
  ValueLatamRuntime,
  WhyUs,
  WorkWithUs,
} from '@/components/value-latam';

export default function Home() {
  return (
    <>
      <BackgroundCanvas />
      <Header />
      <main>
        <CoverStory />
        <Intro />
        <Metrics />
        <Solutions />
        <Financing />
        <Liquidity />
        <Payments />
        <AIProcesses />
        <Process />
        <WhyUs />
        <Regulation />
        <Team />
        <WorkWithUs />
        <Contact />
      </main>
      <Footer />
      <SoundToggle />
      <ValueLatamRuntime />
    </>
  );
}

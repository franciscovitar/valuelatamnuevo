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
  PartnerLogos,
  Payments,
  Process,
  Regulation,
  Solutions,
  SoundToggle,
  StructuredData,
  Team,
  ValueLatamRuntime,
  WhyUs,
  WorkWithUs,
} from '@/components/value-latam';

export default function Home() {
  return (
    <>
      <StructuredData />
      <BackgroundCanvas />
      <Header />
      <main>
        <CoverStory />
        <Intro />
        <Metrics />
        <PartnerLogos />
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

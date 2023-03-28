import Navbar from '@/components/Navbar';
import History from '@/components/History';

export const metadata = {
  title: 'Historique',
};

export default function Page() {
  return (
    <>
      <Navbar />
      <section className="container py-32">
        <History />
      </section>
    </>
  );
}

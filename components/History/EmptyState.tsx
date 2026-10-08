import Link from 'next/link';
import Button from '@/components/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full bg-red-500/30 p-2 text-red-200 ring-4 ring-red-500/20">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Aucun film visionné</h1>
        <p className="text-sm text-neutral-300">
          Il est l&apos;heure d&apos;aller regarder un film et de remplir cette liste !
        </p>
      </div>
      <Button render={<Link href="/" />}>Retourner vers l&apos;accueil</Button>
    </div>
  );
}

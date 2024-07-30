import { TreePine } from 'lucide-react';

import { Link, createLazyFileRoute } from '@tanstack/react-router';

import FermeHiver from '@/assets/images/ferme-hiver.jpg';

import { SnowFaller } from '@/components/custom/snow-faller';
import { buttonVariants } from '@/components/ui/button';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <section className="flex h-72 w-full items-center justify-center bg-primary">
        Seciton 2
      </section>
      <section className="flex h-[80vh] w-full items-center justify-center">Seciton 2</section>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden md:h-[80vh] lg:h-[90vh]">
      <img
        src={FermeHiver}
        alt="Ferme hiver"
        className="h-full w-full object-cover object-[80%_0%] blur-[2px] lg:object-[50%_20%]"
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full blur-[1px]">
        <SnowFaller />
      </div>
      <div className="absolute left-0 top-0 flex h-full w-full bg-black opacity-30"></div>
      <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center px-24 text-center text-white">
        <h1 className="h-max w-[368px] text-6xl md:text-6xl lg:text-7xl">
          Cueillez
          <br />
          votre sapin
          <br /> vous-même
        </h1>
        <h4 className="mb-8 mt-4 text-wrap text-xl md:text-2xl">
          Venez choisir et couper votre sapin de Noël!
        </h4>
        <Link
          to="/reservation"
          className={buttonVariants({ size: 'lg', className: 'h-max gap-4 px-6 py-4 !text-lg' })}
        >
          Réserver un sapin
          <TreePine />
        </Link>
      </div>
    </section>
  );
}

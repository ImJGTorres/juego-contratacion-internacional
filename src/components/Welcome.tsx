const Flag = ({ co }: { co?: boolean }) => (
  <span className="inline-block h-5 w-7 overflow-hidden rounded-sm border border-white/30">
    {co ? (
      <span className="flex h-full flex-col"><i className="h-1/2 bg-[#fcd116]" /><i className="h-1/4 bg-[#003893]" /><i className="h-1/4 bg-[#ce1126]" /></span>
    ) : (
      <span className="grid h-full grid-cols-[40%_60%] grid-rows-2"><i className="bg-[#0039a6]" /><i className="bg-white" /><i className="col-span-2 bg-[#d52b1e]" /></span>
    )}
  </span>
);

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="welcome flex min-h-screen flex-col bg-[#07152b] text-white">
      <header className="flex items-center justify-end border-b border-white/10 px-6 py-6 md:px-[76px]">
        <div className="flex items-center gap-3 text-[10px] tracking-[.15em] text-white/60">
          <Flag co /><span>×</span><Flag />
          <span className="ml-4 grid h-5 w-5 place-items-center rounded-full border border-white/50 text-xs">?</span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        <img src="/store-welcome.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,21,43,0.92)_0%,rgba(7,21,43,0.75)_45%,rgba(7,21,43,0.28)_100%)]" aria-hidden />

        <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center">
          <h1 className="font-display text-6xl font-extrabold leading-[.95] md:text-[110px]">
            CORONA <span className="text-cyan-300">×</span><br />FALABELLA<span className="text-amber-400">.</span>
          </h1>
          <h2 className="font-display mt-8 max-w-md text-2xl font-semibold leading-snug md:text-[28px]">Dos países, una alianza: el desafío de construir juntos.</h2>
          <p className="mt-6 max-w-[460px] leading-8 text-white/80">Dos empresas, dos países y una alianza que transformó el mercado del mejoramiento del hogar en Colombia. ¿Estás listo para descubrir cómo nació esta historia?</p>
          <button onClick={onStart} className="mt-10 inline-flex items-center gap-10 bg-blue-600 px-6 py-4 text-sm font-bold tracking-wide shadow-[5px_5px_0_0_rgba(0,0,0,.35)] transition hover:bg-blue-500">
            COMENZAR EL DESAFÍO <span className="text-xl">→</span>
          </button>
        </div>
      </main>

      <footer className="flex items-center justify-center border-t border-white/10 px-6 py-4 text-[10px] tracking-[.1em] text-white/60 md:px-[76px]">
        <span>Paula Andrea Acevedo Carrillo · Alba Paola Alvarez Barranco</span>
      </footer>
    </div>
  );
}

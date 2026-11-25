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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,21,43,0.92)_0%,rgba(11,42,91,0.72)_48%,rgba(7,21,43,0.32)_100%)]" aria-hidden />
        <div className="stars opacity-70" aria-hidden />

        <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center">
          <h1
            className="font-pixel animate-[float_3s_ease-in-out_infinite] whitespace-nowrap text-[clamp(2.1rem,7.2vw,6.2rem)] font-bold leading-none tracking-wide text-amber-300"
            style={{ textShadow: "4px 4px 0 #07152b, 8px 8px 0 #1d4fa3" }}
          >
            CORONA <span className="text-cyan-300">×</span> FALABELLA<span className="text-white">.</span>
          </h1>
          <h2
            className="font-pixel mt-7 max-w-xl text-2xl font-bold leading-snug text-white md:text-3xl"
            style={{ textShadow: "2px 2px 0 #07152b" }}
          >
            Dos países, una alianza: el desafío de construir juntos.
          </h2>
          <p className="mt-5 max-w-[500px] rounded-sm border-2 border-cyan-300/40 bg-[#07152b]/75 px-5 py-3.5 text-base leading-7 text-white/90 shadow-[5px_5px_0_0_rgba(7,21,43,0.8)] backdrop-blur-xs">
            Dos empresas, dos países y una alianza que transformó el mercado del mejoramiento del hogar en Colombia. ¿Estás listo para descubrir cómo nació esta historia?
          </p>
          <button
            onClick={onStart}
            className="font-pixel animate-pulse-soft mt-9 inline-flex cursor-pointer items-center gap-4 rounded-sm border-4 border-[#07152b] bg-amber-300 px-8 py-4 text-xl font-bold tracking-wider text-[#07152b] shadow-[0_6px_0_0_#07152b,0_10px_24px_rgba(252,209,22,0.35)] transition hover:-translate-y-1 hover:bg-amber-200 active:translate-y-1 active:shadow-[0_2px_0_0_#07152b]"
          >
            <span>▶</span> COMENZAR EL DESAFÍO
          </button>
        </div>
      </main>

      <footer className="flex items-center justify-center border-t border-white/10 px-6 py-4 font-pixel text-xs tracking-[.12em] text-white/70 md:px-[76px]">
        <span>Paula Andrea Acevedo Carrillo · Alba Paola Alvarez Barranco</span>
      </footer>
    </div>
  );
}

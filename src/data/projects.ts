export interface Project {
  slug: string;
  name: string;
  description: string;
  repo: string; // "owner/repo"
  siteUrl: string;
  branch: string;
  boardPath: string;
}

export const projects: Project[] = [
  {
    slug: "btc-candles",
    name: "btc_candles_research",
    description:
      "¿Existe un edge estadístico en la dirección de la vela de 5 minutos de BTC/USDT? Pre-registro, benchmarks Monte Carlo emparejados por volatilidad, corrección FDR.",
    repo: "nobodywhois0/btc_candles_research",
    siteUrl: "https://nobodywhois0.github.io/btc_candles_research/",
    branch: "main",
    boardPath: "board.md",
  },
];

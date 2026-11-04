export interface RoadmapNode {
  id: string;
  date?: string;
  title: string;
  desc: string;
  tags: string[];
  link?: string;
}

export interface Track {
  id: '3d' | 'bass' | 'code';
  code: string;
  shortLabel: string;
  spec: string;
  title: string;
  desc: string;
  nodes: RoadmapNode[];
}

export const tracks: Track[] = [
  {
    id: '3d',
    code: '0x01 // LAYER BY LAYER',
    shortLabel: 'Ścieżka: Druk 3D',
    spec: 'Z: 0.20mm · 215°C · CAD/FDM',
    title: 'Druk 3D',
    desc: 'Po godzinach projektuję w CAD i drukuję części użytkowe, uchwyty, obudowy oraz drobne poprawki do codziennych rzeczy.',
    nodes: [
      {
        id: '3D-01',
        title: 'Profil i modele na MakerWorld (@chy.ba.tys)',
        desc: 'Publikowane projekty użytkowe, uchwyty, organizery i akcesoria gotowe do pobrania i wydruku.',
        tags: ['MakerWorld', 'CAD', 'PETG', 'PLA'],
        link: 'https://makerworld.com/@chy.ba.tys',
      },
      {
        id: '3D-02',
        title: 'Uchwyt biurkowy na słuchawki i przewody',
        desc: 'Przykręcany do blatu wieszak zaprojektowany pod konkretny grubościomierz biurka, z prowadnicą na wtyki jack/XLR.',
        tags: ['CAD', 'PETG', 'Biurko'],
      },
      {
        id: '3D-03',
        title: 'Modułowe organizery do szuflady warsztatowej',
        desc: 'Zestaw pojemników na śrubki, inserty gwintowane M3/M4 i drobne narzędzia dopasowany na wymiar szuflady.',
        tags: ['PLA', 'Warsztat', 'Grid'],
      },
    ],
  },
  {
    id: 'bass',
    code: '0x02 // NOTE BY NOTE',
    shortLabel: 'Ścieżka: Gitara basowa',
    spec: '41.20 Hz – 98.00 Hz · E1–G2',
    title: 'Gitara basowa',
    desc: 'Lubię niskie brzmienia i granie w sekcji rytmicznej. Cztery struny to dla mnie najlepszy sposób na oderwanie głowy od monitora.',
    nodes: [
      {
        id: 'BASS-01',
        title: 'Syntezator strun basowych na stronie (Web Audio)',
        desc: 'Interaktywne 4 struny (E1, A1, D2, G2) na ekranie głównym nasuta.pl generujące dźwięk w czasie rzeczywistym bez zewnętrznych sampli.',
        tags: ['Web Audio API', '41.20 Hz – 98.00 Hz', 'Synteza'],
        link: '#top',
      },
      {
        id: 'BASS-02',
        title: 'Domowy łańcuch sygnałowy do ćwiczeń na słuchawkach',
        desc: 'Konfiguracja interfejsu, kompresji i symulacji kolumny basowej pod granie w nocy bez opóźnień.',
        tags: ['Preamps', 'IR', 'Home Studio'],
      },
      {
        id: 'BASS-03',
        title: 'Szkice i pętle basowe (archiwum nagrań)',
        desc: 'Zbiór krótkich riffów, linii rytmicznych i pomysłów nagrywanych do szuflady.',
        tags: ['Groove', 'DI', 'Nagrania'],
      },
    ],
  },
  {
    id: 'code',
    code: '0x03 // LINE BY LINE',
    shortLabel: 'Ścieżka: Kod i technologia',
    spec: 'CODE · TOOLS · WEB',
    title: 'Kod i technologia',
    desc: 'Na co dzień pracuję z kodem i technologią. Lubię proste, działające rozwiązania i narzędzia, które ułatwiają życie.',
    nodes: [
      {
        id: 'CODE-01',
        title: 'nasuta.pl',
        desc: 'Strona osobista z generatywnym canvasem 2D, podziałem na ścieżki tematyczne i automatycznym wdrożeniem na GitHub Pages.',
        tags: ['Astro', 'Tailwind CSS', 'Canvas 2D', 'GitHub Actions'],
        link: 'https://github.com/sebastian-nasuta/nasuta.pl',
      },
      {
        id: 'CODE-02',
        title: 'Skrypty i konfiguracja środowiska lokalnego',
        desc: 'Zestaw aliasów, skryptów powłoki i automatyzacji przyspieszających codzienną pracę w Linuksie.',
        tags: ['Linux', 'Bash', 'Dotfiles'],
      },
      {
        id: 'CODE-03',
        title: 'Eksperymenty z generatywną grafiką w przeglądarce',
        desc: 'Prototypy animacji konturowych i fizyki strun pisane w czystym JavaScripcie bez ciężkich bibliotek 3D.',
        tags: ['Canvas 2D', 'JavaScript', 'Web Audio'],
      },
    ],
  },
];

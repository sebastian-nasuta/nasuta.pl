export interface RoadmapNode {
  id: string;
  date?: string;
  title: string;
  desc: string;
  tags: string[];
  link?: string;
  image?: string;
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
        title: 'AeroPress Filter Case — Twist Lid',
        desc: 'Zakręcany pojemnik na standardowe filtry papierowe do AeroPressa, do domu i w podróż. Wieczko ma wytłoczoną ikonę AeroPressa oraz radełkowaną krawędź ułatwiającą chwyt (w wersji V2 skrócony gwint kompatybilny wstecznie). Druk bez podpór.',
        tags: ['AeroPress', 'Twist Lid', 'No Supports', 'MakerWorld'],
        link: 'https://makerworld.com/pl/models/1392555-aeropress-filter-case-twist-lid#profileId-2587994',
        image: 'https://makerworld.bblmw.com/makerworld/model/US8e88b8c474e65b/design/2025-05-07_e026d0051f44c8.png?x-oss-process=image%2Fformat%2Cwebp',
      },
      {
        id: '3D-02',
        title: 'RPG Dice Set Box — Baby Dragon',
        desc: 'Dwuczęściowe pudełko mieszczące pełny zestaw kości RPG (D4–D20). Wieczko zamykane na zatrzask (snap-fit) z dwukolorowym motywem małego smoka tulącego kość D20 — pod druk z AMS lub ręczną zmianą filamentu.',
        tags: ['RPG', 'Snap-Fit', 'AMS / Multicolor', 'MakerWorld'],
        link: 'https://makerworld.com/pl/models/1343902-rpg-dice-set-box-baby-dragon#profileId-1385015',
        image: 'https://makerworld.bblmw.com/makerworld/model/USce0879fc77c59e/design/2025-04-21_2aac7808dde83.jpg?x-oss-process=image%2Fformat%2Cwebp',
      },
      {
        id: '3D-03',
        title: 'HPH — Hiking Poles Holder',
        desc: 'System do mocowania kijków trekkingowych do plecaka składający się z uchwytu z motywem górskim (warstwa 0.12 mm) i elastycznego paska (warstwa 0.20 mm). Całość drukowana z wytrzymałego TPU, wygodna w obsłudze nawet w rękawiczkach.',
        tags: ['TPU', 'Hiking', 'Outdoor', 'MakerWorld'],
        link: 'https://makerworld.com/pl/models/1360025-hph-hiking-poles-holder#profileId-1404489',
        image: 'https://makerworld.bblmw.com/makerworld/model/USc7b207c2a10f76/design/2025-04-27_00b0a4d0433b08.jpg?x-oss-process=image%2Fformat%2Cwebp',
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

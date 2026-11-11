import type { TranslationKey } from '../i18n';

export interface RoadmapNode {
  id: string;
  date?: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  tags: string[];
  link?: string;
  image?: string;
}

export interface Track {
  id: '3d' | 'bass' | 'code';
  code: string;
  spec: string;
  titleKey: TranslationKey;
  nodes: RoadmapNode[];
}

export interface ContactLink {
  label: string;
  href: string;
  external?: boolean;
}

export const contactLinks: ContactLink[] = [
  {
    label: 'GitHub ↗',
    href: 'https://github.com/sebastian-nasuta',
    external: true,
  },
  {
    label: 'MakerWorld (@chy.ba.tys) ↗',
    href: 'https://makerworld.com/@chy.ba.tys',
    external: true,
  },
  {
    label: 'kontakt@nasuta.pl',
    href: 'mailto:kontakt@nasuta.pl',
  },
];

export const tracks: Track[] = [
  {
    id: '3d',
    code: '0x01 // LAYER BY LAYER',
    spec: 'Z: 0.20mm · 215°C · CAD/FDM',
    titleKey: 'tracks.3d.title',
    nodes: [
      {
        id: '3D-01',
        titleKey: 'projects.3D-01.title',
        descKey: 'projects.3D-01.desc',
        tags: ['AeroPress', 'Twist Lid', 'No Supports', 'MakerWorld'],
        link: 'https://makerworld.com/pl/models/1392555-aeropress-filter-case-twist-lid#profileId-2587994',
        image: 'https://makerworld.bblmw.com/makerworld/model/US8e88b8c474e65b/design/2025-05-07_e026d0051f44c8.png?x-oss-process=image%2Fformat%2Cwebp',
      },
      {
        id: '3D-02',
        titleKey: 'projects.3D-02.title',
        descKey: 'projects.3D-02.desc',
        tags: ['RPG', 'Snap-Fit', 'AMS / Multicolor', 'MakerWorld'],
        link: 'https://makerworld.com/pl/models/1343902-rpg-dice-set-box-baby-dragon#profileId-1385015',
        image: 'https://makerworld.bblmw.com/makerworld/model/USce0879fc77c59e/design/2025-04-21_2aac7808dde83.jpg?x-oss-process=image%2Fformat%2Cwebp',
      },
      {
        id: '3D-03',
        titleKey: 'projects.3D-03.title',
        descKey: 'projects.3D-03.desc',
        tags: ['TPU', 'Hiking', 'Outdoor', 'MakerWorld'],
        link: 'https://makerworld.com/pl/models/1360025-hph-hiking-poles-holder#profileId-1404489',
        image: 'https://makerworld.bblmw.com/makerworld/model/USc7b207c2a10f76/design/2025-04-27_00b0a4d0433b08.jpg?x-oss-process=image%2Fformat%2Cwebp',
      },
    ],
  },
  {
    id: 'bass',
    code: '0x02 // NOTE BY NOTE',
    spec: '41.20 Hz – 98.00 Hz · E1–G2',
    titleKey: 'tracks.bass.title',
    nodes: [],
  },
  {
    id: 'code',
    code: '0x03 // LINE BY LINE',
    spec: 'CODE · TOOLS · WEB',
    titleKey: 'tracks.code.title',
    nodes: [],
  },
];

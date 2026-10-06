import { SkyObject, Constellation } from '../types/astronomy';

// Catalog of major stars with accurate J2000 Right Ascension (hours) and Declination (degrees)
export const STAR_CATALOG: Omit<SkyObject, 'altitude' | 'azimuth' | 'isVisible'>[] = [
  {
    id: 'sirius',
    name: 'Sirius',
    latinName: 'Alpha Canis Majoris',
    type: 'star',
    ra: 6.7525, // 06h 45m 09s
    dec: -16.716, // -16° 42' 58"
    magnitude: -1.46,
    distanceLightYears: 8.6,
    constellationId: 'cma',
    constellationName: 'Canis Major',
    description: 'The brightest star in Earth\'s night sky. A binary star system consisting of a main-sequence star and a faint white dwarf companion (The Pup).',
    mythology: 'Known as the "Dog Star" because it is part of the constellation Canis Major. In ancient Egypt, its heliacal rising marked the flooding of the Nile.',
    missionHint: 'Look low in the southern sky during winter; it flashes brilliantly with multiple colors due to atmospheric refraction.'
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    latinName: 'Alpha Orionis',
    type: 'star',
    ra: 5.9195, // 05h 55m 10s
    dec: 7.407, // +07° 24' 25"
    magnitude: 0.5,
    distanceLightYears: 642.5,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'A luminous red supergiant nearing the end of its life. If placed at the center of our solar system, its surface would extend past Jupiter.',
    mythology: 'Marks the right shoulder of Orion the Hunter in Greek mythology. Arabic for "hand of Orion".',
    missionHint: 'Notice its distinct warm reddish-orange hue marking the top left of the iconic Orion hourglass figure.'
  },
  {
    id: 'rigel',
    name: 'Rigel',
    latinName: 'Beta Orionis',
    type: 'star',
    ra: 5.2423, // 05h 14m 32s
    dec: -8.201, // -08° 12' 06"
    magnitude: 0.13,
    distanceLightYears: 863.0,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'A brilliant blue-white supergiant, shining tens of thousands of times brighter than our Sun.',
    mythology: 'Depicts Orion\'s left foot. Arabic "Rijl Jauzah" translates to "the foot of the central one".',
    missionHint: 'Forms the bottom-right corner of Orion, contrasting in piercing blue-white against the orange Betelgeuse.'
  },
  {
    id: 'polaris',
    name: 'Polaris',
    latinName: 'Alpha Ursae Minoris',
    type: 'star',
    ra: 2.5303, // 02h 31m 49s
    dec: 89.264, // +89° 15' 51"
    magnitude: 1.98,
    distanceLightYears: 433.0,
    constellationId: 'umi',
    constellationName: 'Ursa Minor',
    description: 'The North Star. It closely aligns with Earth\'s northern axis of rotation, remaining virtually stationary as the sky spins around it.',
    mythology: 'A crucial navigational beacon for mariners and explorers for thousands of years.',
    missionHint: 'Trace a line through the two outer "pointer" stars of the Big Dipper straight to Polaris.'
  },
  {
    id: 'vega',
    name: 'Vega',
    latinName: 'Alpha Lyrae',
    type: 'star',
    ra: 18.6156, // 18h 36m 56s
    dec: 38.783, // +38° 47' 01"
    magnitude: 0.03,
    distanceLightYears: 25.0,
    constellationId: 'lyr',
    constellationName: 'Lyra',
    description: 'A bluish-white star and the fifth brightest in the night sky. Anchor of the Summer Triangle asterism.',
    mythology: 'The first star other than the Sun to be photographed (in 1850). In ancient China, represented Zhinü the weaver girl in the Qixi legend.',
    missionHint: 'High overhead in summer evenings, part of the sharp Summer Triangle with Altair and Deneb.'
  },
  {
    id: 'altair',
    name: 'Altair',
    latinName: 'Alpha Aquilae',
    type: 'star',
    ra: 19.8464, // 19h 50m 47s
    dec: 8.868, // +08° 52' 06"
    magnitude: 0.77,
    distanceLightYears: 16.7,
    constellationId: 'aql',
    constellationName: 'Aquila',
    description: 'A rapidly spinning white dwarf/subgiant star that rotates so fast (286 km/s) that its equator bulges outward noticeably.',
    mythology: 'Represents Niulang the cowherd in Chinese lore, separated from Vega across the river of the Milky Way.',
    missionHint: 'Look for the southern vertex of the prominent Summer Triangle.'
  },
  {
    id: 'deneb',
    name: 'Deneb',
    latinName: 'Alpha Cygni',
    type: 'star',
    ra: 20.6905, // 20h 41m 26s
    dec: 45.280, // +45° 16' 49"
    magnitude: 1.25,
    distanceLightYears: 2615.0,
    constellationId: 'cyg',
    constellationName: 'Cygnus',
    description: 'An immense white supergiant. Despite being over 2,600 light-years away, it shines brightly, packing the luminosity of ~200,000 Suns.',
    mythology: 'Marks the tail of Cygnus the Swan, gliding through the galactic plane of the Milky Way.',
    missionHint: 'Top-most point of the Northern Cross asterism inside the Summer Triangle.'
  },
  {
    id: 'procyon',
    name: 'Procyon',
    latinName: 'Alpha Canis Minoris',
    type: 'star',
    ra: 7.6552, // 07h 39m 18s
    dec: 5.225, // +05° 13' 30"
    magnitude: 0.38,
    distanceLightYears: 11.46,
    constellationId: 'cmi',
    constellationName: 'Canis Minor',
    description: 'A bright yellowish-white star that forms the Winter Triangle alongside Sirius and Betelgeuse.',
    mythology: 'Greek for "before the dog", because it rises ahead of Sirius in northern latitudes.',
    missionHint: 'Forms an equilateral triangle with Betelgeuse and Sirius.'
  },
  {
    id: 'aldebaran',
    name: 'Aldebaran',
    latinName: 'Alpha Tauri',
    type: 'star',
    ra: 4.5987, // 04h 35m 55s
    dec: 16.509, // +16° 30' 33"
    magnitude: 0.85,
    distanceLightYears: 65.3,
    constellationId: 'tau',
    constellationName: 'Taurus',
    description: 'The angry red eye of Taurus the Bull. An orange giant star slightly larger than 40 solar diameters.',
    mythology: 'Arabic "Al Dabaran" meaning "The Follower", as it appears to follow the Pleiades star cluster across the sky.',
    missionHint: 'Follow the three belt stars of Orion up and to the right to locate Aldebaran.'
  },
  {
    id: 'arcturus',
    name: 'Arcturus',
    latinName: 'Alpha Boötis',
    type: 'star',
    ra: 14.2610, // 14h 15m 40s
    dec: 19.182, // +19° 10' 56"
    magnitude: -0.05,
    distanceLightYears: 36.7,
    constellationId: 'boo',
    constellationName: 'Boötes',
    description: 'A brilliant red/orange giant, the fourth brightest star in the sky and the brightest in the northern celestial hemisphere.',
    mythology: 'Name translates to "Guardian of the Bear". Follow the arc of the Big Dipper handle: "Follow the arc to Arcturus".',
    missionHint: 'Arc away from the handle curve of Ursa Major to easily spot this orange jewel.'
  },
  {
    id: 'spica',
    name: 'Spica',
    latinName: 'Alpha Virginis',
    type: 'star',
    ra: 13.4199, // 13h 25m 12s
    dec: -11.161, // -11° 09' 41"
    magnitude: 0.98,
    distanceLightYears: 250.0,
    constellationId: 'vir',
    constellationName: 'Virgo',
    description: 'A spectroscopic binary and rotating ellipsoidal variable whose two component stars are so close they distort each other into egg shapes.',
    mythology: 'Represents an ear of wheat held by the goddess Virgo.',
    missionHint: '"Follow the arc to Arcturus, then speed on to Spica."'
  },
  {
    id: 'antares',
    name: 'Antares',
    latinName: 'Alpha Scorpii',
    type: 'star',
    ra: 16.4901, // 16h 29m 24s
    dec: -26.432, // -26° 25' 55"
    magnitude: 1.06,
    distanceLightYears: 550.0,
    constellationId: 'sco',
    constellationName: 'Scorpius',
    description: 'A red supergiant of colossal proportions. The "heart of the Scorpion", renowned for its striking ruby glow.',
    mythology: 'Named "Anti-Ares" ("rival to Mars") due to its fiery reddish color mimicking the planet Mars.',
    missionHint: 'Look low in the southern sky on summer evenings; it glows distinctly red in the chest of Scorpius.'
  },
  // Key companion stars for constellation asterisms
  {
    id: 'bellatrix',
    name: 'Bellatrix',
    latinName: 'Gamma Orionis',
    type: 'star',
    ra: 5.4189,
    dec: 6.349,
    magnitude: 1.64,
    distanceLightYears: 252.0,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'Orion\'s left shoulder (from our viewpoint, upper-right), known as the Amazon Star.',
    missionHint: 'Top right corner of the Orion hourglass.'
  },
  {
    id: 'saiph',
    name: 'Saiph',
    latinName: 'Kappa Orionis',
    type: 'star',
    ra: 5.7959,
    dec: -9.669,
    magnitude: 2.07,
    distanceLightYears: 650.0,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'Orion\'s right foot (bottom left of hourglass).',
    missionHint: 'Bottom left corner of Orion.'
  },
  {
    id: 'alnitak',
    name: 'Alnitak',
    latinName: 'Zeta Orionis',
    type: 'star',
    ra: 5.6793,
    dec: -1.943,
    magnitude: 1.77,
    distanceLightYears: 1260.0,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'The easternmost star of Orion\'s Belt.',
    missionHint: 'First star in the 3-star belt line.'
  },
  {
    id: 'alnilam',
    name: 'Alnilam',
    latinName: 'Epsilon Orionis',
    type: 'star',
    ra: 5.6036,
    dec: -1.202,
    magnitude: 1.69,
    distanceLightYears: 2000.0,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'The central star of Orion\'s famous 3-star Belt.',
    missionHint: 'Center of Orion\'s Belt.'
  },
  {
    id: 'mintaka',
    name: 'Mintaka',
    latinName: 'Delta Orionis',
    type: 'star',
    ra: 5.5334,
    dec: -0.299,
    magnitude: 2.23,
    distanceLightYears: 1200.0,
    constellationId: 'ori',
    constellationName: 'Orion',
    description: 'The westernmost star of Orion\'s Belt, sitting almost right on the celestial equator.',
    missionHint: 'Right-most star of Orion\'s Belt.'
  },
  // Ursa Major pointer stars
  {
    id: 'dubhe',
    name: 'Dubhe',
    latinName: 'Alpha Ursae Majoris',
    type: 'star',
    ra: 11.0621,
    dec: 61.751,
    magnitude: 1.79,
    distanceLightYears: 123.0,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'The upper pointer star in the bowl of the Big Dipper.',
    missionHint: 'Top lip of the Dipper ladle, pointing straight to Polaris.'
  },
  {
    id: 'merak',
    name: 'Merak',
    latinName: 'Beta Ursae Majoris',
    type: 'star',
    ra: 11.0307,
    dec: 56.382,
    magnitude: 2.37,
    distanceLightYears: 79.7,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'The lower pointer star in the bowl of the Big Dipper.',
    missionHint: 'Bottom lip of the Big Dipper ladle.'
  },
  {
    id: 'phecda',
    name: 'Phecda',
    latinName: 'Gamma Ursae Majoris',
    type: 'star',
    ra: 11.8971,
    dec: 53.695,
    magnitude: 2.44,
    distanceLightYears: 83.2,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'Bottom interior corner of the Big Dipper bowl.',
    missionHint: 'Part of Ursa Major.'
  },
  {
    id: 'megrez',
    name: 'Megrez',
    latinName: 'Delta Ursae Majoris',
    type: 'star',
    ra: 12.2570,
    dec: 57.032,
    magnitude: 3.31,
    distanceLightYears: 80.5,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'The joining star between the Dipper bowl and handle.',
    missionHint: 'Faintest of the 7 Big Dipper stars.'
  },
  {
    id: 'alioth',
    name: 'Alioth',
    latinName: 'Epsilon Ursae Majoris',
    type: 'star',
    ra: 12.9004,
    dec: 55.960,
    magnitude: 1.77,
    distanceLightYears: 82.6,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'The brightest star in Ursa Major, first in the handle.',
    missionHint: 'Start of the Dipper handle curve.'
  },
  {
    id: 'mizar',
    name: 'Mizar',
    latinName: 'Zeta Ursae Majoris',
    type: 'star',
    ra: 13.3987,
    dec: 54.925,
    magnitude: 2.23,
    distanceLightYears: 82.9,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'Famous naked-eye double star with Alcor. Used historically as an eye test for ancient warriors.',
    missionHint: 'Middle star of the Dipper handle; see if you can spot its faint companion Alcor.'
  },
  {
    id: 'alkaid',
    name: 'Alkaid',
    latinName: 'Eta Ursae Majoris',
    type: 'star',
    ra: 13.7923,
    dec: 49.313,
    magnitude: 1.86,
    distanceLightYears: 103.9,
    constellationId: 'uma',
    constellationName: 'Ursa Major',
    description: 'The tip of the Big Dipper\'s handle.',
    missionHint: 'Tip of the Dipper handle.'
  },
  // Cassiopeia "W" stars
  {
    id: 'schedar',
    name: 'Schedar',
    latinName: 'Alpha Cassiopeiae',
    type: 'star',
    ra: 0.6751,
    dec: 56.537,
    magnitude: 2.24,
    distanceLightYears: 228.0,
    constellationId: 'cas',
    constellationName: 'Cassiopeia',
    description: 'Orange giant star forming the bottom-right angle of Cassiopeia\'s prominent "W".',
    missionHint: 'Right-hand bottom peak of the Cassiopeia W.'
  },
  {
    id: 'caph',
    name: 'Caph',
    latinName: 'Beta Cassiopeiae',
    type: 'star',
    ra: 0.1528,
    dec: 59.150,
    magnitude: 2.28,
    distanceLightYears: 54.7,
    constellationId: 'cas',
    constellationName: 'Cassiopeia',
    description: 'Far right tip of the Queen\'s throne / "W".',
    missionHint: 'Far right star of Cassiopeia.'
  },
  // Gemini twins
  {
    id: 'capella',
    name: 'Capella',
    latinName: 'Alpha Aurigae',
    type: 'star',
    ra: 5.278, // 05h 16m 41s
    dec: 45.998, // +45° 59' 53"
    magnitude: 0.08,
    distanceLightYears: 42.9,
    constellationId: 'aur',
    constellationName: 'Auriga',
    description: 'The golden star of the charioteer. The sixth brightest star in the entire night sky, prominent in the northeast.',
    mythology: 'Represents the goat Amalthea who suckled the infant Zeus.',
    missionHint: 'Bright yellow star high in the northeast sky.'
  },
  {
    id: 'mirfak',
    name: 'Mirfak',
    latinName: 'Alpha Persei',
    type: 'star',
    ra: 3.405,
    dec: 49.861,
    magnitude: 1.79,
    distanceLightYears: 510.0,
    constellationId: 'per',
    constellationName: 'Perseus',
    description: 'A yellow-white supergiant in the constellation Perseus.',
    missionHint: 'Center of the constellation Perseus.'
  },
  {
    id: 'algol',
    name: 'Algol',
    latinName: 'Beta Persei',
    type: 'star',
    ra: 3.136,
    dec: 40.956,
    magnitude: 2.12,
    distanceLightYears: 90.0,
    constellationId: 'per',
    constellationName: 'Perseus',
    description: 'The famous "Demon Star", an eclipsing binary star system whose brightness noticeably dims every 2.87 days.',
    missionHint: 'The winking Demon Star of Perseus.'
  },
  {
    id: 'hamal',
    name: 'Hamal',
    latinName: 'Alpha Arietis',
    type: 'star',
    ra: 2.119,
    dec: 23.462,
    magnitude: 2.01,
    distanceLightYears: 65.8,
    constellationId: 'ari',
    constellationName: 'Aries',
    description: 'The brightest star in Aries the Ram, an orange giant.',
    missionHint: 'Prominent star high in the eastern sky.'
  },
  {
    id: 'alpheratz',
    name: 'Alpheratz',
    latinName: 'Alpha Andromedae',
    type: 'star',
    ra: 0.139,
    dec: 29.090,
    magnitude: 2.06,
    distanceLightYears: 97.0,
    constellationId: 'and',
    constellationName: 'Andromeda',
    description: 'Connecting star between Andromeda and the Great Square of Pegasus.',
    missionHint: 'High overhead near the Zenith.'
  },
  {
    id: 'scheat',
    name: 'Scheat',
    latinName: 'Beta Pegasi',
    type: 'star',
    ra: 23.063,
    dec: 28.083,
    magnitude: 2.42,
    distanceLightYears: 196.0,
    constellationId: 'peg',
    constellationName: 'Pegasus',
    description: 'Red giant star marking the upper corner of the Great Square of Pegasus.',
    missionHint: 'Part of the Great Square of Pegasus directly above.'
  },
  {
    id: 'markab',
    name: 'Markab',
    latinName: 'Alpha Pegasi',
    type: 'star',
    ra: 23.079,
    dec: 15.205,
    magnitude: 2.48,
    distanceLightYears: 133.0,
    constellationId: 'peg',
    constellationName: 'Pegasus',
    description: 'Southwestern corner of the Great Square of Pegasus.',
    missionHint: 'Corner of the Great Square of Pegasus.'
  },
  {
    id: 'algenib',
    name: 'Algenib',
    latinName: 'Gamma Pegasi',
    type: 'star',
    ra: 0.221,
    dec: 15.183,
    magnitude: 2.83,
    distanceLightYears: 390.0,
    constellationId: 'peg',
    constellationName: 'Pegasus',
    description: 'Southeastern corner of the Great Square of Pegasus.',
    missionHint: 'Lower left corner of the Great Square of Pegasus.'
  },
  {
    id: 'fomalhaut',
    name: 'Fomalhaut',
    latinName: 'Alpha Piscis Austrini',
    type: 'star',
    ra: 22.960,
    dec: -29.622,
    magnitude: 1.16,
    distanceLightYears: 25.1,
    constellationId: 'psa',
    constellationName: 'Piscis Austrinus',
    description: 'The Lonely Star of Autumn. One of the royal stars of ancient Persia, surrounded by a dust debris disk.',
    missionHint: 'Solitary bright star in the south-southwest sky.'
  },
  {
    id: 'menkar',
    name: 'Menkar',
    latinName: 'Alpha Ceti',
    type: 'star',
    ra: 3.037,
    dec: 4.090,
    magnitude: 2.53,
    distanceLightYears: 249.0,
    constellationId: 'cet',
    constellationName: 'Cetus',
    description: 'Red giant star marking the jaw of the sea monster Cetus.',
    missionHint: 'Located in the constellation Cetus in the southeast.'
  },
  {
    id: 'castor',
    name: 'Castor',
    latinName: 'Alpha Geminorum',
    type: 'star',
    ra: 7.5767,
    dec: 31.888,
    magnitude: 1.58,
    distanceLightYears: 51.0,
    constellationId: 'gem',
    constellationName: 'Gemini',
    description: 'Fascinating sextuple star system (six stars gravitationally bound into three pairs).',
    mythology: 'The mortal twin brother of Pollux in Greco-Roman myth.',
    missionHint: 'Upper of the two bright twin heads of Gemini.'
  },
  {
    id: 'pollux',
    name: 'Pollux',
    latinName: 'Beta Geminorum',
    type: 'star',
    ra: 7.7553,
    dec: 28.026,
    magnitude: 1.14,
    distanceLightYears: 33.7,
    constellationId: 'gem',
    constellationName: 'Gemini',
    description: 'An orange giant star hosting an extrasolar planet (Thestias). Closer and brighter than Castor.',
    mythology: 'The immortal twin brother of Castor.',
    missionHint: 'Slightly brighter and yellower twin below Castor.'
  }
];

export const CONSTELLATIONS_CATALOG: Constellation[] = [
  {
    id: 'ori',
    name: 'Orion',
    englishName: 'The Hunter',
    centerRa: 5.5,
    centerDec: 0.0,
    stars: ['betelgeuse', 'rigel', 'bellatrix', 'saiph', 'alnitak', 'alnilam', 'mintaka'],
    lines: [
      ['betelgeuse', 'bellatrix'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'saiph'],
      ['saiph', 'rigel'],
      ['rigel', 'mintaka'],
      ['betelgeuse', 'alnitak']
    ],
    description: 'One of the most recognizable constellations in the world, featuring the famous 3-star belt and brilliant supergiant stars.',
    season: 'winter'
  },
  {
    id: 'uma',
    name: 'Ursa Major',
    englishName: 'The Great Bear (Big Dipper)',
    centerRa: 11.5,
    centerDec: 55.0,
    stars: ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'],
    lines: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid']
    ],
    description: 'A massive northern circumpolar constellation whose core 7 stars form the world-renowned Big Dipper / Plough asterism.',
    season: 'spring'
  },
  {
    id: 'umi',
    name: 'Ursa Minor',
    englishName: 'The Little Bear (Little Dipper)',
    centerRa: 15.0,
    centerDec: 78.0,
    stars: ['polaris'],
    lines: [],
    description: 'Home to Polaris, the North Star, marking the celestial pole of the northern sky.',
    season: 'all'
  },
  {
    id: 'cas',
    name: 'Cassiopeia',
    englishName: 'The Queen',
    centerRa: 1.0,
    centerDec: 60.0,
    stars: ['schedar', 'caph'],
    lines: [['caph', 'schedar']],
    description: 'Easily identified by its distinctive "W" or "M" shape opposite the Big Dipper across Polaris.',
    season: 'autumn'
  },
  {
    id: 'gem',
    name: 'Gemini',
    englishName: 'The Twins',
    centerRa: 7.0,
    centerDec: 25.0,
    stars: ['castor', 'pollux'],
    lines: [['castor', 'pollux']],
    description: 'Zodiac constellation representing the twin brothers Castor and Pollux standing side by side.',
    season: 'winter'
  },
  {
    id: 'cma',
    name: 'Canis Major',
    englishName: 'The Greater Dog',
    centerRa: 6.8,
    centerDec: -22.0,
    stars: ['sirius'],
    lines: [],
    description: 'The faithful hunting hound following Orion, bearing Sirius, the brightest star in Earth\'s sky.',
    season: 'winter'
  },
  {
    id: 'tau',
    name: 'Taurus',
    englishName: 'The Bull',
    centerRa: 4.5,
    centerDec: 18.0,
    stars: ['aldebaran'],
    lines: [],
    description: 'Home of the bright red giant Aldebaran and the Pleiades and Hyades star clusters.',
    season: 'winter'
  },
  {
    id: 'sco',
    name: 'Scorpius',
    englishName: 'The Scorpion',
    centerRa: 16.5,
    centerDec: -30.0,
    stars: ['antares'],
    lines: [],
    description: 'Dramatic southern constellation shaped like a scorpion with the blazing red heart star Antares.',
    season: 'summer'
  }
];

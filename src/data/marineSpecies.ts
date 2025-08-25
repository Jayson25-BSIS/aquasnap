export interface MarineSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  habitat: string;
  diet: string;
  conservationStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered';
  imageUrl: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  funFact: string;
  size: string;
  depth: string;
}

export const marineSpeciesData: MarineSpecies[] = [
  {
    id: 'clownfish',
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    description: 'Colorful reef fish known for living in sea anemones.',
    habitat: 'Coral reefs in warm waters',
    diet: 'Algae, zooplankton, worms',
    conservationStatus: 'Least Concern',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    difficultyLevel: 1,
    funFact: 'All clownfish are born male and can change to female!',
    size: '7-16 cm',
    depth: '1-12 meters'
  },
  {
    id: 'great-white-shark',
    name: 'Great White Shark',
    scientificName: 'Carcharodon carcharias',
    description: 'Large predatory shark found in coastal waters worldwide.',
    habitat: 'Coastal surface waters',
    diet: 'Seals, sea lions, fish, seabirds',
    conservationStatus: 'Vulnerable',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    difficultyLevel: 2,
    funFact: 'Great whites can detect a single drop of blood in 25 gallons of water!',
    size: '4-6 meters',
    depth: '0-1,200 meters'
  },
  {
    id: 'sea-turtle',
    name: 'Sea Turtle',
    scientificName: 'Chelonioidea',
    description: 'Ancient marine reptiles that migrate vast distances.',
    habitat: 'Open oceans and coastal areas',
    diet: 'Jellyfish, seagrass, algae, crabs',
    conservationStatus: 'Endangered',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    difficultyLevel: 2,
    funFact: 'Sea turtles can live over 100 years and return to the same beach to nest!',
    size: '0.6-2 meters',
    depth: '0-1,000 meters'
  },
  {
    id: 'octopus',
    name: 'Common Octopus',
    scientificName: 'Octopus vulgaris',
    description: 'Intelligent cephalopod with eight arms and color-changing abilities.',
    habitat: 'Rocky reefs and sandy bottoms',
    diet: 'Crabs, shrimp, fish, mollusks',
    conservationStatus: 'Least Concern',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 3,
    funFact: 'Octopuses have three hearts and blue blood!',
    size: '0.3-1 meter',
    depth: '0-200 meters'
  },
  {
    id: 'whale-shark',
    name: 'Whale Shark',
    scientificName: 'Rhincodon typus',
    description: 'The largest fish in the ocean, gentle filter feeder.',
    habitat: 'Open oceans in tropical waters',
    diet: 'Plankton, small fish, fish eggs',
    conservationStatus: 'Endangered',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 3,
    funFact: 'Whale sharks can grow up to 12 meters long but are completely harmless!',
    size: '5-12 meters',
    depth: '0-1,928 meters'
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    scientificName: 'Hippocampus',
    description: 'Unique fish with horse-like head and curled tail.',
    habitat: 'Seagrass beds and coral reefs',
    diet: 'Small crustaceans, plankton',
    conservationStatus: 'Near Threatened',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 2,
    funFact: 'Male seahorses are the only males in the animal kingdom that get pregnant!',
    size: '2-35 cm',
    depth: '0-20 meters'
  },
  {
    id: 'manta-ray',
    name: 'Manta Ray',
    scientificName: 'Mobula birostris',
    description: 'Giant ray with incredible wingspan and filter-feeding mouth.',
    habitat: 'Open ocean and coral reefs',
    diet: 'Plankton, small fish',
    conservationStatus: 'Vulnerable',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 4,
    funFact: 'Manta rays have the largest brain-to-body ratio of any fish!',
    size: '3-7 meter wingspan',
    depth: '0-1,000 meters'
  },
  {
    id: 'blue-whale',
    name: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    description: 'The largest animal ever known to have lived on Earth.',
    habitat: 'Open oceans worldwide',
    diet: 'Krill',
    conservationStatus: 'Endangered',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 4,
    funFact: 'A blue whale\'s heart alone can weigh as much as a car!',
    size: '24-27 meters',
    depth: '0-500 meters'
  },
  {
    id: 'leafy-sea-dragon',
    name: 'Leafy Sea Dragon',
    scientificName: 'Phycodurus eques',
    description: 'Incredibly camouflaged relative of the seahorse.',
    habitat: 'Kelp forests and seagrass beds',
    diet: 'Small crustaceans, plankton',
    conservationStatus: 'Near Threatened',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 5,
    funFact: 'Leafy sea dragons are so well camouflaged they look exactly like floating seaweed!',
    size: '20-24 cm',
    depth: '3-50 meters'
  },
  {
    id: 'anglerfish',
    name: 'Anglerfish',
    scientificName: 'Lophiiformes',
    description: 'Deep-sea predator with bioluminescent lure.',
    habitat: 'Deep ocean waters',
    diet: 'Fish, crustaceans',
    conservationStatus: 'Least Concern',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    difficultyLevel: 5,
    funFact: 'Male anglerfish are much smaller and permanently attach to females!',
    size: '2.5 cm - 1 meter',
    depth: '200-2,000 meters'
  }
];

export const getSpeciesByDifficulty = (difficulty: number): MarineSpecies[] => {
  return marineSpeciesData.filter(species => species.difficultyLevel <= difficulty);
};

export const getRandomSpecies = (count: number, maxDifficulty: number = 5): MarineSpecies[] => {
  const availableSpecies = getSpeciesByDifficulty(maxDifficulty);
  const shuffled = [...availableSpecies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

import { collection, getDocs, doc, getDoc, type Firestore, Timestamp, writeBatch } from "firebase/firestore";
import type { PortfolioData, HeroData, AboutData, Skill, ExperienceItem, Project, Testimonial } from "./types";
import sampleData from '../../sample-data.json';

// Helper to convert Firestore Timestamps to JS Date objects
const convertTimestamps = (data: any) => {
  if (!data) return data;
  const newData = { ...data };
  for (const key in newData) {
    if (newData[key] instanceof Timestamp) {
      newData[key] = newData[key].toDate();
    } else if (typeof newData[key] === 'object' && newData[key] !== null) {
      // Recursively convert timestamps in nested objects
      newData[key] = convertTimestamps(newData[key]);
    }
  }
  return newData;
};

// Seeds a collection from fallback data if it's empty
async function seedCollection(db: Firestore, collectionName: string, fallbackData: any[]) {
    console.log(`Seeding collection: ${collectionName}`);
    const batch = writeBatch(db);
    fallbackData.forEach(item => {
        const newDocRef = doc(collection(db, collectionName));
        batch.set(newDocRef, item);
    });
    await batch.commit();
    console.log(`Successfully seeded ${collectionName} with ${fallbackData.length} items.`);
}


export async function getCollectionData<T>(db: Firestore, collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    if (querySnapshot.empty) {
      console.warn(`No documents found in ${collectionName} collection. Seeding from local data.`);
      // @ts-ignore
      const fallbackData = sampleData.__collections__.portfolio_content.main[collectionName] || [];
      if (fallbackData.length > 0) {
        await seedCollection(db, collectionName, fallbackData);
        // Re-fetch the data after seeding
        const seededSnapshot = await getDocs(collection(db, collectionName));
        return seededSnapshot.docs.map(doc => {
            const data = doc.data();
            const dataWithConvertedTimestamps = convertTimestamps(data);
            return { id: doc.id, ...dataWithConvertedTimestamps } as T & { id: string };
        });
      }
      return []; // Return empty if no fallback data either
    }
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const dataWithConvertedTimestamps = convertTimestamps(data);
      return { id: doc.id, ...dataWithConvertedTimestamps } as T & { id: string };
    });
  } catch (error) {
    console.error(`Error getting ${collectionName}, falling back to local data:`, error);
    // @ts-ignore
    const fallbackData = sampleData.__collections__.portfolio_content.main[collectionName] || [];
    return fallbackData.map((item: any, index: number) => (
        { ...convertTimestamps(item), id: `local-${index}` }
    )) as T[];
  }
}

export async function getPortfolioData(db: Firestore): Promise<PortfolioData | null> {
  const fallbackData = sampleData.__collections__.portfolio_content.main;

  try {
    const userConfigDocRef = doc(db, "user_config", "main");
    let userConfigDoc = await getDoc(userConfigDocRef);
    
    let hero: HeroData;
    let about: AboutData;

    if (!userConfigDoc.exists()) {
        console.log("No user_config document in Firestore, seeding from local fallback.");
        const heroData = fallbackData.hero;
        const aboutData = fallbackData.about;
        const mainConfigData = {
            heroText: heroData.name,
            heroSubtitle: heroData.subtitle,
            aboutSection: aboutData.paragraph,
        };
        // Use a batch to be safe, though it's a single doc
        const batch = writeBatch(db);
        batch.set(userConfigDocRef, mainConfigData);
        await batch.commit();
        console.log("Successfully seeded user_config.");
        // Re-fetch the doc after seeding
        userConfigDoc = await getDoc(userConfigDocRef);
    }
    
    const userConfigData = userConfigDoc.data();
    hero = {
        name: userConfigData?.heroText || fallbackData.hero.name,
        subtitle: userConfigData?.heroSubtitle || fallbackData.hero.subtitle,
    };
    about = {
        paragraph: userConfigData?.aboutSection || fallbackData.about.paragraph
    };
    
    const [skills, experience, projects, testimonials] = await Promise.all([
      getCollectionData<Skill>(db, "skills"),
      getCollectionData<ExperienceItem>(db, "work_experience"),
      getCollectionData<Project>(db, "projects"),
      getCollectionData<Testimonial>(db, "testimonials"),
    ]);

    return {
      hero,
      about,
      skills,
      experience,
      projects,
      testimonials,
    };

  } catch (error) {
    console.error("Error getting portfolio data, falling back to local sample data:", error);
    return convertTimestamps(fallbackData) as PortfolioData;
  }
}

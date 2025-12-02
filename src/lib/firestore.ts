
import { collection, getDocs, doc, getDoc, type Firestore } from "firebase/firestore";
import type { PortfolioData, HeroData, AboutData, Skill, ExperienceItem, Project, Testimonial } from "./types";
import sampleData from '../../sample-data.json';

async function getCollectionData<T>(db: Firestore, collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.empty) {
      console.warn(`No documents found in ${collectionName} collection. Falling back to local data for this collection.`);
      // @ts-ignore
      return (sampleData.__collections__.portfolio_content.main[collectionName] || []) as T[];
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    // @ts-ignore
    return (sampleData.__collections__.portfolio_content.main[collectionName] || []) as T[];
  }
}

export async function getPortfolioData(db: Firestore): Promise<PortfolioData | null> {
  const fallbackData = sampleData.__collections__.portfolio_content.main;

  try {
    const userConfigDoc = await getDoc(doc(db, "user_config", "main"));
    
    let hero: HeroData = fallbackData.hero;
    let about: AboutData = fallbackData.about;

    if (userConfigDoc.exists()) {
      const userConfigData = userConfigDoc.data();
      hero = {
          name: userConfigData?.heroText || fallbackData.hero.name,
          subtitle: userConfigData?.heroSubtitle || fallbackData.hero.subtitle,
      };
      about = {
          paragraph: userConfigData?.aboutSection || fallbackData.about.paragraph
      };
    } else {
        console.log("No user_config document in Firestore, using local fallback for hero and about.");
    }
    
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
    return fallbackData as PortfolioData;
  }
}

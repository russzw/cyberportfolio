import { collection, getDocs, doc, getDoc, type Firestore } from "firebase/firestore";
import type { PortfolioData, HeroData, AboutData, Skill, ExperienceItem, Project, Testimonial } from "./types";

async function getCollectionData<T>(db: Firestore, collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    return [];
  }
}

export async function getPortfolioData(db: Firestore): Promise<PortfolioData | null> {
  try {
    const userConfigDoc = await getDoc(doc(db, "user_config", "main"));
    
    if (!userConfigDoc.exists()) {
      console.log("No user_config document in Firestore!");
      // Fallback to sample-data.json if firestore is empty
      const sampleData = await import("../../../sample-data.json");
      return sampleData.__collections__.portfolio_content.main as PortfolioData;
    }

    const userConfigData = userConfigDoc.data();

    const hero: HeroData = {
        name: userConfigData?.heroText || "Your Name",
        subtitle: userConfigData?.aboutSection ? "" : "Your subtitle" 
    };

    const about: AboutData = {
        paragraph: userConfigData?.aboutSection || ""
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
    console.error("Error getting portfolio data:", error);
     try {
      const sampleData = await import("../../../sample-data.json");
      console.log("Falling back to local sample data.");
      return sampleData.__collections__.portfolio_content.main as PortfolioData;
    } catch (sampleError) {
      console.error("Error loading fallback sample data:", sampleError);
      return null;
    }
  }
}

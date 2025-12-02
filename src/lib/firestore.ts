import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { PortfolioData } from "./types";

export async function getPortfolioData(): Promise<PortfolioData | null> {
  try {
    const docRef = doc(db, "portfolio_content", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    } else {
      console.log("No such document in Firestore!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

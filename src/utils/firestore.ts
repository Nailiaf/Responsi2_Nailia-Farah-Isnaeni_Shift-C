import { auth, db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';


// Interface untuk Recipe
export interface Recipe {
  id?: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const firestoreService = {
  // Referensi ke koleksi "recipes" di Firestore
  getRecipeRef() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');
    return collection(db, 'users', uid, 'recipes');
  },

  // Tambah Recipe baru
  async addRecipe(recipe: Omit<Recipe, 'id'>) {
    const recipeRef = this.getRecipeRef();
    const docRef = await addDoc(recipeRef, {
      ...recipe,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Ambil semua Recipe
  async getRecipes(): Promise<Recipe[]> {
    const recipeRef = this.getRecipeRef();
    const q = query(recipeRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recipe));
  },

  // Update Recipe berdasarkan ID
  async updateRecipe(id: string, recipe: Partial<Recipe>) {
    const recipeRef = this.getRecipeRef();
    const docRef = doc(recipeRef, id);
    await updateDoc(docRef, {
      ...recipe,
      updatedAt: Timestamp.now(),
    });
  },

  // Hapus Recipe berdasarkan ID
  async deleteRecipe(id: string) {
    const recipeRef = this.getRecipeRef();
    const docRef = doc(recipeRef, id);
    await deleteDoc(docRef);
  },

  // Ambil Recipe berdasarkan ID
  async getRecipeById(id: string): Promise<Recipe | null> {
    const recipeRef = this.getRecipeRef();
    const docRef = doc(recipeRef, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Recipe;
    } else {
      return null;
    }
  },
};

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Recipes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <InputModal 
        v-model:isOpen="isOpen" 
        v-model:editingId="editingId" 
        :recipe="recipe" 
        @submit="handleSubmit" 
      />

      <ion-modal :is-open="detailsOpen" @did-dismiss="closeDetails">
        <ion-header>
          <ion-toolbar>
            <ion-title>Recipe Details</ion-title>
            <ion-buttons slot="end">
              <ion-button color="primary" @click="closeDetails">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <h2>{{ selectedRecipe?.name }}</h2>
          <div v-if="selectedRecipe?.description">
            <!-- Memecah deskripsi berdasarkan baris baru dan menampilkannya sebagai list -->
            <ul>
              <li v-for="(item, index) in selectedRecipe.description.split('\n')" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </ion-content>
      </ion-modal>
      <ion-list>
        <ion-item-sliding v-for="recipe in recipes" :key="recipe.id">
          <ion-item @click="openDetails(recipe)">
            <ion-label>
              <h2>{{ recipe.name }}</h2>
              <div v-if="recipe.description">
                <ul>
                  <!-- Tampilkan deskripsi sebagai list -->
                  <li v-for="(item, index) in recipe.description.split('\n')" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </ion-label>
          </ion-item>
          <ion-item-options side="start">
            <ion-item-option color="danger" @click="handleDelete(recipe)">
              <ion-icon :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
          <ion-item-options side="end">
            <ion-item-option @click="handleEdit(recipe)">
              <ion-icon :icon="create"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonLabel } from '@ionic/vue';
import { add, create, trash } from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { firestoreService, type Recipe } from '@/utils/firestore';

const isOpen = ref(false);
const detailsOpen = ref(false);
const editingId = ref<string | null>(null);
const recipe = ref<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  description: '',
});
const recipes = ref<Recipe[]>([]);
const selectedRecipe = ref<Recipe | null>(null);

const loadRecipes = async () => {
  recipes.value = await firestoreService.getRecipes(); // Load recipes
};

onMounted(() => {
  loadRecipes();
});

const handleRefresh = async (event: any) => {
  await loadRecipes();
  event.target.complete();
};

const handleSubmit = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingId.value) {
    await firestoreService.updateRecipe(editingId.value, recipeData);
  } else {
    await firestoreService.addRecipe(recipeData);
  }
  loadRecipes();
  isOpen.value = false;
};

const handleEdit = (selectedRecipe: Recipe) => {
  editingId.value = selectedRecipe.id!;
  recipe.value = { 
    name: selectedRecipe.name, 
    description: selectedRecipe.description 
  }; // Isi form dengan data yang akan diedit
  isOpen.value = true; // Buka modal
};

const handleDelete = async (recipe: Recipe) => {
  await firestoreService.deleteRecipe(recipe.id!);
  loadRecipes();
};

const openAddModal = () => {
  editingId.value = null;
  recipe.value = { name: '', description: '', }; // Reset form for add
  isOpen.value = true;
};

const openDetails = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  detailsOpen.value = true;
};

const closeDetails = () => {
  detailsOpen.value = false;
  selectedRecipe.value = null;
};
</script>


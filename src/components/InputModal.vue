<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? 'Edit' : 'Add' }} Recipe</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="recipe.name" label="Recipe" label-placement="floating" placeholder="Add Recipe"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea v-model="recipe.description" label="Description" label-placement="floating" placeholder="Add description" :autogrow="true" :rows="3"></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button type="button" @click="submitForm" shape="round" color="primary" expand="block">
            {{ editingId ? 'Edit' : 'Add' }} Recipe
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonInput, IonRow, IonCol, IonItem, IonContent, IonTextarea, IonDatetime } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  editingId: String | null,
  recipe: Object,
});

const emit = defineEmits(['update:isOpen', 'update:editingId', 'submit']);

const cancel = () => {
  emit('update:isOpen', false);
  emit('update:editingId', null);
  resetRecipe();
};


const submitForm = () => {
  emit('submit', props.recipe);
  cancel();
};

const resetRecipe = () => {
  props.recipe.name = '';
  props.recipe.description = '';
  props.recipe.schedule = '';
  props.recipe.details = '';
};

watch(
  () => props.editingId,
  async (newEditingId) => {
    if (!newEditingId) resetRecipe();
  },
  { immediate: true }
);
</script>



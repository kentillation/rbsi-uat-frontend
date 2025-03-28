<template>
  <v-container>
    <div class="d-flex align-items-center">
      <v-icon @click="goBack" class="mt-2 me-3" size="x-large" icon="mdi-chevron-double-left" title="Back"></v-icon>
      <h1>Extracted OCR Content</h1>
    </div>
    <p class="text-teal-darken-3">{{ extractedText }}</p>
  </v-container>
</template>

<script>
import { useOcrStore } from "@/stores/ocrStore";

export default {
  name: 'OCR',
  setup() {
    const ocrStore = useOcrStore();
    return { ocrStore };
  },
  computed: {
    extractedText() {
      return this.ocrStore.extractedText || "No content available."; // ✅ Get from Pinia
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
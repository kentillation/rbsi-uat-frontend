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
export default {
  name: 'OCR',
  computed: {
    extractedText() {
      return this.$route.query.text || "No content available.";
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
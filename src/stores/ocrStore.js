import { defineStore } from "pinia";

export const useOcrStore = defineStore("ocr", {
  state: () => ({
    extractedText: "",
  }),
  actions: {
    setExtractedText(text) {
      this.extractedText = text;
    },
  },
});

<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>OCR</h1>
        <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
            rounded>
            <div class="w-75 mt-15">
                <v-file-input label="Upload Document" v-model="selectedFile" accept=".pdf, .docx"></v-file-input>
                <v-btn @click="handleFileUpload" prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2" size="large"
                    rounded>
                    <v-progress-circular v-if="validating" size="20" color="white" indeterminate />
                    <span v-else>Extract</span>
                </v-btn>
            </div>
        </v-sheet>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import mammoth from "mammoth";
import Snackbar from "@/components/Snackbar.vue";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { useOcrStore } from "@/stores/ocrStore";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
).toString();

export default {
    name: "OCR",
    components: {
        Snackbar,
    },
    data() {
        return {
            validating: false,
            selectedFile: null,
        };
    },
    setup() {
        const ocrStore = useOcrStore();
        return { ocrStore }; // Ensure ocrStore is returned for use in the template or methods
    },
    methods: {
        async handleFileUpload() {
            if (!this.selectedFile) {
                alert("Please select a file first.");
                return;
            }
            this.validating = true;
            const file = this.selectedFile;
            if (file.type === "application/pdf") {
                await this.extractPdfText(file);
            } else if (
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                await this.extractDocxText(file);
            } else {
                alert("Unsupported file type");
            }
            console.log("Selected File:", this.selectedFile);
            console.log("File Type:", this.selectedFile?.type);
            this.validating = false;
        },
        async extractPdfText(file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
                let text = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item) => item.str).join(" ") + "\n";
                }

                this.ocrStore.setExtractedText(text); // Ensure ocrStore is accessed correctly
                this.$router.push({ name: "OCR-textview" });
                this.$refs.snackbarRef.showSnackbar("Text extracted successfully!");
                this.$emit("textExtracted", text);
            };
        },
        async extractDocxText(file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                const result = await mammoth.extractRawText({ arrayBuffer: reader.result });
                this.ocrStore.setExtractedText(result.value); // Ensure ocrStore is accessed correctly
                this.$router.push({ name: "OCR-textview" });
                this.$refs.snackbarRef.showSnackbar("Text extracted successfully!");
                this.$emit("textExtracted", result.value);
            };
        },
    },
};
</script>
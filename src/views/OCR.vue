<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>OCR</h1>
        <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
            rounded>
            <div class="d-flex justify-end w-100">
                <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" size="large">OCR</v-btn>
            </div>
            <div class="w-75 mt-10">
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
            selectedFile: null, // Store uploaded file
        };
    },
    methods: {
        async handleFileUpload() {
            if (!this.selectedFile) {
                alert("Please select a file first.");
                return;
            }

            this.validating = true; // Show loading indicator

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
            this.validating = false; // Hide loading indicator
        },

        async extractPdfText(file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                console.log("PDF file successfully read!"); // Debugging log

                const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
                let text = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item) => item.str).join(" ") + "\n";
                }

                console.log("Extracted text:", text); // Debugging log
                this.$router.push({ name: "OCR-textview", query: { text } });
            };
        },
        async extractDocxText(file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                const result = await mammoth.extractRawText({ arrayBuffer: reader.result });
                this.$router.push({ name: "OCR-textview", query: { text: result.value } });
            };
        },
    },
};
</script>

<style scoped>
.to-hide {
    display: none;
}
</style>
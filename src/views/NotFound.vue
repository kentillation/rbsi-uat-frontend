<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
            rounded>
            <div class="w-75 mt-15">
                <v-icon class="mdi-web-off"></v-icon>
                <h1>Page not found!</h1>
            </div>
        </v-sheet>
    </v-container>
</template>

<script>
export default {
    name: "NotFound",
};
</script>
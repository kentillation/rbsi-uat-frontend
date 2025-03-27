<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
            rounded>
            <div class="w-50 mt-15">
                <v-icon icon="mdi-lock-alert-outline" size="x-large" class="text-red-darken-2 mb-5"></v-icon>
                <h2 class="text-red-darken-2">You do not have permission to perform this action.</h2>
            </div>
        </v-sheet>
    </v-container>
</template>

<script>
export default {
    name: "ForbiddenPage",
};
</script>
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-sheet class="d-flex flex-column align-center text-center mx-auto mt-10" elevation="4" height="250" width="100%"
            rounded>
            <div class="w-50 mt-5">
                <v-icon :size="iconSize" icon="mdi-lock-alert-outline" class="text-red-darken-2 mb-3"></v-icon>
                <h2 class="text-red-darken-2 mb-3">Unauthenticated!</h2>
                <h4 class="mb-3">You do not have permission to perform this action.</h4>
            </div>
        </v-sheet>
    </v-container>
</template>

<script>
export default {
    name: "ForbiddenPage",
    data() {
        return {
            iconSize: "70px",
        };
    },
};
</script>
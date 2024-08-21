<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h1>Home</h1>
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    data () {
        return {
            snackbar: {
                visible: false,
                message: '',
                color: ''
            }
        }
    },
    methods: {
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        },
        handleAltTab(event) {
            if (event.altKey && event.key === 'Tab') {
                event.preventDefault();
                this.showSnackbar('Warning: ALT + Tab detected!', 'warning');
                return console.log("ALT + Tab detected!");
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleAltTab);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleAltTab);
    }
};
</script>
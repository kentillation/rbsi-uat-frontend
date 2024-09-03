<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h1>Home</h1>
        <v-row>
            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <div class="d-flex justify-space-around">
                                <v-icon color="teal-darken-2" icon="mdi-account-multiple" size="100"></v-icon>
                                <v-row class="text-center">
                                    <v-col cols="12">
                                        <h3 class="text-light">All Clients</h3>
                                    </v-col>
                                    <v-col cols="12">
                                        <h1 style="font-size: 50px;">10, 000</h1>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <div class="d-flex justify-space-around">
                                <v-icon color="teal-darken-2" icon="mdi-account-multiple" size="100"></v-icon>
                                <v-row class="text-center">
                                    <v-col cols="12">
                                        <h3 class="text-success">Active Clients</h3>
                                    </v-col>
                                    <v-col cols="12">
                                        <h1 style="font-size: 50px;">3, 000</h1>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <div class="d-flex justify-space-around">
                                <v-icon color="teal-darken-2" icon="mdi-account-multiple" size="100"></v-icon>
                                <v-row class="text-center">
                                    <v-col cols="12">
                                        <h3 class="text-red">Inactive Clients</h3>
                                    </v-col>
                                    <v-col cols="12">
                                        <h1 style="font-size: 50px;">6, 000</h1>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
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
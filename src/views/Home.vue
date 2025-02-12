<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h1>Home</h1>
        <v-row>
            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                <v-card>
                    <v-card-text>
                        <div class="d-flex justify-space-around">
                            <v-icon color="teal-darken-2" icon="mdi-account-multiple" size="100"></v-icon>
                            <v-row class="text-center">
                                <v-col cols="12">
                                    <h3 class="text-light">All Clients</h3>
                                </v-col>
                                <v-col cols="12">
                                    <h1 style="font-size: 40px;">10, 000</h1>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="text-center">
                            <v-btn @click="toAllClients" append-icon="mdi-eye-outline" class="bg-teal-darken-4 mt-4 me-4 px-5"
                                rounded>View</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                <v-card>
                    <v-card-text>
                        <div class="d-flex justify-space-around">
                            <v-icon color="teal-darken-2" icon="mdi-account-multiple" size="100"></v-icon>
                            <v-row class="text-center">
                                <v-col cols="12">
                                    <h3 class="text-success">Active Clients</h3>
                                </v-col>
                                <v-col cols="12">
                                    <h1 style="font-size: 40px;">3, 000</h1>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="text-center">
                            <v-btn append-icon="mdi-eye-outline" class="bg-teal-darken-4 mt-4 me-4 px-5"
                                rounded>View</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                <v-card>
                    <v-card-text>
                        <div class="d-flex justify-space-around">
                            <v-icon color="teal-darken-2" icon="mdi-account-multiple" size="100"></v-icon>
                            <v-row class="text-center">
                                <v-col cols="12">
                                    <h3 class="text-warning">Inactive Clients</h3>
                                </v-col>
                                <v-col cols="12">
                                    <h1 style="font-size: 40px;">6, 000</h1>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="text-center">
                            <v-btn append-icon="mdi-eye-outline" class="bg-teal-darken-4 mt-4 me-4 px-5"
                                rounded>View</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-sheet>
            <v-card class="mx-auto py-4 my-5 text-center" max-width="1000" dark>
                <v-card-text>
                    <v-sheet color="rgba(0, 0, 0, .12)">
                        <v-sparkline :model-value="value" :fill="fill" :line-width="lineWidth"
                            :gradient="['#968700', '#335f97', '#0146a1', '#34da25', '#019c9c']" height="100"
                            padding="24" stroke-linecap="round" smooth>
                            <template v-slot:label="item">
                                {{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.value) }}
                            </template>
                        </v-sparkline>
                    </v-sheet>
                </v-card-text>

                <v-card-text>
                    <div class="text-h4 font-weight-thin">
                        Income from last 24h
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-center">
                    <v-btn append-icon="mdi-file-outline" class="bg-teal-darken-4 mt-4 me-4 px-5" size="large"
                        rounded>Go to
                        Reports</v-btn>
                </v-card-actions>
            </v-card>
        </v-sheet>

        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import Snackbar from '@/components/Snackbar.vue';
export default {
    components: {
        Snackbar
    },
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    data() {
        return {
            snackbar: {
                visible: false,
                message: '',
                color: ''
            },
            fill: true,
            lineWidth: 1,
            value: [
                69312,
                44634,
                87556,
                51078,
                109090,
                81012,
            ],
        }
    },
    methods: {
        toAllClients() {
            this.$router.push({ name: 'AllClients' });
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
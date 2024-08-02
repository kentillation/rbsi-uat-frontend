<template>
    <v-container>
        <h1>New Client</h1>
        <v-form @submit.prevent="new_client_form" ref="form">
            <v-container>
                <v-sheet elevation="3" rounded="lg">
                    <v-card>
                        <v-card-text>
                            <v-card border="opacity-50 sm" class="mb-5">
                                <v-container>
                                    <h3 class="mb-4">Basic Information</h3>
                                    <v-row justify="center">
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-autocomplete 
                                                v-model="type" 
                                                :rules="[typeRule]" 
                                                label="Type"
                                                :items="typeItems"
                                                item-text="description"
                                                item-value="id">
                                            </v-autocomplete>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-sheet>
            </v-container>
            <v-container>
                <div class="text-right">
                    <v-btn 
                        :disabled="!isFormValid || validating" 
                        color="white" 
                        type="submit" 
                        block
                        class="bg-orange-darken-4 mb-8" 
                        size="large" 
                        variant="tonal" 
                        :loading="validating" 
                        height="40"
                        width="135" 
                        rounded>
                        Proceed
                    </v-btn>
                </div>
            </v-container>
        </v-form>
        <v-snackbar 
            v-model="snackbar.visible" 
            :color="snackbar.color" 
            top>
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
    name: 'NewContact',
    data() {
        return {
            type: '',
            typeItems: [],
            typeRule: (v) => !!v || 'Type is required',
            validating: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            }
        };
    },
    computed: {
        isFormValid() {
            return this.$refs.form.validate();
        }
    },
    methods: {
        async fetchTypeItems() {
            try {
                const response = await apiClient.get('/api/types'); // Adjust this endpoint as needed
                this.typeItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch type items';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async new_client_form() {
            if (!this.isFormValid) return;
            this.validating = true;
            try {
                const payload = {
                    type: this.type,
                };
                await apiClient.post('/api/clients', payload); // Adjust this endpoint as needed
                this.snackbar.message = 'Client created successfully';
                this.snackbar.color = 'success';
                this.snackbar.visible = true;
                this.$refs.form.reset();
            } catch (error) {
                this.snackbar.message = 'Failed to create client';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            } finally {
                this.validating = false;
            }
        }
    },
    mounted() {
        this.fetchTypeItems();
    }
};
</script>

<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Clients Masterlist</h1>
        <v-data-table :headers="headers" :items="filteredClients" :loading="loading" class="elevation-1">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <v-row>
                            <v-col cols="12" lg="6" md="6" sm="12">
                                <v-text-field v-model="search_item" label="Type CID or last name..."
                                    class="pt-5"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <div class="text-right">
                        <v-btn :disabled="loading" append-icon="mdi-refresh" class="me-3 pe-7" variant="outlined"
                            @click="onRefresh"></v-btn>
                    </div>
                </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
                <div class="text-center">
                    <v-btn size="small" @click="viewItem(item)" class="bg-blue" prepend-icon="mdi-eye">View</v-btn>
                </div>
            </template>
        </v-data-table>

        <!-- Dialog for viewing client details -->
        <v-dialog v-model="dialogSingle" transition="dialog-bottom-transition" max-width="1000px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Client Details</span>
                </v-card-title>
                <ClientDataMixin :client="selectedClient" :skeletonLoader="skeletonLoader" :imageCard="imageCard"
                    :imageSrc="imageSrc" :typeItems="typeItems" :titleItems="titleItems"
                    :clientstatusItems="clientstatusItems" :genderItems="genderItems"
                    :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems" :undefItems="undefItems"
                    :entityItems="entityItems" :employmentItems="employmentItems" :taxcodeItems="taxcodeItems" />

                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" @click="dialogSingle = false"
                        rounded>Close</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-pencil" @click="toEditClientInfo"
                        rounded>Edit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import apiClient from '../axios';
import dataMixins from '@/mixins/dataMixins';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
    mixins: [dataMixins],
    components: {
        ClientDataMixin
    },
    name: 'AllClients',
    data() {
        return {
            client_info: [],
            dialogSingle: false,
        };
    },
    mounted() {
        this.fetchClientInfo();
        if (this.$route.query.search) {
            this.search_item = this.$route.query.search;
        }
    },
    beforeUnmount() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }
    },
    watch: {
        'selectedClient.image_file': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.fetchClientImage(newValue);
                }
            },
        },
    },
    computed: {
        filteredClients() {
            const searchTerm = this.search_item.toLowerCase();
            return this.client_info.filter((client) => {
                return (
                    client.cid.toString().includes(searchTerm) ||
                    client.first_name.toLowerCase().includes(searchTerm) ||
                    client.middle_name.toLowerCase().includes(searchTerm) ||
                    client.last_name.toLowerCase().includes(searchTerm)
                );
            });
        },
    },
    methods: {
        async fetchClientInfo() {
            try {
                const response = await apiClient.get('/client_info', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.client_info = response.data.map(client => ({
                    ...client,
                    created_at: this.formatDate(client.created_at),
                    updated_at: this.formatDate(client.updated_at)
                    // fullName: `${client.last_name}, ${client.first_name} ${client.middle_name}`.trim(),
                }));
            } catch (error) {
                console.error('Error fetching client_info:', error);
            } finally {
                this.loading = false;
            }
        },
        onRefresh() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.fetchClientInfo()
            }, 2000)
        },
    }
};
</script>

<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Clients Information</h1>
        <v-data-table :headers="headers" :items="client_info" :loading="loading" density="compact"
            class="elevation-1">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>List of Clients Information</v-toolbar-title>
                    <v-btn prepend-icon="mdi-plus" text class="bg-teal-darken-3" @click="toNewClient">Open New Contact</v-btn>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <div class="text-right">
                        <v-btn :disabled="loading" prepend-icon="mdi-refresh" class="me-3 ps-7" variant="outlined"
                            @click="onRefresh"></v-btn>
                    </div>
                </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
                <v-btn size="x-small" icon @click="viewItem(item)" class="bg-blue">
                    <v-icon size="small">mdi-eye</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
    name: 'ClientInfo',
    data() {
        return {
            loading: true,
            client_info: [],
            headers: [
                { title: 'Last Name', value: 'last_name', sortable: false },
                { title: 'First Name', value: 'first_name', sortable: false },
                { title: 'Middle Name', value: 'middle_name', sortable: false },
                { title: 'Client Name', value: 'fullName', sortable: true },
                { title: 'Created At', value: 'created_at', sortable: true },
                { title: 'Updated At', value: 'updated_at', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            dialog: false,
            selectedClient: null
        };
    },
    mounted() {
        this.fetchClientInfo();
    },
    methods: {
        async fetchClientInfo() {
            try {
                const response = await apiClient.get('http://127.0.0.1:8000/api/client_info', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.client_info = response.data.map(client => ({
                    ...client,
                    fullName: `${client.last_name}, ${client.first_name} ${client.middle_name}`.trim(),
                    // FullAddress: `${client.Line1}, ${client.Line2} ${client.Line3}`.trim()
                }));
            } catch (error) {
                console.error('Error fetching client_info:', error);
            } finally {
                this.loading = false;
            }
        },
        toNewClient() {
            this.$router.push({ name: 'NewClient' });
        },
        onRefresh() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 2000)
        },
        viewItem(item) {
            this.selectedClient = item;
            console.log('View item:', item);
        }
    }
};
</script>

<style>
tbody .v-data-table__td {
    color: #006e53;
}
</style>

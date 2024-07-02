<template>
    <v-container>
        <v-row justify="center" class="mb-4">
            <v-btn @click="home">Home</v-btn>
            <v-btn @click="logout">Logout</v-btn>
        </v-row>

        <v-data-table :headers="headers" :items="customer_info" :loading="loading" density="compact" class="elevation-1">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Customer Information</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <div class="text-right">
                        <v-btn :disabled="loading" prepend-icon="mdi-refresh" class="me-3" text="Refresh" variant="outlined"
                            @click="onClick"></v-btn>
                    </div>
                </v-toolbar>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
    name: 'CustomerInfo',
    data() {
        return {
            loading: true,
            customer_info: [],
            headers: [
                { title: 'CID', value: 'CID', sortable: false },
                { title: 'Customer Name', value: 'FullName', sortable: true },
                { title: 'Birth date', value: 'BirthDate', sortable: true },
                { title: 'Mobile #', value: 'Mobile1', sortable: true },
                { title: 'Email', value: 'Email1', sortable: true },
            ],
        };
    },
    mounted() {
        this.fetchCustomerInfo();
    },
    methods: {
        async fetchCustomerInfo() {
            try {
                const response = await apiClient.get('http://127.0.0.1:8000/api/customer-info', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.customer_info = response.data.map(customer => ({
                    ...customer,
                    FullName: `${customer.Name1} ${customer.Name2} ${customer.Name3}`.trim()
                }));
            } catch (error) {
                console.error('Error fetching customer_info:', error);
            } finally {
                this.loading = false;
            }
        },
        async home() {
            try {
                this.$router.push('/home');
            } catch (error) {
                console.error('Error accessing home:', error);
            }
        },
        async logout() {
            try {
                await apiClient.post('/logout', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                localStorage.removeItem('auth_token');
                this.$router.push('/');
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
        onClick() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 2000)
        },
    }
};
</script>

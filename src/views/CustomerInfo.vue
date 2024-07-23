<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Customers Information</h1>
        <v-data-table :headers="headers" :items="customer_info" :loading="loading" density="compact"
            class="elevation-1">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>List of Customers Information</v-toolbar-title>
                    <v-btn prepend-icon="mdi-plus" text class="bg-teal-darken-3" @click="toNewContact">Open New Contact</v-btn>
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
    name: 'CustomerInfo',
    data() {
        return {
            loading: true,
            customer_info: [],
            headers: [
                { title: 'CID', value: 'CID', sortable: false },
                { title: 'Customer Name', value: 'FullName', sortable: true },
                { title: 'Birth date', value: 'BirthDate', sortable: true },
                { title: 'Mobile No.', value: 'Mobile1', sortable: true },
                { title: 'Address', value: 'FullAddress', sortable: true },
                { title: 'Email', value: 'Email1', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            dialog: false,
            selectedCustomer: null
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
                    FullName: `${customer.Name2} ${customer.Name3} ${customer.Name1}`.trim(),
                    FullAddress: `${customer.Line1}, ${customer.Line2} ${customer.Line3}`.trim()
                }));
            } catch (error) {
                console.error('Error fetching customer_info:', error);
            } finally {
                this.loading = false;
            }
        },
        toNewContact() {
            this.$router.push({ name: 'NewContact' });
        },
        onRefresh() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 2000)
        },
        viewItem(item) {
            this.selectedCustomer = item;
            console.log('View item:', item);
        }
    }
};
</script>

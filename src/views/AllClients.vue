<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Clients Masterlist</h1>
        <v-data-table :headers="headers" :items="filteredClients" :loading="loading" density="compact"
            class="elevation-1">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <v-row>
                            <v-col cols="12" lg="6" md="6" sm="12">
                                <v-text-field v-model="search_item" label="Type CID or last name..." class="pt-5"></v-text-field>
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
                <v-btn size="x-small" icon @click="viewItem(item)" class="bg-blue">
                    <v-icon size="small">mdi-eye</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Dialog for viewing client details -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Client Details</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">CID: </span>{{ selectedClient?.cid }}</p>
                                <p><span class="text-grey-lighten-1">First Name: </span>{{ selectedClient?.first_name }}
                                </p>
                                <p><span class="text-grey-lighten-1">Middle Name: </span>{{ selectedClient?.middle_name
                                    }}</p>
                                <p><span class="text-grey-lighten-1">Last Name: </span>{{ selectedClient?.last_name }}
                                </p>
                                <p><span class="text-grey-lighten-1">Type: </span>{{ getTitle(selectedClient?.type, typeItems, 'type') }} </p>
                                <p><span class="text-grey-lighten-1">Title: </span>{{ getTitle(selectedClient?.title,
                                    titleItems, 'title') }}</p>
                                <p><span class="text-grey-lighten-1">Client Status: </span>{{
                                    getTitle(selectedClient?.client_status, clientstatusItems, 'client_status') }}</p>
                                <p><span class="text-grey-lighten-1">Initial: </span>{{ selectedClient?.initial }}</p>
                                <p><span class="text-grey-lighten-1">Display Name: </span>{{
                                    selectedClient?.display_name }}</p>
                                <p><span class="text-grey-lighten-1">Staff or Not: </span>{{
                                    selectedClient?.staff_or_not ? 'Yes' : 'No' }}</p>
                                <p><span class="text-grey-lighten-1">TIN: </span>{{ selectedClient?.tin }}</p>
                                <p><span class="text-grey-lighten-1">Gender: </span>{{ getTitle(selectedClient?.gender,
                                    genderItems, 'gender') }}</p>
                                <p><span class="text-grey-lighten-1">Civil Status: </span>{{
                                    getTitle(selectedClient?.civil_status, civilstatusItems, 'civil_status') }}</p>
                                <p><span class="text-grey-lighten-1">Birthdate: </span>{{ selectedClient?.birthdate ?
                                    formatDate(selectedClient?.birthdate) : 'N/A' }}</p>
                                <p><span class="text-grey-lighten-1">Mobile 1: </span>{{ selectedClient?.mobile1 }}</p>
                                <p><span class="text-grey-lighten-1">Mobile 2: </span>{{ selectedClient?.mobile2 }}</p>
                                <p><span class="text-grey-lighten-1">Email: </span>{{ selectedClient?.email }}</p>
                                <p><span class="text-grey-lighten-1">Nationality: </span>{{ selectedClient?.nationality
                                    }}</p>
                                <p><span class="text-grey-lighten-1">Address Line 1: </span>{{
                                    selectedClient?.address_line1 }}
                                </p>
                                <p><span class="text-grey-lighten-1">Address Line 2: </span>{{
                                    selectedClient?.address_line2 }}
                                </p>
                                <p><span class="text-grey-lighten-1">Address Line 3: </span>{{
                                    selectedClient?.address_line3 }}
                                </p>
                                <p><span class="text-grey-lighten-1">Address Line 4: </span>{{
                                    selectedClient?.address_line4 }}
                                </p>
                                <p><span class="text-grey-lighten-1">Postal Code: </span>{{ selectedClient?.postal_code
                                    }}</p>
                                <p><span class="text-grey-lighten-1">Address Type: </span>{{
                                    getTitle(selectedClient?.address_type, addresstypeItems, 'address_type') }}</p>
                                <p><span class="text-grey-lighten-1">Telephone: </span>{{ selectedClient?.telephone }}
                                </p>
                                <p><span class="text-grey-lighten-1">Fax: </span>{{ selectedClient?.fax }}</p>
                                <p><span class="text-grey-lighten-1">Undefined Field: </span>{{
                                    getTitle(selectedClient?.undef,
                                        undefItems, 'undef') }}</p>
                                <p><span class="text-grey-lighten-1">Entity: </span>{{ getTitle(selectedClient?.entity,
                                    entityItems, 'entity') }}</p>
                                <p><span class="text-grey-lighten-1">Employment: </span>{{
                                    getTitle(selectedClient?.employment,
                                        employmentItems, 'employment') }}</p>
                                <p><span class="text-grey-lighten-1">Customer Language Preference: </span>{{
                                    selectedClient?.cus_lang_pref }}</p>
                                <p><span class="text-grey-lighten-1">Tax Code: </span>{{
                                    getTitle(selectedClient?.tax_code,
                                        taxcodeItems, 'tax_code') }}</p>
                                <p>
                                    <span class="text-grey-lighten-1">Image File: </span>
                                </p>
                                <p>
                                    <img :src="`http://127.0.0.1:8000/api/client_image/${selectedClient?.image_file}`" width="280" alt="Client Image" />
                                </p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="bg-teal-darken-3" text>Edit</v-btn>
                    <v-btn class="bg-red-darken-4" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export class viewItem {
    constructor(item) {
        viewItem(item); {
            this.selectedClient = {
                ...item,
                created_at: this.formatDate(item.created_at),
                updated_at: this.formatDate(item.updated_at)
            };
            this.dialog = true;
        }
    }
}

export default {
    name: 'AllClients',
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
    data() {
        return {
            loading: true,
            search_item: '',
            client_info: [],
            headers: [
                { title: 'CID', value: 'cid', sortable: false },
                { title: 'Last Name', value: 'last_name', sortable: false },
                { title: 'First Name', value: 'first_name', sortable: false },
                { title: 'Middle Name', value: 'middle_name', sortable: false },
                { title: 'Display Name', value: 'display_name', sortable: true },
                { title: 'Created At', value: 'created_at', sortable: true },
                { title: 'Updated At', value: 'updated_at', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            dialog: false,
            selectedClient: null,
            pollingInterval: 5000, // Polling every second
            pollingTimer: null,
            typeItems: [],
            titleItems: [],
            clientstatusItems: [],
            genderItems: [],
            civilstatusItems: [],
            addresstypeItems: [],
            undefItems: [],
            entityItems: [],
            employmentItems: [],
            taxcodeItems: []
        };
    },
    mounted() {
        this.fetchClientInfo();
        this.startPolling();
        // Fill search_item with the query parameter if available
        if (this.$route.query.search) {
            this.search_item = this.$route.query.search;
        }
        this.fetchTypesItems();
        this.fetchTitlesItems();
        this.fetchClientStatusItems();
        this.fetchGenderItems();
        this.fetchCivil_StatusItems();
        this.fetchUndefItems();
        this.fetchEntityItems();
        this.fetchEmploymentItems();
        this.fetchAddressTypeItems();
        this.fetchTaxCodeItems();
    },
    beforeUnmount() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }
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
        async fetchTypesItems() {
            try {
                const response = await apiClient.get('/types', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.typeItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch types';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchTitlesItems() {
            try {
                const response = await apiClient.get('/titles', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.titleItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch titles';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchClientStatusItems() {
            try {
                const response = await apiClient.get('/client_status', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.clientstatusItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch client status';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchGenderItems() {
            try {
                const response = await apiClient.get('/genders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.genderItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch gender';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchCivil_StatusItems() {
            try {
                const response = await apiClient.get('/civil_status', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.civilstatusItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch civil status';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchAddressTypeItems() {
            try {
                const response = await apiClient.get('/address_type', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.addresstypeItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch civil status';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchUndefItems() {
            try {
                const response = await apiClient.get('/undef', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.undefItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch undefined codes';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchEntityItems() {
            try {
                const response = await apiClient.get('/entity', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.entityItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch undefined codes';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchEmploymentItems() {
            try {
                const response = await apiClient.get('/employment', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.employmentItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch undefined codes';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async fetchTaxCodeItems() {
            try {
                const response = await apiClient.get('/tax_code', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.taxcodeItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch undefined codes';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        onRefresh() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.fetchClientInfo()
            }, 2000)
        },
        viewItem(item) {
            this.selectedClient = {
                ...item,
                created_at: this.formatDate(item.created_at),
                updated_at: this.formatDate(item.updated_at)
            };
            this.dialog = true;
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        },
        startPolling() {
            this.pollingTimer = setInterval(() => {
                this.fetchClientInfo();
            }, this.pollingInterval);
        },
        getTitle(id, items, titleKey) {
            const item = items.find(item => item.id === id);
            return item ? item[titleKey] : 'Unknown';
        },
    }
};
</script>

<style>
tbody .v-data-table__td {
    color: #006e53;
}

@media (max-width: 530px) {
    .to-hide {
        display: none;
    }
}
</style>

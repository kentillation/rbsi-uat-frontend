<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Clients Masterlist</h1>
        <v-data-table :headers="headers" :items="filteredClients" :loading="loading"
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
                <div class="text-center">
                    <v-btn size="small" @click="viewItem(item)" class="bg-blue" prepend-icon="mdi-eye">View</v-btn>
                </div>
            </template>
        </v-data-table>

        <!-- Dialog for viewing client details -->
        <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="1000px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Client Details</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <div class="text-center">
                            <v-container class="skeleton-loader">
                                <p>
                                    <v-skeleton-loader v-if="skeletonLoader" type="image" width="240"  height="248" style="border: 1px solid #ccc ;border-radius: 10px;"></v-skeleton-loader>
                                    <img v-if="imageCard" :src="imageSrc" width="241" style="border: 1px solid #ccc ;border-radius: 10px;" alt="Client Image" />
                                </p>
                            </v-container>
                            <h3 class="mb-7"><span class="text-grey-lighten-1">CID: </span>{{ selectedClient?.cid }}</h3>
                        </div>
                        <v-row>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">First Name: </span>{{ selectedClient?.first_name }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Middle Name: </span>{{ selectedClient?.middle_name }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Last Name: </span>{{ selectedClient?.last_name }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Type: </span>{{ getTitle(selectedClient?.type, typeItems, 'type') }} </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Title: </span>{{ getTitle(selectedClient?.title, titleItems, 'title') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Client Status: </span>{{ getTitle(selectedClient?.client_status, clientstatusItems, 'client_status') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Initial: </span>{{ selectedClient?.initial }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Display Name: </span>{{ selectedClient?.display_name }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Staff or Not: </span>{{ staffLabel }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">TIN: </span>{{ selectedClient?.tin }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Gender: </span>{{ getTitle(selectedClient?.gender, genderItems, 'gender') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Civil Status: </span>{{ getTitle(selectedClient?.civil_status, civilstatusItems, 'civil_status') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Birthdate: </span>{{ selectedClient?.birthdate ? formatDate(selectedClient?.birthdate) : 'N/A' }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Mobile 1: </span>{{ selectedClient?.mobile1 }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Mobile 2: </span>{{ selectedClient?.mobile2 }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Email: </span>{{ selectedClient?.email }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Nationality: </span>{{ selectedClient?.nationality }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 1: </span>{{ selectedClient?.address_line1 }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 2: </span>{{ selectedClient?.address_line2 }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 3: </span>{{ selectedClient?.address_line3 }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 4: </span>{{ selectedClient?.address_line4 }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Postal Code: </span>{{ selectedClient?.postal_code }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Type: </span>{{ getTitle(selectedClient?.address_type,
                                addresstypeItems, 'address_type') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Telephone: </span>{{ selectedClient?.telephone }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Fax: </span>{{ selectedClient?.fax }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Undefined Field: </span>{{ getTitle(selectedClient?.undef,
                                undefItems, 'undef') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Entity: </span>{{ getTitle(selectedClient?.entity, entityItems,
                                'entity') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Employment: </span>{{ getTitle(selectedClient?.employment,
                                employmentItems, 'employment') }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Language Preference: </span>{{
                                selectedClient?.cus_lang_pref }}</p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Tax Code: </span>{{ getTitle(selectedClient?.tax_code,
                                taxcodeItems, 'tax_code') }}</p>
                            </v-col>
                            
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" @click="dialog = false" rounded>Close</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-pencil" @click="toEditClientInfo" rounded>Edit</v-btn>
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
    data() {
        return {
            loading: true,
            skeletonLoader: false,
            imageCard: false,
            search_item: '',
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
            selectedClient: null,

            typeItems: [],
            titleItems: [],
            clientstatusItems: [],
            genderItems: [],
            civilstatusItems: [],
            addresstypeItems: [],
            undefItems: [],
            entityItems: [],
            employmentItems: [],
            taxcodeItems: [],

            client_info: [],
            dialog: false,
            pollingInterval: 5000,
            pollingTimer: null
        };
    },
    created() {
        if (this.selectedClient?.image_file) {
        this.fetchClientImage(this.selectedClient.image_file);
        }
    },
    mounted() {
        this.fetchClientInfo();
        this.startPolling();
        if (this.$route.query.search) {
            this.search_item = this.$route.query.search;
        }
        this.fetchItems('/types', 'typeItems');
        this.fetchItems('/titles', 'titleItems');
        this.fetchItems('/client_status', 'clientstatusItems');
        this.fetchItems('/genders', 'genderItems');
        this.fetchItems('/civil_status', 'civilstatusItems');
        this.fetchItems('/address_type', 'addresstypeItems');
        this.fetchItems('/undef', 'undefItems');
        this.fetchItems('/entity', 'entityItems');
        this.fetchItems('/employment', 'employmentItems');
        this.fetchItems('/tax_code', 'taxcodeItems');
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
        staffLabel() {
            return this.selectedClient?.staff_or_not === 1 ? 'Yes' : 'No';
        },
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
        toEditClientInfo() {
            if (this.selectedClient) {
                this.$router.push({
                name: 'EditClientInfo',
                params: {
                    cid: this.selectedClient.cid,
                    last_name: this.selectedClient.last_name,
                },
                });
            }
        },
        async fetchClientImage(imageFileName) {
            try {
                const response = await apiClient.get(`/client_image/${imageFileName}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                responseType: 'blob', // Important for handling binary data
                });

                // Create a blob URL from the response
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                this.imageSrc = URL.createObjectURL(blob);
            } catch (error) {
                console.error('Error fetching client image:', error);
                this.imageSrc = ''; // Handle errors by clearing the image
            }
        },
        async fetchItems(endpoint, key) {
            try {
                const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
                });
                this[key] = response.data;
            } catch (error) {
                this.showSnackbar(`Failed to fetch ${key}`, 'error');
            }
        },
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
        viewItem(item) {
            this.selectedClient = {
                ...item,
                created_at: this.formatDate(item.created_at),
                updated_at: this.formatDate(item.updated_at)
            };
            this.dialog = true;

            this.skeletonLoader = true
            this.imageCard = false
            setTimeout(() => {
                this.skeletonLoader = false
                this.imageCard = true
            }, 1000)
        },
        formatDate(date) {
            if (!date) return 'Invalid date'; // Handle null or undefined date
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return 'Invalid date'; // Handle invalid date format
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
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
thead .v-data-table__th .v-data-table-header__content {
    color: #b9b8b8;
}

tbody .v-data-table__td {
    color: #f7fffd;
}

@media (max-width: 530px) {
    .to-hide {
        display: none;
    }
}

.skeleton-loader {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

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
                                <v-text-field v-model="search_item_AC" label="Type CID or last name..."
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
            <template v-slot:item="{ item }">
                <!-- <tr :class="{ 'bg-teal-darken-1': !item.existsInMBWin }"> -->
                <tr>
                    <td>{{ item.CID }}</td>
                    <td>{{ item.Name1 }}</td>
                    <td>{{ item.Name2 }}</td>
                    <td>{{ item.Name3 }}</td>
                    <td>{{ item.RegisterDate }}</td>
                    <td>{{ item.LastChangeDate }}</td>
                    <td class="text-center">
                        <v-btn @click="viewItem(item)" class="bg-teal-darken-4" prepend-icon="mdi-eye-outline" rounded>
                            View
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <!-- Dialog for viewing client details -->
        <v-dialog v-model="dialogSingle" transition="dialog-bottom-transition" max-width="1000px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Client Details</span>
                </v-card-title>
                <ClientDataMixin :client="selectedClient" :skeletonLoader="skltnLdr" :imageCard="imgCrd"
                    :imageSource="imgSrc" :typeItems="typeItems" :titleItems="titleItems"
                    :clientstatusItems="clientstatusItems" :genderItems="genderItems"
                    :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems"
                    :relationshipItems="relationshipItems" />

                <v-card-actions class="mx-4 my-4">
                    <v-btn class="bg-teal-darken-4 px-3" prepend-icon="mdi-eye-outline" @click="toClientAccountList"
                        rounded>List of Accounts</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
                        @click="dialogSingle = false" rounded>Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
    components: {
        ClientDataMixin,
        Snackbar
    },
    name: 'AllClients',
    data() {
        return {
            client_info: [],
            typeItems: false,
            titleItems: false,
            clientstatusItems: false,
            genderItems: false,
            civilstatusItems: false,
            addresstypeItems: false,
            relationshipItems: false,
            dialogSingle: false,
            loading: true,
            image_file: null,
            search_item_AC: '',
            staff_or_not: 2,
            headers: [
                { title: 'CID', value: 'CID', sortable: false },
                { title: 'Last Name', value: 'Name1', sortable: false },
                { title: 'First Name', value: 'Name2', sortable: false },
                { title: 'Middle Name', value: 'Name3', sortable: false },
                { title: 'Created At', value: 'RegisterDate', sortable: true },
                { title: 'Updated At', value: 'LastChangeDate', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            selectedClient: null,
            selectedImage: null,
            skltnLdr: false,
            imgCrd: false,
            imgSrc: null,
        };
    },
    created() {
        if (this.selectedImage?.display_name && this.selectedImage?.image_file) {
            this.fetchClientImage(this.selectedImage.display_name, this.selectedImage.image_file);
        }
    },
    mounted() {
        this.fetchClientInfo();
        if (this.$route.query.search) {
            this.search_item_AC = this.$route.query.search;
        }
    },
    beforeUnmount() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }
    },
    computed: {
        filteredClients() {
            const searchTerm = this.search_item_AC.toLowerCase();
            return this.client_info.filter((client) => {
                return (
                    client.CID.toString().includes(searchTerm) ||
                    client.Name2.toLowerCase().includes(searchTerm) ||
                    client.Name3.toLowerCase().includes(searchTerm) ||
                    client.Name1.toLowerCase().includes(searchTerm)
                );
            });
        },
    },
    methods: {
        toClientAccountList() {
            if (this.selectedClient) {
                this.$router.push({
                    name: 'ClientAccountList',
                    params: {
                        CID: this.selectedClient.CID,
                    },
                });
            }
        },
        viewItem(item) {
            this.selectedClient = {
                ...item,
                RegisterDate: this.formatDate(item.RegisterDate),
                LastChangeDate: this.formatDate(item.LastChangeDate)
            };
            this.dialogSingle = true;
            this.skltnLdr = true
            this.imgCrd = false
            this.fetchClientInfoByCID(item.CID);
            setTimeout(() => {
                this.skltnLdr = false
                this.imgCrd = true
            }, 1000)
        },
        formatDate(date) {
            if (!date) return 'Invalid date';
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return 'Invalid date';
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
        },
        async fetchClientInfo() {
            try {
                const response = await apiClient.get('/mbwin_client_info', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.client_info = response.data.map(client => ({
                    ...client,
                    RegisterDate: this.formatDate(client.RegisterDate),
                    LastChangeDate: this.formatDate(client.LastChangeDate),
                    existsInMBWin: false
                }));
            } catch (error) {
                console.error('Error fetching client_info:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchClientInfoByCID(cid) {
            try {
                const response = await apiClient.get(`/client_info`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    params: { search: cid }
                });
                const clientData = response.data;
                if (Array.isArray(clientData) && clientData.length > 0) {
                    const client = clientData[0]; // Fetch only the first record
                    if (client.last_name && client.first_name && client.middle_name && client.image_file) {
                        this.selectedImage = {
                            last_name: client.last_name,
                            first_name: client.first_name,
                            middle_name: client.middle_name,
                            image_file: client.image_file,
                        };
                        const fullName = [client.last_name + ',', client.first_name, client.middle_name].filter(Boolean).join(' ');
                        this.fetchClientImage(fullName, client.image_file);
                    } else {
                        this.selectedImage = null;
                        this.imgSrc = '';
                        console.warn('No image data available for the selected client.');
                    }
                } else {
                    console.warn('No client data found.');
                    this.selectedImage = null;
                    this.imgSrc = '';
                }
            } catch (error) {
                console.error('Error fetching client info by CID:', error);
                this.$refs.snackbarRef.showSnackbar(this.messages.fetchError, "error");
            }
        },
        async fetchClientImage(folderName, imageFileName) {
            try {
                const response = await apiClient.get(`/client_image/${folderName}/${imageFileName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    responseType: 'blob',
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                this.imgSrc = URL.createObjectURL(blob);
            } catch (error) {
                console.error('Error fetching client image:', error);
                this.imgSrc = '';
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
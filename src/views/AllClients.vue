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
                    <td>{{ item.cid }}</td>
                    <td>{{ item.last_name }}</td>
                    <td>{{ item.first_name }}</td>
                    <td>{{ item.middle_name }}</td>
                    <td>{{ item.created_at }}</td>
                    <td>{{ item.updated_at }}</td>
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
                    :imageSource="imgSrc" :typeItems="typItms" :titleItems="ttlItms" :clientstatusItems="clntsttsItms"
                    :genderItems="gndrItms" :civilstatusItems="cvlsttsItms" :addresstypeItems="addrsstypItms"
                    :institutionItems="instttnItms" :entityItems="enttyItms" :employmentItems="emplymntItms"
                    :relationshipItems="rltnshpItms" />

                <v-card-actions class="mx-4 my-4">
                    <v-btn class="bg-teal-darken-4 px-3" prepend-icon="mdi-eye-outline" @click="toClientAccount"
                        rounded>List of Accounts</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-pencil-outline" @click="toEditClientInfo"
                        rounded>Edit</v-btn>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
                        @click="dialogSingle = false" rounded>Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import apiClient from '../axios';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
    components: {
        ClientDataMixin
    },
    name: 'AllClients',
    data() {
        return {
            client_info: [],
            dialogSingle: false,
            loading: true,
            image_file: null,
            search_item_AC: '',
            staff_or_not: 2,
            headers: [
                { title: 'CID', value: 'cid', sortable: false },
                { title: 'Last Name', value: 'last_name', sortable: false },
                { title: 'First Name', value: 'first_name', sortable: false },
                { title: 'Middle Name', value: 'middle_name', sortable: false },
                { title: 'Created At', value: 'created_at', sortable: true },
                { title: 'Updated At', value: 'updated_at', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            selectedClient: null,
            skltnLdr: false,
            imgCrd: false,
            imgSrc: null,
            typItms: [],
            ttlItms: [],
            clntsttsItms: [],
            gndrItms: [],
            cvlsttsItms: [],
            addrsstypItms: [],
            instttnItms: [],
            enttyItms: [],
            emplymntItms: [],
            rltnshpItms: [],
        };
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
    created() {
        if (this.selectedClient?.display_name && this.selectedClient?.image_file) {
            this.fetchClientImage(this.selectedClient.display_name, this.selectedClient.image_file);
        }
    },
    watch: {
        'selectedClient.image_file': {
            immediate: true,
            handler(newValue) {
                if (newValue && this.selectedClient?.display_name) {
                this.fetchClientImage(this.selectedClient.display_name, newValue);
                }
            },
        },
    },
    computed: {
        filteredClients() {
            const searchTerm = this.search_item_AC.toLowerCase();
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
        toClientAccount() {
            if (this.selectedClient) {
                this.$router.push({
                name: 'ClientAccountList',
                params: {
                    cid: this.selectedClient.cid,
                },
                });
            }
        },
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
        viewItem(item) {
            this.selectedClient = {
                ...item,
                created_at: this.formatDate(item.created_at),
                updated_at: this.formatDate(item.updated_at)
            };
            this.dialogSingle = true;
            this.skltnLdr = true
            this.imgCrd = false
            setTimeout(() => {
                this.skltnLdr = false
                this.imgCrd = true
            }, 1000)
        },
        async fetchClientImage(folderName, imageFileName) {
            try {
                const response = await apiClient.get(`/client_image/${folderName}/${imageFileName}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                responseType: 'blob',
                });
                console.log(folderName, imageFileName);
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                this.imgSrc = URL.createObjectURL(blob);
            } catch (error) {
                console.error('Error fetching client image:', error);
                this.imgSrc = '';
            }
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
        // showSnackbar(message, color) {
        //     this.snackbar.message = message;
        //     this.snackbar.color = color;
        //     this.snackbar.visible = true;
        // },
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
                    updated_at: this.formatDate(client.updated_at),
                    existsInMBWin: false
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

<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Online Client Fetching</h1>
        <v-data-table :headers="headers" :items="filteredClients" :loading="loading" class="elevation-1">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <v-row>
                            <v-col cols="12" lg="6" md="6" sm="12">
                                <v-text-field :disabled="loading" v-model="search_item_CID_LastName" ref="searchItemCIDLastName" label="Type CID or last name..."
                                    class="pt-5"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-toolbar-title>
                    <div class="text-right">
                        <v-btn :disabled="loading" append-icon="mdi-refresh" class="me-3 pe-7" variant="outlined"
                            @click="onRefresh"></v-btn>
                    </div>
                </v-toolbar>
            </template>
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.clientName }}</td>
                    <td>{{ item.created_at }}</td>
                    <td>
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
import { apiClientOnline } from '../axios';
import Snackbar from '@/components/Snackbar.vue';
import ClientDataMixin from '@/components/ClientDataMixin.vue';
export default {
    components: {
        ClientDataMixin,
        Snackbar
    },
    name: 'OnlineFetching',
    data() {
        return {
            all_clients: [],
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
            search_item_CID_LastName: '',
            staff_or_not: 2,
            headers: [
                { title: 'Clinet Name', value: 'clientName', sortable: true },
                { title: 'Date Created', value: 'created_at', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            selectedClient: null,
            selectedImage: null,
            skltnLdr: false,
            imgCrd: false,
            imgSrc: null,
            messages: {
                internalServerError: "Internal server error.",
                fetchClientIDError: "Error fetching client info by CID.",
                fetchClientInfoError: "Error fetching client info.",
                clientDataNotFound: "Client data not found.",
                fetchImageError: "Error fetching client image.",
            },
        };
    },
    created() {
        if (this.selectedImage?.display_name && this.selectedImage?.image_file) {
            this.fetchClientImage(this.selectedImage.display_name, this.selectedImage.image_file);
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.searchItemCIDLastName.focus();
        });
        this.fetchClientInfo();
        if (this.$route.query.search) {
            this.search_item_CID_LastName = this.$route.query.search;
        }
    },
    beforeUnmount() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }
    },
    computed: {
    filteredClients() {
        const searchTerm = (this.search_item_CID_LastName || '').toLowerCase();
        return this.all_clients.filter((client) => {
            return (
                client.CID?.toString().includes(searchTerm) ||
                (client.middle_name || '').toLowerCase().includes(searchTerm) ||
                (client.last_name || '').toLowerCase().includes(searchTerm) ||
                (client.first_name || '').toLowerCase().includes(searchTerm)
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
                created_at: this.formatDate(item.created_at)
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
                this.loading = true;
                const response = await apiClientOnline.get('/all_clients', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                this.all_clients = response.data.map(client => ({
                    ...client,
                    clientName: client.first_name + ', ' + client.middle_name + ' ' + (client.last_name || ''),
                    created_at: this.formatDate(client.created_at),
                }));
                this.loading = false;
            } catch (error) {
                this.loading = false;
                this.$refs.snackbarRef.showSnackbar(this.messages.fetchClientInfoError, "error");
            } finally {
                this.loading = false;
            }
        },
        async fetchClientInfoByCID(cid) {
            try {
                const response = await apiClientOnline.get(`/client_info`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: { search: cid }
                });
                const clientData = response.data;
                if (Array.isArray(clientData) && clientData.length > 0) {
                    const client = clientData[0];
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
                        this.$refs.snackbarRef.showSnackbar(this.messages.fetchImageError, "error");
                    }
                }
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(this.messages.fetchClientIDError, "error");
            } finally {
                this.loading = false;
            }
        },
        async fetchClientImage(folderName, imageFileName) {
            try {
                const response = await apiClientOnline.get(`/client_image/${folderName}/${imageFileName}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob',
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                this.imgSrc = URL.createObjectURL(blob);
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(this.messages.fetchImageError, "error");
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

        async getBase64Image(url) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(this.messages.fetchImageError, "error");
                return '';
            }
        },
        formatDateForPrint(date) {
            if (!date) return 'Invalid date';
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return 'Invalid date';
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
        }
    }
};
</script>
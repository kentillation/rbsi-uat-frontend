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
                        <v-btn @click="viewClient(item)" class="bg-teal-darken-4" prepend-icon="mdi-eye-outline" rounded>View</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import { apiClientOnline } from '../axios';
import Snackbar from '@/components/Snackbar.vue';
export default {
    components: {
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
            loading: true,
            image_file: null,
            search_item_CID_LastName: '',
            staff_or_not: 2,
            headers: [
                { title: 'Clinet Name', value: 'clientName', sortable: true },
                { title: 'Date Created', value: 'created_at', sortable: true },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            selectedImage: null,
            imgSrc: null,
            messages: {
                internalServerError: "Internal server error.",
                fetchClientIDError: "Error fetching client info by CID.",
                fetchClientInfoError: "Error fetching client info.",
                clientDataNotFound: "Client data not found.",
                clientDataEmpty: "Empty client data.",
                fetchImageError: "Error fetching client image.",
            },
        };
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
                    created_at: this.formatDateTime(client.created_at),
                }));
                this.loading = false;
                if (this.all_clients.length === 0) {
                    this.$refs.snackbarRef.showSnackbar(this.messages.clientDataEmpty, "warning");
                }
            } catch (error) {
                this.loading = false;
                this.$refs.snackbarRef.showSnackbar(this.messages.fetchClientInfoError, "error");
            } finally {
                this.loading = false;
            }
        },
        viewClient(client) {
            const clientData = {
                ...client,
                birthdate: client.birthdate ? new Date(client.birthdate) : null
            };
            this.$router.push({
                name: 'NewContact',
                query: { client: encodeURIComponent(JSON.stringify(clientData)) }
            });
        },
        onRefresh() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.fetchClientInfo()
            }, 2000)
        },
        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        },
    }
};
</script>
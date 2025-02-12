<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>New Account</h1>
        <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" width="100%" rounded>
            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field v-model="cid" label="CID" outlined clearable></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="app_type" :rules="[appTypeRule]" label="Application type"
                        :items="appTypeItems" item-title="app_type" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="product_type" :rules="[prTypeRule]" label="Product type"
                        :items="prTypeItems" item-title="product_type" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="ownership_type" :rules="[ownershipTypeRule]" label="Ownership type"
                        :items="ownershipTypeItems" item-title="ownership_type" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field variant="underlined" disabled>Maturity date: {{ formattedMaturitydate }}</v-text-field>
                    <v-date-picker v-model="maturity_date"></v-date-picker>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="gl_code" :rules="[glCodeRule]" label="GL code"
                        :items="glCodeItems" item-title="gl_code" item-value="id"></v-autocomplete>
                </v-col>
            </v-row>
        </v-sheet>

        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';

export default {
    name: 'NewAccount',
    components: {
        Snackbar
    },
    data() {
        return {
            validating: false,
            loading: true,
            dialogSingle: false,
            dialogMultiple: false,
        };
    },
    created() {
        this.fetchCID();
    },
    computed: {
        formattedMaturitydate() {
            if (!this.maturity_date) return '';
            const date = new Date(this.maturity_date);
            return new Intl.DateTimeFormat('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: this.timezone,
            }).format(date);
        },
    },
    methods: {
        async fetchClientData(cid) {
            this.validating = true;
            try {
                const response = await apiClient.get(`/show_mbwin_client_info/${cid}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                const client = response.data;
                Object.assign(this, client);
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar('Client CID not found. Please try again!', 'error');
            } finally {
                this.validating = false;
            }
        },
        fetchCID() {
            const { cid } = this.$route.params;
            if (cid) {
                this.fetchClientData(cid);
            }
        },
        formatToDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
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
    },
};
</script>

<style scoped>
.to-hide {
    display: none;
}
</style>
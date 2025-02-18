<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <div class="d-flex align-items-center">
            <v-icon @click="goBack" class="mt-2 me-3" icon="mdi-chevron-double-left" title="Back"></v-icon>
            <h1>New Account</h1>
        </div>
        <v-form @submit.prevent="showConfirmDialog" ref="form">
            <v-sheet class="d-flex justify-center" elevation="4" rounded="lg">
                <v-container class="mx-auto">
                    <v-row class="mt-5">
                        <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                            <v-text-field v-model="cid" label="CID" outlined disabled></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                            <v-autocomplete v-model="app_type" :rules="[appTypeRule]" label="Application type"
                                :items="appTypeItems" item-title="app_type" item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                            <v-autocomplete v-model="product_type" :rules="[prTypeRule]" label="Product type"
                                :items="productTypeItems" item-title="product_type" item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                            <v-autocomplete v-model="ownership_type" :rules="[ownershipTypeRule]" label="Ownership type"
                                :items="ownershipTypeItems" item-title="ownership_type"
                                item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                            <v-text-field variant="underlined" disabled>Maturity date: {{ formattedMaturitydate
                                }}</v-text-field>
                            <v-date-picker v-model="maturity_date"></v-date-picker>
                        </v-col>
                    </v-row>
                </v-container>
            </v-sheet>
            <div class="mt-4 w-100 d-flex justify-end">
                <v-btn :disabled="!isFormValid || validating" @click="showConfirmDialog" prepend-icon="mdi-check"
                    class="bg-teal-darken-3 ms-2 mb-8" size="large" variant="tonal" height="40" width="135"
                    rounded>Submit</v-btn>
            </div>
        </v-form>

        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirm Submission</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">CID: </span><strong>{{ cid
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">Application type: </span><strong>{{
                                    getTitle(app_type, appTypeItems, 'app_type') }}</strong> </p>
                            </v-col>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">Product type: </span><strong>{{
                                    getTitle(product_type, productTypeItems, 'product_type') }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">Ownership type: </span><strong>{{
                                    getTitle(ownership_type, ownershipTypeItems, 'ownership_type') }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">Maturity date: </span><strong>{{
                                    formattedMaturitydate
                                        }}</strong> </p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-container class="d-flex justify-end">
                    <v-btn :disabled="validatingData" @click="closeConfirmDialog" class="bg-red-darken-4 px-3 me-2" text
                        rounded>Check again</v-btn>
                    <v-btn :disabled="validatingData" @click="submitForm" class="bg-teal-darken-3 px-3" rounded>
                        <v-progress-circular v-if="validatingData" size="20" color="white" label="Loading..."
                            indeterminate />
                        <span v-else>Confirm</span>
                    </v-btn>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="successDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Created Account</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <h3 class="text-teal-lighten-1">New account has been created successfully!</h3>
                        <br>
                        <h2>Account Number: {{ formatAcc(this.account_number) }}</h2>
                    </v-container>
                </v-card-text>
                <v-container class="d-flex justify-end">
                    <v-btn class="bg-teal-darken-4 px-3 me-2" prepend-icon="mdi-printer" text @click="printAccount"
                        rounded>Print</v-btn>
                    <v-btn class="bg-red-darken-4 px-3 me-2" prepend-icon="mdi-close-circle" text
                        @click="closeSuccessDialog" rounded>Close</v-btn>
                </v-container>
            </v-card>
        </v-dialog>
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
            cid: "",
            account_number: "",
            app_type: null,
            product_type: null,
            ownership_type: null,
            maturity_date: null,
            appTypeItems: [],
            productTypeItems: [],
            ownershipTypeItems: [],
            glCodeItems: [],
            appTypeRule: (v) => !!v || 'Application type is required',
            prTypeRule: (v) => !!v || 'Product type is required',
            ownershipTypeRule: (v) => !!v || 'Ownership type is required',
            validating: false,
            validatingData: false,
            skeletonLoader: false,
            loading: true,
            confirmDialog: false,
            successDialog: false,
            timezone: 'Asia/Manila',
        };
    },
    created() {
        this.fetchCID();
    },
    mounted() {
        this.fetchAppTypesItems();
        this.fetchProductTypesItems();
        this.fetchOwnerTypesItems();
    },
    // watch: {
    //     account_number(newValue) {
    //         if (newValue) {
    //             this.successDialog = true;
    //         }
    //     },
    // },
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
        isFormValid() {
            return [
                this.app_type, this.product_type, this.ownership_type, this.maturity_date
            ].every(field => !!field);
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
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
                this.cid = cid;
                this.fetchClientData(cid);
            }
        },
        async fetchItems(endpoint, targetArray, errorMessage) {
            try {
                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                this[targetArray] = response.data;
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(errorMessage, 'error');
            }
        },
        async fetchAppTypesItems() {
            this.fetchItems('/app_type', 'appTypeItems', 'Failed to fetch app types');
        },
        async fetchProductTypesItems() {
            this.fetchItems('/product_type', 'productTypeItems', 'Failed to fetch product types');
        },
        async fetchOwnerTypesItems() {
            this.fetchItems('/ownership_type', 'ownershipTypeItems', 'Failed to fetch ownership types');
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
        getTitle(id, items, titleKey) {
            const item = items.find(item => String(item.id) === String(id));
            return item ? item[titleKey] : "Unknown";
        },
        closeConfirmDialog() {
            this.confirmDialog = false;
        },
        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
            this.skeletonLoader = true;
            setTimeout(() => {
                this.skeletonLoader = false;
            }, 1000);
        },
        async submitForm() {
            this.validating = true;
            this.validatingData = true;
            try {
                if (!this.$refs.form.validate()) {
                    this.validating = false;
                    return;
                }
                const formData = new FormData();
                const fields = ['cid', 'app_type', 'product_type', 'ownership_type', 'maturity_date'];
                const formattedMaturityDate = this.maturity_date
                    ? new Date(this.maturity_date).toISOString().split('T')[0]
                    : '';
                formData.append('maturity_date', formattedMaturityDate);
                fields.forEach(field => {
                    if (field !== 'maturity_date') {
                        formData.append(field, this[field]);
                    }
                });
                const response = await apiClient.post('/create_account', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.account_number = response.data.data.acc;
                if (response.status === 200) {
                    try {
                        setTimeout(() => {
                            this.confirmDialog = false;
                            this.validatingData = false;
                            this.successDialog = true;
                        }, 3000);
                    } catch (error) {
                        console.error('Error fetching client CID:', error);
                        this.imageSource = "";
                    }
                }
            } catch (error) {
                this.handleFormError(error);
                this.validating = false;
                this.confirmDialog = false;
            } finally {
                this.validating = false;
            }
        },
        formatAcc(account_number) {
            if (!account_number) return account_number;
            const account_numberStr = String(account_number);
            return account_numberStr.replace(/^(\d{2})(\d{5})(\d{1})$/, "$1-$2-$3");
        },
        closeSuccessDialog() {
            this.successDialog = false;
        },
        printAccount() {
            window.print();
        },
        handleFormError(error) {
            let message = 'An unknown error occurred.';
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        message = 'Invalid operation. Please try again!';
                        break;
                    case 404:
                        message = 'CID not found!';
                        break;
                    case 422:
                        message = 'Invalid input!';
                        break;
                    case 429:
                        message = 'Too many API requests. Please refresh the page!';
                        break;
                    case 409:
                        message = 'Contact already exist!';
                        break;
                    case 500:
                        message = 'Internal server error. Please try again later!';
                        break;
                    default:
                        message = `Error: ${error.response.status}`;
                }
            } else if (error.request) {
                message = 'No response from server!';
            } else {
                message = 'Request error. Please try again!';
            }
            this.$refs.snackbarRef.showSnackbar(message, 'error');
        },
    },
};
</script>

<style scoped>
.to-hide {
    display: none;
}
</style>
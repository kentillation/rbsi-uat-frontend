<template>
    <v-container>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>
<script>

import apiClient from '../axios';
import watchlistData from '@/temp/watchlist.json';
import Snackbar from '@/components/Snackbar.vue';

export default {
    components: {
        Snackbar
    },
    data() {
        return {
            confirmDialog: false,
            imageCard: false,
            imageSource: "",
            type: "",
            title: "",
            client_status: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            display_name: "",
            staff_or_not: 2,
            gender: "",
            civil_status: "",
            initial: "",
            suffix: "",
            pickerVisible: false,
            minDate: '1930-01-01',
            maxDate: this.formatToDateString(new Date()),
            timezone: 'Asia/Manila',
            birthdate: null,
            mobile1: "",
            mobile2: "",
            email: "",
            nationality: 'Filipino',
            address_line1: "",
            address_line2: "",
            address_line3: "",
            postal_code: "",
            address_type: "",
            telephone: "",
            fax: "",
            image_file: null,
            // app_type: "",
            // pr_type: "",
            // gl_code: "",
            // ownership_type: "",
            institution: "",
            entity: "",
            employment: "",
            reg_date: this.formatToDateString(new Date()),
            relation: [
                { cid: "", relation_type: "" },
                { cid: "", relation_type: "" },
            ],
            rel_cid: "",
            relationship: "",
            rel_display_name: "",
            headers: [
                { title: 'CID', value: 'cid', sortable: false },
                { title: 'Display Name', value: 'display_name', sortable: false },
                { title: 'Actions', value: 'action', sortable: false }
            ],
            titleToGenderMap: {
                'Mr.': 'Male',
                'Fr.': 'Male',
                'Msg.': 'Male',
                'Ms.': 'Female',
                'Dr.': 'Prefer not to say',
                'Atty.': 'Prefer not to say',
                'Engr.': 'Prefer not to say',
                '-': 'Prefer not to say',
            },
            cityToPostalCodeMap: {
                'Sagay': '6122',
                'Cadiz': '6121',
                'Escalante': '6124',
                'Bacolod': '6100',
                'Talisay': '6115'
            },
            suffixesItems: [],
            typeItems: [],
            titleItems: [],
            clientstatusItems: [],
            genderItems: [],
            civilstatusItems: [],
            addresstypeItems: [],
            institutionItems: [],
            entityItems: [],
            employmentItems: [],
            relationshipItems: [],
            typeRule: (v) => !!v || 'Type is required',
            titleRule: (v) => !!v || 'Title is required',
            clientstatusRule: (v) => !!v || 'Client status is required',
            firstnameRule: (v) => !!v || 'First name is required',
            middlenameRule: (v) => !!v || 'Middle name is required',
            lastnameRule: (v) => !!v || 'Last name is required',
            displaynameRule: (v) => !!v || 'Display name is required',
            genderRule: (v) => !!v || 'Gender is required',
            civilstatusRule: (v) => !!v || 'Civil status is required',
            mobile1Rule: (v) => !!v || 'Mobile 1 is required',
            emailRule: (v) => !!v || 'Email is required',
            nationalityRule: (v) => !!v || 'Nationality is required',
            addressline1Rule: (v) => !!v || 'Barangay is required',
            addressline2Rule: (v) => !!v || 'City is required',
            addressline3Rule: (v) => !!v || 'Province is required',
            postalcodeRule: (v) => !!v || 'Postal Code is required',
            addresstypeRule: (v) => !!v || 'Address type is required',
            institutionRule: (v) => !!v || 'Institution is required',
            entityRule: (v) => !!v || 'Entity is required',
            employmentRule: (v) => !!v || 'Employment is required',
            imagefileRule: (v) => !!v || 'Please select an image',
            validating: false,
            snackbar: {
                visible: false,
                message: "",
                color: ""
            },
            to_HomePage: false,
            confirmIdentityDialog: false,
        };
    },
    created() {
        if (this.singleRelation?.image_file) {
            this.fetchClientImage(this.singleRelation.image_file);
        }
    },
    watch: {
        displayName(newVal) {
            this.display_name = newVal;
        },
        title(newGenderId) {
            const selectedTitle = this.titleItems.find(item => item.id === newGenderId);
            if (selectedTitle) {
                const matchingGender = this.titleToGenderMap[selectedTitle.title];
                if (matchingGender) {
                const genderItem = this.genderItems.find(item => item.gender === matchingGender);
                if (genderItem) {
                    this.gender = genderItem.id;
                }
                }
            }
        },
        address_line2(newCity) {
            const city = newCity.trim();
            if (this.cityToPostalCodeMap[city]) {
                this.postal_code = this.cityToPostalCodeMap[city];
            } else {
                this.postal_code = '';
            }
        },
    },
    mounted() {
        this.fetchSuffixesItems();
        this.fetchTypesItems();
        this.fetchTitlesItems();
        this.fetchClientStatusItems();
        this.fetchGenderItems();
        this.fetchCivil_StatusItems();
        this.fetchUndefItems();
        this.fetchEntityItems();
        this.fetchEmploymentItems();
        this.fetchAddressTypeItems();
        this.fetchRelation();
    },
    computed: {
        isIdentityCheckDisabled() {
            return !this.first_name || !this.middle_name || !this.last_name;
        },
        displayName() {
            const firstName = this.first_name || '';
            const middleName = this.middle_name ? `${this.middle_name.charAt(0)}.` : '';
            const lastName = this.last_name || '';
            return `${lastName}, ${firstName} ${middleName}`.trim();
        },
        formattedBirthdate() {
            if (!this.birthdate) return '';
            const date = new Date(this.birthdate);
            return new Intl.DateTimeFormat('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: this.timezone,
            }).format(date);
        },
        isFormValid() {
            return [
                this.first_name, this.middle_name, this.last_name,
                this.type, this.title, this.client_status,
                this.display_name, this.gender, this.civil_status,
                this.birthdate, this.address_line1, this.address_line2, this.address_line3,
                this.postal_code, this.address_type,
                this.institution, this.entity, this.employment,
                this.image_file, this.mobile1, this.email, this.nationality
            ].every(field => !!field);
        }
    },
    methods: {
        formatToDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
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
        async fetchSuffixesItems() {
            this.fetchItems('/suffixes', 'suffixesItems', 'Failed to fetch suffixes');
        },
        async fetchTypesItems() {
            this.fetchItems('/types', 'typeItems', 'Failed to fetch types');
        },
        async fetchTitlesItems() {
            this.fetchItems('/titles', 'titleItems', 'Failed to fetch titles');
        },
        async fetchClientStatusItems() {
            this.fetchItems('/client_status', 'clientstatusItems', 'Failed to fetch client status');
        },
        async fetchGenderItems() {
            this.fetchItems('/genders', 'genderItems', 'Failed to fetch gender');
        },
        async fetchCivil_StatusItems() {
            this.fetchItems('/civil_status', 'civilstatusItems', 'Failed to fetch civil status');
        },
        async fetchAddressTypeItems() {
            this.fetchItems('/address_type', 'addresstypeItems', 'Failed to fetch address type');
        },
        async fetchUndefItems() {
            this.fetchItems('/institution', 'institutionItems', 'Failed to fetch institution codes');
        },
        async fetchEntityItems() {
            this.fetchItems('/entity', 'entityItems', 'Failed to fetch entities');
        },
        async fetchEmploymentItems() {
            this.fetchItems('/employment', 'employmentItems', 'Failed to fetch employment codes');
        },
        async fetchRelation() {
            this.fetchItems('/relationship', 'relationshipItems', 'Failed to relation codes');
        },
        async checkWatchlist() {
            if (this.isIdentityCheckDisabled) return;
            try {
                const data = watchlistData;
                const isOnWatchlist = data.watchlist.some(item =>
                item.first_name === this.first_name &&
                item.middle_name === this.middle_name &&
                item.last_name === this.last_name
                );
                if (isOnWatchlist) {
                this.$refs.snackbarRef.showSnackbar('Name is on the watchlist.', 'error');
                } else {
                this.$refs.snackbarRef.showSnackbar('Name is NOT on the watchlist. You can now proceed!', 'success');
                }
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar('Error checking watchlist. Refresh the page!', 'error');
            }
        },
        async checkIdentity() {
            if (!this.first_name || !this.middle_name || !this.last_name) return;
            try {
                const [response1, response2] = await Promise.all([
                    apiClient.get('/check_mbwin_client_info', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
                        params: { first_name: this.first_name, middle_name: this.middle_name, last_name: this.last_name }
                    }),
                    apiClient.get('/check_new_db_client_info', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
                        params: { first_name: this.first_name, middle_name: this.middle_name, last_name: this.last_name }
                    })
                ]);
                if (response1.data.exists) this.$refs.snackbarRef.showSnackbar('Name already exists in MBWin database.', 'error');
                if (response2.data.exists) this.$refs.snackbarRef.showSnackbar('Name already exists in new database.', 'error');
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar('Error checking identity. Refresh the page!', 'error');
            }
        },
        getTitle(id, items, titleKey) {
            const item = items.find(item => String(item.id) === String(id));
            return item ? item[titleKey] : "Unknown";
        },
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        },
        handleFormError(error) {
            let message = 'An unknown error occurred.';
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        message = 'Invalid operation. Please try again!';
                        break;
                    case 404:
                        message = 'Client not found!';
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
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>New Client</h1>
        <v-form @submit.prevent="new_client_form" ref="form">
            <v-container>
                <v-sheet elevation="3" rounded="lg">
                    <v-card>
                        <v-card-text>
                            <v-card border="opacity-50 sm" class="mb-10">
                                <v-container>
                                    <h3 class="mb-4">Basic Information</h3>
                                    <v-row justify="center">
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-autocomplete v-model="type" :rules="[typeRule]" label="Type"
                                                :items="typeItems" item-title="type" item-value="id" return-object>
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-autocomplete v-model="title" :rules="[titleRule]" label="Title"
                                                :items="titleItems" item-title="title" item-value="id" return-object></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-autocomplete v-model="client_status" :rules="[clientstatusRule]"
                                                label="Client Status" :items="clientstatusItems" item-title="client_status" item-value="id" return-object></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-text-field v-model="first_name" :rules="[firstnameRule]" label="First Name"
                                                clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-text-field v-model="middle_name" :rules="[middlenameRule]"
                                                label="Middle Name" clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-text-field v-model="last_name" :rules="[lastnameRule]" label="Last Name"
                                                clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-text-field v-model="initial" label="Initial"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-text-field v-model="display_name" :rules="[displaynameRule]"
                                                label="Display Name"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-checkbox v-model="staff_or_not" label="Staff"></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>

                            <v-row>
                                <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                    <v-card border="opacity-50 sm" class="mb-5">
                                        <v-container>
                                            <h3 class="mb-4">Personal Information</h3>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="tin" label="TIN"
                                                                clearable></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-autocomplete v-model="gender" :rules="[genderRule]"
                                                                label="Gender" :items="genderItems" item-title="gender" item-value="id" return-object></v-autocomplete>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-autocomplete v-model="civil_status"
                                                                :rules="[civilstatusRule]" label="Civil status"
                                                                :items="civilstatusItems" item-title="civil_status" item-value="id" return-object></v-autocomplete>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="birthdate" disabled>Birthdate: {{
                                                                formattedBirthdate }}</v-text-field>
                                                            <v-date-picker :min="minDate" :max="maxDate"
                                                                v-model="birthdate"></v-date-picker>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                    <v-card border="opacity-50 sm" class="mb-5">
                                        <v-container>
                                            <h3 class="mb-4">Contact Information</h3>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="mobile1" :rules="[mobile1Rule]"
                                                                label="Mobile 1" clearable></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="mobile2" label="Mobile 2"
                                                                clearable></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="email" :rules="[emailRule]" label="Email"
                                                                clearable></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="nationality" :rules="[nationalityRule]"
                                                                label="Nationality" clearable></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                    <v-card border="opacity-50 sm" class="mb-5">
                                        <v-container>
                                            <h3 class="mb-4">Address</h3>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field v-model="address_line1" :rules="[addressline1Rule]"
                                                        label="Line 1" clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="address_line2" :rules="[addressline2Rule]"
                                                        label="Line 2" clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="address_line3" :rules="[addressline3Rule]"
                                                        label="Line 3" clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="address_line4" :rules="[addressline4Rule]"
                                                        label="Line 4" clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="postal_code" :rules="[postalcodeRule]"
                                                        label="Postal Code" clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="address_type" :rules="[addresstypeRule]"
                                                        label="Address Type" :items="addresstypeItems"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="telephone" label="Telephone"
                                                        clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="fax" label="Fax" clearable></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                    <v-card border="opacity-50 sm" class="mb-5">
                                        <v-container>
                                            <h3 class="mb-4">Client Classification Codes</h3>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="un_defined" :rules="[undefinedRule]"
                                                        label="Undefined" :items="undefinedItems"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="entity" :rules="[entityRule]" label="Entity"
                                                        :items="entityItems"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="employment" :rules="[employmentRule]"
                                                        label="Employment" :items="employmentItems"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-file-input v-model="image_file" :rules="[imagefileRule]"
                                                        label="Image file" size="small" append-inner-icon="mdi-camera"
                                                        prepend-icon="" chips show-size>
                                                    </v-file-input>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="cus_lang_pref"
                                                        label="Client Language Preferences"></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="cus_tax_code" :rules="[custaxcodeRule]"
                                                        label="Client Tax Code" :items="custaxcodeItems"></v-autocomplete>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-sheet>
            </v-container>
            <v-container>
                <div class="text-right">
                    <v-btn :disabled="!isFormValid || validating" color="white" type="submit" block
                        class="bg-orange-darken-4 mb-8" size="large" variant="tonal" :loading="validating" height="40"
                        text="Validate" width="135" rounded>
                        Proceed
                    </v-btn>
                </div>
            </v-container>
        </v-form>
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>{{ snackbar.message }}</v-snackbar>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
    name: 'NewContact',
    data() {
        return {
            type: '',
            typeItems: [],
            typeRule: (v) => !!v || 'Type is required',
            title: '',
            titleItems: [],
            titleRule: (v) => !!v || 'Title is required',
            client_status: '',
            clientstatusItems: [],
            clientstatusRule: (v) => !!v || 'Client status is required',
            first_name: '',
            middle_name: '',
            last_name: '',
            initial: '',
            display_name: '',
            firstnameRule: (v) => !!v || 'First name is required',
            middlenameRule: (v) => !!v || 'Middle name is required',
            lastnameRule: (v) => !!v || 'Last name is required',
            displaynameRule: (v) => !!v || 'Display name is required',
            staff_or_not: '',
            tin: '',
            gender: '',
            genderRule: (v) => !!v || 'Gender is required',
            genderItems: [],
            civil_status: '',
            civilstatusItems: [],
            civilstatusRule: (v) => !!v || 'Civil status is required',
            mobile1: '',
            mobile1Rule: (v) => !!v || 'Mobile 1 is required',
            mobile2: '',
            email: '',
            emailRule: (v) => !!v || 'Email is required',
            nationality: '',
            nationalityRule: (v) => !!v || 'Nationality is required',
            address_type: '',
            addresstypeItems: ['001 - Home', '002 - Business', '009 - Others'],
            addresstypeRule: (v) => !!v || 'Address type is required',
            address_line1: '',
            addressline1Rule: (v) => !!v || 'Address Line 1 is required',
            address_line2: '',
            addressline2Rule: (v) => !!v || 'Address Line 2 is required',
            address_line3: '',
            addressline3Rule: (v) => !!v || 'Address Line 3 is required',
            address_line4: '',
            addressline4Rule: (v) => !!v || 'Address Line 4 is required',
            telephone: '',
            fax: '',
            postal_code: '',
            postalcodeRule: (v) => !!v || 'Postal Code is required',
            birthdate: null,
            pickerVisible: false,
            minDate: '1930-01-01',
            maxDate: this.formatToDateString(new Date()),
            timezone: 'Asia/Manila',
            cus_lang_pref: 'English - UK',
            cus_tax_code: '',
            custaxcodeRule: (v) => !!v || 'Client Tax Code is required',
            custaxcodeItems: ['001 - Tax Withheld', '002 - Tax Free'],
            un_defined: '',
            undefinedRule: (v) => !!v || 'Undefined code is required',
            undefinedItems: ['000 - Requested',
                '001 - Private',
                '002 - Government-National',
                '003 - Non-Government',
                '004 - Government',
                '005 - Religious Org.',
                '006 - Organization',
                '007 - Association',
                '0011 - Phil. National Oil Co. (PNOC)',
                '0012 - National Power Corp. (NPC)',
                '0013 - National Electrification Ad (NEA)',
                '0014 - Phil. Port Authority (PPA)',
                '0015 - Phil. National Railways (PNR)',
                '0016 - Metro Manila Transit Corp. (MMTC)',
                '0017 - National Irrigation Admin (NIA)',
                '0018 - NAWASA/MWSS',
                '0019 - Local Water Utilities Ad (LWUA)',
                '0020 - National Housing Authority (NHA)',
                '0021 - Export Processing Zone A (EPZA)',
                '0022 - National Development Cor (NDC)',
                '0023 - Light Rail Transit Authority (LRTA)',
                '0024 - National Food Authority (FDA)',
                '0031 - Government Institution - Other',
            ],
            entity: '',
            entityRule: (v) => !!v || 'Entity code is required',
            entityItems: ['000 - Requested',
                '001 - Individual',
                '002 - Single Proprietorship',
                '003 - Partnership & Assoc.',
                '004 - Cooperative',
                '005 - Financial Cop. w/ QB',
                '006 - Non-financial Coporation',
                '021 - SSS Pensioner 1-Retirement',
                '022 - SSS Pensioner 2-EC Death',
                '023 - SSS Pensioner 3-SS Death',
                '024 - SSS Pensioner 4-EC T.Dis',
                '025 - SSS Pensioner 5-SS T.Dis',
                '026 - SSS Pensioner 6-EC P.Dis',
                '027 - SSS Pensioner 7-SS P.Dis',
            ],
            employment: '',
            employmentRule: (v) => !!v || 'Employment code is required',
            employmentItems: ['000 - <TYPE OF CLIENT>',
                '010 - Farmers-Peasant',
                '020 - Artisanal Fisherfolk',
                '030 - Workers-Formal Sector',
                '040 - Migrant Workers',
                '050 - Workers-Informal Sector',
                '060 - Brgy MicroBusiness Enterprise',
                '070 - Others (Cultural, Senior)',
                '071 - Businessman',
            ],
            image_file: '',
            imagefileRule: (v) => !!v || 'Image File is required',
            validating: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            }
        };
    },
    computed: {
        formattedBirthdate() {
            if (!this.birthdate) return '';
            const date = new Date(this.birthdate);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: this.timezone,
            }).format(date);
        },
        isFormValid() {
            return this.type !== '' &&
                this.first_name !== '' &&
                this.middle_name !== '' &&
                this.last_name !== '' &&
                this.display_name !== '' &&
                this.initial !== '' &&
                this.title !== '' &&
                this.client_status !== '' &&
                this.gender !== '' &&
                this.civil_status !== '' &&
                this.mobile1 !== '' &&
                this.mobile2 !== '' &&
                this.email !== '' &&
                this.birthdate !== '' &&
                this.cus_lang_pref !== '' &&
                this.cus_tax_code !== '' &&
                this.image_file !== '' &&
                this.address_type !== '' &&
                this.staff_or_not !== '' &&
                this.tin !== '' &&
                this.nationality !== '' &&
                this.un_defined !== '' &&
                this.entity !== '' &&
                this.employment !== '' &&
                this.address_line1 !== '' &&
                this.address_line2 !== '' &&
                this.address_line3 !== '' &&
                this.address_line4 !== '' &&
                this.telephone !== '' &&
                this.fax !== '' &&
                this.postal_code !== '';
        }
    },
    methods: {
        formatToDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // Added
        async fetchTypesItems() {
            try {
                const response = await apiClient.get('/types');
                this.typeItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch types';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        // Added
        async fetchTitlesItems() {
            try {
                const response = await apiClient.get('/titles');
                this.titleItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch titles';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        // Added
        async fetchClientStatusItems() {
            try {
                const response = await apiClient.get('/client_status');
                this.clientstatusItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch client status';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        // Added
        async fetchGenderItems() {
            try {
                const response = await apiClient.get('/genders');
                this.genderItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch gender';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        // Added
        async fetchCivil_StatusItems() {
            try {
                const response = await apiClient.get('/civil_status');
                this.civilstatusItems = response.data;
            } catch (error) {
                this.snackbar.message = 'Failed to fetch civil status';
                this.snackbar.color = 'error';
                this.snackbar.visible = true;
            }
        },
        async new_client_form() {
            this.validating = true;
            try {
                if (this.$refs.form.validate()) {
                    const response = await apiClient.post('/new_client_info', {
                        type: this.type,
                        first_name: this.first_name,
                        middle_name: this.middle_name,
                        last_name: this.last_name,
                        display_name: this.display_name,
                        initial: this.initial,
                        title: this.title,
                        client_status: this.client_status,
                        gender: this.gender,
                        civil_status: this.civil_status,
                        mobile1: this.mobile1,
                        mobile2: this.mobile2,
                        email: this.email,
                        birthdate: this.birthdate,
                        cus_lang_pref: this.cus_lang_pref,
                        cus_tax_code: this.cus_tax_code,
                        image_file: this.image_file,
                        address_type: this.address_type,
                        staff_or_not: this.staff_or_not,
                        tin: this.tin,
                        nationality: this.nationality,
                        un_defined: this.un_defined,
                        entity: this.entity,
                        employment: this.employment,
                        address_line1: this.address_line1,
                        address_line2: this.address_line2,
                        address_line3: this.address_line3,
                        address_line4: this.address_line4,
                        telephone: this.telephone,
                        fax: this.fax,
                        postal_code: this.postal_code
                    });

                    if (response.status === 200) {
                        this.showSnackbar('Account has been saved successfully.', 'success');
                        this.$router.push('/new_client_info');
                    }
                }
            } catch (error) {
                let message = 'An unknown error occurred.';
                let color = 'error';

                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            message = 'Invalid input.';
                            break;
                        case 409:
                            message = 'Account already exists.';
                            break;
                        case 500:
                            message = 'Internal server error. Please try again later.';
                            break;
                        default:
                            message = `Error: ${error.response.status}`;
                    }
                } else if (error.request) {
                    message = 'No response from server.';
                } else {
                    message = 'Request error. Please try again!';
                }

                this.showSnackbar(message, color);
            } finally {
                this.validating = false;
            }
        },
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        }
    },
    mounted() {
        this.fetchTypesItems();
        this.fetchTitlesItems();
        this.fetchClientStatusItems();
        this.fetchGenderItems();
        this.fetchCivil_StatusItems();
    }
};
</script>

<style>
@import '~vuetify/styles';

.v-date-picker__title {
    display: none !important;
    height: 0 !important;
}

.v-date-picker-header {
    display: none !important;
    padding-top: 0 !important;
    height: 40px !important;
}

.v-date-picker-header__content {
    margin-top: 0 !important;
    display: none !important;
    height: 0 !important;
}

.v-picker-title {
    height: 0 !important;
    margin-top: 0 !important;
    padding-inline: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.v-date-picker-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    padding-inline-start: 0 !important;
    padding-inline-end: 0 !important;
}
</style>
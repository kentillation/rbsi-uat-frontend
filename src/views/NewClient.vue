<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>New Client</h1>
        <v-form @submit.prevent="showConfirmDialog" ref="form">
            <v-container>
                <v-sheet elevation="3" rounded="lg">
                    <v-card>
                        <v-card-text>
                            <v-card border="opacity-50 sm" class="mb-10">
                                <v-container>
                                    <h3 class="mb-4">Basic Information</h3>
                                    <v-row justify="center">
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-text-field v-model="first_name" :rules="[firstnameRule]"
                                                label="First Name" clearable></v-text-field>
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
                                            <v-autocomplete v-model="type" :rules="[typeRule]" label="Type"
                                                :items="typeItems" item-title="type" item-value="id">
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-autocomplete v-model="title" :rules="[titleRule]" label="Title"
                                                :items="titleItems" item-title="title" item-value="id"></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                            <v-autocomplete v-model="client_status" :rules="[clientstatusRule]"
                                                label="Client Status" :items="clientstatusItems"
                                                item-title="client_status" item-value="id"></v-autocomplete>
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
                                                                label="Gender" :items="genderItems" item-title="gender"
                                                                item-value="id"></v-autocomplete>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-autocomplete v-model="civil_status"
                                                                :rules="[civilstatusRule]" label="Civil status"
                                                                :items="civilstatusItems" item-title="civil_status"
                                                                item-value="id"></v-autocomplete>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field disabled>Birthdate: {{
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
                                                            <v-text-field v-model="email" :rules="[emailRule]"
                                                                label="Email" clearable></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="nationality"
                                                                :rules="[nationalityRule]" label="Nationality"
                                                                clearable></v-text-field>
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
                                                        label="Address Type" :items="addresstypeItems"
                                                        item-title="address_type" item-value="id"></v-autocomplete>
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
                                                    <v-autocomplete v-model="undef" :rules="[undefRule]"
                                                        label="Undefined" :items="undefItems" item-title="undef"
                                                        item-value="id"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="entity" :rules="[entityRule]"
                                                        label="Entity" :items="entityItems" item-title="entity"
                                                        item-value="id"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="employment" :rules="[employmentRule]"
                                                        label="Employment" :items="employmentItems"
                                                        item-title="employment" item-value="id"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-file-input accept="image/*" v-model="image_file"
                                                        :rules="[imagefileRule]" label="Image file" a
                                                        ppend-inner-icon="mdi-camera" prepend-icon="" chips show-size>
                                                    </v-file-input>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="cus_lang_pref"
                                                        label="Client Language Preferences"></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-autocomplete v-model="tax_code" :rules="[taxcodeRule]"
                                                        label="Client Tax Code" :items="taxcodeItems"
                                                        item-title="tax_code" item-value="id"></v-autocomplete>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-sheet>
                <div class="mt-4 w-100 d-flex justify-end">
                    <v-btn :disabled="!isFormValid || validating" @click="showConfirmDialog" color="white"
                        class="bg-orange-darken-4 mb-8" size="large" variant="tonal" :loading="validating" height="40"
                        width="135" rounded>
                        Submit
                    </v-btn>
                </div>
            </v-container>
        </v-form>
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>{{ snackbar.message }}</v-snackbar>

        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirm Submission</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <p><span class="text-grey-lighten-1">First Name: </span><strong>{{ first_name }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Middle Name: </span><strong>{{ middle_name }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Last Name: </span><strong>{{ last_name }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Type: </span><strong>{{ getTitle(type, typeItems, 'type') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Title: </span><strong>{{ getTitle(title, titleItems, 'title') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Client Status: </span><strong>{{ getTitle(client_status, clientstatusItems, 'client_status') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Initial: </span><strong>{{ initial }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Display Name: </span><strong>{{ display_name }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Staff: </span><strong>{{ staff_or_not ? 'Yes' : 'No' }}</strong> </p>
                                <p><span class="text-grey-lighten-1">TIN: </span><strong>{{ tin }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Gender: </span><strong>{{ getTitle(gender, genderItems, 'gender') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Civil Status: </span><strong>{{ getTitle(civil_status, civilstatusItems, 'civil_status') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Birthdate: </span><strong>{{ formattedBirthdate }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Mobile 1: </span><strong>{{ mobile1 }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Mobile 2: </span><strong>{{ mobile2 }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Email: </span><strong>{{ email }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Nationality: </span><strong>{{ nationality }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Address Line 1: </span><strong>{{ address_line1 }}</strong></p>
                                <p><span class="text-grey-lighten-1">Address Line 2: </span><strong>{{ address_line2 }}</strong></p>
                                <p><span class="text-grey-lighten-1">Address Line 3: </span><strong>{{ address_line3 }}</strong></p>
                                <p><span class="text-grey-lighten-1">Address Line 4: </span><strong>{{ address_line4 }}</strong></p>
                                <p><span class="text-grey-lighten-1">Postal Code: </span><strong>{{ postal_code }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Address Type: </span><strong>{{ getTitle(address_type, addresstypeItems, 'address_type') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Telephone: </span><strong>{{ telephone }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Fax: </span><strong>{{ fax }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Undefined: </span><strong>{{ getTitle(undef, undefItems, 'undef') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Entity: </span><strong>{{ getTitle(entity, entityItems, 'entity') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Employment: </span><strong>{{ getTitle(employment, employmentItems, 'employment') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Client Language Preferences: </span><strong>{{ cus_lang_pref }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Client Tax Code: </span><strong>{{ getTitle(tax_code, taxcodeItems, 'tax_code') }}</strong> </p>
                                <p><span class="text-grey-lighten-1">Image File: </span><strong>{{ image_file ? 'Selected' : 'None' }}</strong> </p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="submitForm">Confirm</v-btn>
                    <v-btn color="red darken-1" text @click="dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import apiClient from '../axios';
import { debounce } from 'lodash';

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
            firstnameRule: (v) => !!v || 'First name is required',
            middle_name: '',
            middlenameRule: (v) => !!v || 'Middle name is required',
            last_name: '',
            lastnameRule: (v) => !!v || 'Last name is required',
            initial: '',
            display_name: '',
            displaynameRule: (v) => !!v || 'Display name is required',
            staff_or_not: false,
            tin: '',
            gender: '',
            genderItems: [],
            genderRule: (v) => !!v || 'Gender is required',
            civil_status: '',
            civilstatusItems: [],
            civilstatusRule: (v) => !!v || 'Civil status is required',
            birthdate: null,
            pickerVisible: false,
            minDate: '1930-01-01',
            maxDate: this.formatToDateString(new Date()),
            timezone: 'Asia/Manila',
            mobile1: '',
            mobile1Rule: (v) => !!v || 'Mobile 1 is required',
            mobile2: '',
            email: '',
            emailRule: (v) => !!v || 'Email is required',
            nationality: 'Filipino',
            nationalityRule: (v) => !!v || 'Nationality is required',
            address_line1: '',
            addressline1Rule: (v) => !!v || 'Address Line 1 is required',
            address_line2: '',
            addressline2Rule: (v) => !!v || 'Address Line 2 is required',
            address_line3: '',
            addressline3Rule: (v) => !!v || 'Address Line 3 is required',
            address_line4: '',
            addressline4Rule: (v) => !!v || 'Address Line 4 is required',
            postal_code: '',
            postalcodeRule: (v) => !!v || 'Postal Code is required',
            address_type: '',
            addresstypeItems: [],
            addresstypeRule: (v) => !!v || 'Address type is required',
            telephone: '',
            fax: '',
            undef: '',
            undefItems: [],
            undefRule: (v) => !!v || 'Undefined code is required',
            entity: '',
            entityRule: (v) => !!v || 'Entity code is required',
            entityItems: [],
            employment: '',
            employmentItems: [],
            employmentRule: (v) => !!v || 'Employment code is required',
            image_file: '',
            imagefileRule: (v) => !!v || 'Image file is required',
            cus_lang_pref: 'English - UK',
            tax_code: '',
            taxcodeItems: [],
            taxcodeRule: (v) => !!v || 'Client Tax Code is required',
            dialog: false,
            validating: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            }
        };
    },
    watch: {
        first_name: 'debouncedCheckIdentity',
        middle_name: 'debouncedCheckIdentity',
        last_name: 'debouncedCheckIdentity',
        displayName(newVal) {
            this.display_name = newVal;
        }
    },
    computed: {
        displayName() {
            const firstName = this.first_name || '';
            const middleName = this.middle_name ? `${this.middle_name.charAt(0)}.` : '';
            const lastName = this.last_name || '';

            return `${lastName}, ${firstName} ${middleName}`.trim();
        },
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
                this.title !== '' &&
                this.client_status !== '' &&
                this.first_name !== '' &&
                this.middle_name !== '' &&
                this.last_name !== '' &&
                this.display_name !== '' &&
                this.staff_or_not !== '' &&
                this.tin !== '' &&
                this.gender !== '' &&
                this.civil_status !== '' &&
                this.birthdate !== '' &&
                this.mobile1 !== '' &&
                this.email !== '' &&
                this.nationality !== '' &&
                this.address_line1 !== '' &&
                this.address_line2 !== '' &&
                this.address_line3 !== '' &&
                this.address_line4 !== '' &&
                this.postal_code !== '' &&
                this.address_type !== '' &&
                this.undef !== '' &&
                this.entity !== '' &&
                this.employment !== '' &&
                this.image_file !== '' &&
                this.cus_lang_pref !== '' &&
                this.tax_code !== '';
        }
    },
    methods: {
        formatToDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
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
        debouncedCheckIdentity: debounce(function () {
            this.checkIdentity();
        }, 100),
        async checkIdentity() {
            try {
                if (!this.first_name || !this.middle_name || !this.last_name) return;
                const response = await apiClient.get('/check_identity', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    },
                    params: {
                        first_name: this.first_name,
                        middle_name: this.middle_name,
                        last_name: this.last_name
                    }
                });
                if (response.data.exists) {
                    this.showSnackbar('Name already exists.', 'warning');
                }
                else {
                    this.showSnackbar('Ready to proceed.', 'success');
                }
            } catch (error) {
                this.showSnackbar('Error checking identity. Please try again!', 'error');
            }
        },
        showConfirmDialog() {
            if (this.isFormValid) {
                this.dialog = true;
            }
        },
        getTitle(value, items, titleKey) {
            const item = items.find(item => item.id === value);
            return item ? item[titleKey] : 'Unknown';
        },
        async submitForm() {
            this.validating = true;
            try {
                if (this.$refs.form.validate()) {
                    const staffValue = this.staff_or_not ? 1 : 0;
                    const formData = new FormData();
                    formData.append('type', this.type);
                    formData.append('title', this.title);
                    formData.append('client_status', this.client_status);
                    formData.append('first_name', this.first_name);
                    formData.append('middle_name', this.middle_name);
                    formData.append('last_name', this.last_name);
                    formData.append('initial', this.initial);
                    formData.append('display_name', this.display_name);
                    formData.append('staff_or_not', staffValue);
                    formData.append('tin', this.tin);
                    formData.append('gender', this.gender);
                    formData.append('civil_status', this.civil_status);
                    formData.append('birthdate', this.birthdate);
                    formData.append('mobile1', this.mobile1);
                    formData.append('mobile2', this.mobile2);
                    formData.append('email', this.email);
                    formData.append('nationality', this.nationality);
                    formData.append('address_line1', this.address_line1);
                    formData.append('address_line2', this.address_line2);
                    formData.append('address_line3', this.address_line3);
                    formData.append('address_line4', this.address_line4);
                    formData.append('postal_code', this.postal_code);
                    formData.append('address_type', this.address_type);
                    formData.append('telephone', this.telephone);
                    formData.append('fax', this.fax);
                    formData.append('undef', this.undef);
                    formData.append('entity', this.entity);
                    formData.append('employment', this.employment);
                    formData.append('image_file', this.image_file);
                    formData.append('cus_lang_pref', this.cus_lang_pref);
                    formData.append('tax_code', this.tax_code);

                    const response = await apiClient.post('/new_client_info', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    });

                    if (response.status === 200) {
                        this.showSnackbar('New client has been saved successfully.', 'success');
                        // this.resetForm();
                    }

                    this.dialog = false;
                }
            } catch (error) {
                let message = 'An unknown error occurred.';
                let color = 'error';

                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            message = 'Invalid input.';
                            break;
                        case 500:
                            message = 'Internal server error. Please try again later.';
                            break;
                        case 409:
                            message = 'Client already exist.';
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
        resetForm() {
            this.first_name = '';
            this.middle_name = '';
            this.last_name = '';
            this.initial = '';
            this.display_name = '';
            this.staff_or_not = 0;
            this.tin = '';
            this.gender = '';
            this.civil_status = '';
            this.birthdate = null;
            this.mobile1 = '';
            this.mobile2 = '';
            this.email = '';
            this.nationality = 'Filipino';
            this.address_line1 = '';
            this.address_line2 = '';
            this.address_line3 = '';
            this.address_line4 = '';
            this.postal_code = '';
            this.address_type = '';
            this.telephone = '';
            this.fax = '';
            this.undef = '';
            this.entity = '';
            this.employment = '';
            this.image_file = '';
            this.cus_lang_pref = 'English - UK';
            this.tax_code = '';
            this.$refs.form.resetValidation();
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
        this.fetchUndefItems();
        this.fetchEntityItems();
        this.fetchEmploymentItems();
        this.fetchAddressTypeItems();
        this.fetchTaxCodeItems();
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
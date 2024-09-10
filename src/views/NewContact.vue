<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <div class="d-flex align-items-center">
            <v-icon @click="goBack" class="mt-2 me-3" size="x-large" icon="mdi-chevron-double-left"
                title="Back"></v-icon>
            <h1>New Contact</h1>
        </div>
        <v-form @submit.prevent="showConfirmDialog" ref="form">
            <v-sheet elevation="3" rounded="lg">
                <v-card>
                    <v-card-text>
                        <v-card border="opacity-50 sm" class="mb-10">
                            <v-container>
                                <div class="d-flex align-items-center justify-space-between">
                                    <h3 class="mb-4">Basic Information</h3>
                                    <v-btn class="bg-teal-darken-3 mb-3" :disabled="isIdentityCheckDisabled"
                                        @click="openConfirmIdentityDialog" prepend-icon="mdi-magnify" rounded><span
                                            class="to-hide">Check&nbsp;</span>Identity</v-btn>
                                </div>
                                <v-row justify="center">
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
                                            label="Client Status" :items="clientstatusItems" item-title="client_status"
                                            item-value="id"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="initial" label="Initial"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="display_name" :rules="[displaynameRule]"
                                            label="Display Name" disabled></v-text-field>
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
                                                        <v-text-field v-model="tin" :rules="[tinRule]" type="number"
                                                            label="TIN" clearable></v-text-field>
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
                                                        <v-text-field v-model="mobile1" type="number"
                                                            :rules="[mobile1Rule]" label="Mobile 1"
                                                            clearable></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="mobile2" type="number" label="Mobile 2"
                                                            clearable></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="email" type="email" :rules="[emailRule]"
                                                            label="Email" clearable></v-text-field>
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
                                                <v-text-field v-model="postal_code" type="number"
                                                    :rules="[postalcodeRule]" label="Postal Code"
                                                    clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="address_type" :rules="[addresstypeRule]"
                                                    label="Address Type" :items="addresstypeItems"
                                                    item-title="address_type" item-value="id"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="telephone" type="number" label="Telephone"
                                                    clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="fax" type="number" label="Fax"
                                                    clearable></v-text-field>
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
                                                <v-autocomplete v-model="undef" :rules="[undefRule]" label="Undefined"
                                                    :items="undefItems" item-title="undef"
                                                    item-value="id"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="entity" :rules="[entityRule]" label="Entity"
                                                    :items="entityItems" item-title="entity"
                                                    item-value="id"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="employment" :rules="[employmentRule]"
                                                    label="Employment" :items="employmentItems" item-title="employment"
                                                    item-value="id"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-file-input v-model="image_file" :rules="[imagefileRule]"
                                                accept="image/*" label="Image file" append-inner-icon="mdi-camera" 
                                                    prepend-icon="" chips show-size>
                                                </v-file-input>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="cus_lang_pref"
                                                    label="Client Language Preferences"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="tax_code" :rules="[taxcodeRule]"
                                                    label="Client Tax Code" :items="taxcodeItems" item-title="tax_code"
                                                    item-value="id"></v-autocomplete>
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
                <v-btn :disabled="!isFormValid || validating" @click="showConfirmDialog" prepend-icon="mdi-check"
                    class="bg-teal-darken-3 ms-2 mb-8" size="large" variant="tonal" height="40" width="135"
                    rounded>Submit</v-btn>
            </div>
        </v-form>
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>
            <div class="d-flex align-items-center justify-space-between">
                {{ snackbar.message }}
            </div>
        </v-snackbar>

        <v-dialog v-model="confirm_identity_dialog" max-width="600px">
            <v-card>
                <v-card-title class="headline">Confirmation</v-card-title>
                <v-card-text>
                    Every checking of identity has a subscription from its API Provider. Make it sure to fill in the
                    exact name before you click Confirm button.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3 mb-4" prepend-icon="mdi-close-circle"
                        @click="confirm_identity_dialog = false" rounded>Check again</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3 me-4 mb-4" prepend-icon="mdi-check" @click="confirmCheck"
                        rounded>Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirm Submission</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <div class="text-center">
                            <v-container class="skeleton-loader">
                                <p>
                                <v-skeleton-loader v-if="skeletonLoader" type="image" width="240" height="248"
                                    style="border: 1px solid #ccc ;border-radius: 10px;"></v-skeleton-loader>
                                <img v-if="imageCard" :src="imageSrc" width="241" style="border: 1px solid #ccc ;border-radius: 10px;"
                                    alt="Client Image" />
                                </p>
                            </v-container>
                        </div>
                            <!-- <p><span class="text-grey-lighten-1">Image File: </span><strong>{{ image_file ?
                                    'Selected' : 'None' }}</strong> </p> -->
                        <v-row>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">First Name: </span><strong>{{ first_name
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Middle Name: </span><strong>{{ middle_name
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Last Name: </span><strong>{{ last_name }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Type: </span><strong>{{ getTitle(type, typeItems,
                                    'type') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Title: </span><strong>{{ getTitle(title,
                                    titleItems, 'title') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Client Status: </span><strong>{{
                                    getTitle(client_status, clientstatusItems, 'client_status') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Initial: </span><strong>{{ initial }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Display Name: </span><strong>{{ display_name
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Staff: </span><strong>{{ staff_or_not ? 'Yes' :
                                    'No' }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">TIN: </span><strong>{{ tin }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Gender: </span><strong>{{ getTitle(gender,
                                    genderItems, 'gender') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Civil Status: </span><strong>{{
                                    getTitle(civil_status, civilstatusItems, 'civil_status') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Birthdate: </span><strong>{{ formattedBirthdate
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Mobile 1: </span><strong>{{ mobile1 }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Mobile 2: </span><strong>{{ mobile2 }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Email: </span><strong>{{ email }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Nationality: </span><strong>{{ nationality
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 1: </span><strong>{{ address_line1
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 2: </span><strong>{{ address_line2
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 3: </span><strong>{{ address_line3
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Line 4: </span><strong>{{ address_line4
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Postal Code: </span><strong>{{ postal_code
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Address Type: </span><strong>{{
                                    getTitle(address_type, addresstypeItems, 'address_type') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Telephone: </span><strong>{{ telephone }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Fax: </span><strong>{{ fax }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Undefined: </span><strong>{{ getTitle(undef,
                                    undefItems, 'undef') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Entity: </span><strong>{{ getTitle(entity,
                                    entityItems, 'entity') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Employment: </span><strong>{{ getTitle(employment,
                                    employmentItems, 'employment') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Client Language Preferences: </span><strong>{{
                                    cus_lang_pref }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Client Tax Code: </span><strong>{{
                                    getTitle(tax_code, taxcodeItems, 'tax_code') }}</strong> </p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" text @click="dialog" rounded>Check again</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-check" text @click="submitForm" rounded>Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import apiClient from '../axios';
import watchlistData from '@/temp/watchlist.json';
import { debounce } from 'lodash';
import formMixins from '@/mixins/formMixins';

export default {
    mixins: [formMixins],
    data () {
        return {
            skeletonLoader: false,
            imageCard: false,
            imageSrc: '',
        }
    },
    created() {
        this.checkIdentity = debounce(this.checkIdentity, 300);
    },
    watch: {
        first_name: 'checkIdentityWebhooks',
        middle_name: 'checkIdentityWebhooks',
        last_name: 'checkIdentityWebhooks',
    },
    computed: {
        isIdentityCheckDisabled() {
            return !this.first_name || !this.middle_name || !this.last_name;
        },

    },
    methods: {
        checkIdentityWebhooks() {
            this.checkIdentity();
        },
        openConfirmIdentityDialog() {
            this.confirm_identity_dialog = true;
        },
        confirmCheck() {
            this.confirm_identity_dialog = false;
            this.checkWatchlist();
        },
        // async checkWatchlist() {
        //     if (this.isIdentityCheckDisabled) return;
        //     try {
        //         const response = await apiClient.get('/watchlist', {
        //             headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        //             params: { first_name: this.first_name, middle_name: this.middle_name, last_name: this.last_name }
        //         });
        //         if (response.data.exists) {
        //             this.showSnackbar('Name is on the watchlist.', 'error');
        //         } else {
        //             this.showSnackbar('Name is not on the watchlist. You can now proceed!', 'success');
        //         }
        //     } catch (error) {
        //         this.showSnackbar('Error checking watchlist. Refresh the page!', 'error');
        //     }
        // },
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
                    this.showSnackbar('Name is on the watchlist.', 'error');
                } else {
                    this.showSnackbar('Name is not on the watchlist. You can now proceed!', 'success');
                }
            } catch (error) {
                this.showSnackbar('Error checking watchlist. Refresh the page!', 'error');
            }
        },
        async submitForm() {
            this.validating = true;
            try {
                if (this.$refs.form.validate()) {
                    const staffValue = this.staff_or_not ? 1 : 2;
                    const formData = new FormData();
                    const fields = [
                        'type', 'title', 'client_status', 'first_name', 'middle_name', 'last_name',
                        'initial', 'display_name', 'tin', 'gender', 'civil_status', 'birthdate',
                        'mobile1', 'mobile2', 'email', 'nationality', 'address_line1', 'address_line2',
                        'address_line3', 'address_line4', 'postal_code', 'address_type', 'telephone',
                        'fax', 'undef', 'entity', 'employment', 'image_file', 'cus_lang_pref', 'tax_code'
                    ];
                    const formattedBirthdate = this.birthdate ? new Date(this.birthdate).toISOString().split('T')[0] : '';
                    formData.append('birthdate', formattedBirthdate);
                    fields.forEach(field => {
                        if (field !== 'birthdate') { 
                            formData.append(field, this[field]);
                        }
                    });
                    if (this.image_file) {
                        formData.append('image_file', this.image_file);
                    }
                    formData.append('staff_or_not', staffValue);
                    const response = await apiClient.post('/new_client_info', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    });
                    if (response.status === 200) {
                        this.showSnackbar('New client has been saved successfully.', 'success');
                        this.dialog = false;
                    }
                }
            } catch (error) {
                this.handleFormError(error);
            } finally {
                this.validating = false;
            }
        },

    },
};

</script>
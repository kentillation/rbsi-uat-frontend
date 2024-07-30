<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Open New Contact</h1>
        <v-sheet elevation="3" rounded="lg">
            <v-tabs v-model="tab" height="60" slider-color="#005c00" align-tabs="center" next-icon="mdi-chevron-right"
                prev-icon="mdi-chevron-left" show-arrows>
                <v-tab value="contact_info">Contact Information</v-tab>
                <v-tab value="address">Address</v-tab>
                <v-tab value="codes">Codes</v-tab>
                <v-tab value="related_contacts">Related Contacts</v-tab>
                <v-tab value="extended_properties">Extended Properties</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-form ref="form_contact_info">
                    <v-tabs-window-item value="contact_info">
                        <v-card flat>
                            <v-card-text>

                                <v-card border="opacity-50 sm" class="mx-auto">
                                    <v-card-title>
                                        <h4 class="text-grey-lighten-1">Basic Information</h4>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row justify="center" class="mt-5">
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-autocomplete v-model="type" :rules="[typeRule]" label="Type"
                                                    :items="typeItems"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-autocomplete v-model="title" :rules="[titleRule]" label="Title"
                                                    :items="titleItems"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-autocomplete v-model="customer_status" :rules="[customerstatusRule]"
                                                    label="Customer Status"
                                                    :items="customerstatusItems"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-text-field v-model="first_name" :rules="[firstnameRule]"
                                                    label="First Name" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-text-field v-model="middle_name" :rules="[middlenameRule]"
                                                    label="Middle Name" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-text-field v-model="last_name" :rules="[lastnameRule]"
                                                    label="Last Name" clearable></v-text-field>
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
                                    </v-card-text>
                                </v-card>


                                <v-card border="opacity-50 sm" class="mx-auto mt-6">
                                    <v-card-title>
                                        <h4 class="text-grey-lighten-1">Personal Information</h4>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                                <v-row justify="center" class="mt-lg-15 mt-sm-7">
                                                    <v-col cols="12" lg="12">
                                                        <v-text-field v-model="tin" :rules="[tinRule]" label="Tin"
                                                            clearable></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" lg="12">
                                                        <v-autocomplete v-model="gender" :rules="[genderRule]"
                                                            label="Gender" :items="genderItems"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="12" lg="12">
                                                        <v-autocomplete v-model="civil_status"
                                                            :rules="[civilstatusRule]" label="Civil status"
                                                            :items="civilstatusItems"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="12" lg="12">
                                                        <!-- <v-date-picker width="400"></v-date-picker> -->
                                                        <v-text-field v-model="formattedDate" label="Birth Date" readonly
                                                            @click:append="pickerVisible = !pickerVisible"></v-text-field>
                                                        <v-menu v-model="pickerVisible" :close-on-content-click="false"
                                                            transition="scale-transition" offset-y min-width="290px">
                                                            <v-date-picker v-model="date" @change="updateDate"></v-date-picker>
                                                        </v-menu>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <!-- <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                                <v-row justify="center">
                                                    <v-date-picker width="400"></v-date-picker>
                                                    <v-text-field v-model="formattedDate" label="Birth Date" readonly
                                                        @click:append="pickerVisible = !pickerVisible"></v-text-field>
                                                    <v-menu v-model="pickerVisible" :close-on-content-click="false"
                                                        transition="scale-transition" offset-y min-width="290px">
                                                        <v-date-picker v-model="date" @change="updateDate"></v-date-picker>
                                                    </v-menu>
                                                </v-row>
                                            </v-col> -->
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                                <v-row>
                                    <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                        <v-card border="opacity-50 sm" class="mx-auto mt-6">
                                            <v-card-title>
                                                <h4 class="text-grey-lighten-1">Contact Information</h4>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-row justify="center" class="mt-3">
                                                            <v-col cols="12">
                                                                <v-text-field v-model="mobile1" :rules="[mobile1Rule]"
                                                                    label="Mobile 1" clearable></v-text-field>
                                                            </v-col>
                                                            <v-col cols="12">
                                                                <v-text-field v-model="mobile2" :rules="[mobile2Rule]"
                                                                    label="Mobile 2" clearable></v-text-field>
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
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="address">
                        <v-card flat>
                            <v-card-text>
                                <v-row justify="center" class="mt-5">
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="address_line1" :rules="[addressline1Rule]" label="Line 1"
                                            clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="address_line2" :rules="[addressline2Rule]" label="Line 2"
                                            clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="address_line3" :rules="[addressline3Rule]" label="Line 3"
                                            clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="address_line4" :rules="[addressline4Rule]" label="Line 4"
                                            clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="postal_code"  :rules="[postalcodeRule]" label="Postal Code"
                                            clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-autocomplete v-model="address_type" :rules="[addresstypeRule]"
                                            label="Address Type" :items="addresstypeItems"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="phone" label="Phone" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="3" md="3" sm="4" xs="12">
                                        <v-text-field v-model="fax" label="Fax" clearable></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="codes">
                        <v-card flat>
                            <v-card-text>
                                Codes
                            </v-card-text>
                        </v-card>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="related_contacts">
                        <v-card flat>
                            <v-card-text>
                                Related Contacts
                            </v-card-text>
                        </v-card>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="extended_properties">
                        <v-card flat>
                            <v-card-text>
                                Extended Properties
                            </v-card-text>
                        </v-card>
                    </v-tabs-window-item>
                </v-form>

            </v-tabs-window>
        </v-sheet>
    </v-container>
</template>

<script>
// import apiClient from '../axios';

export default {
    name: 'NewContact',
    data() {
        return {
            tab: null,
            type: '',
            typeItems: ['001-Personal/Individual', '002-Institution/Company'],
            typeRule: (v) => !!v || 'Type is required',
            title: '',
            titleItems: ['000 - None', '001 - Mr.', '002 - Mrs.', '003 - Dr.', '004 - Atty.', '005 - Engr.', '006 - Fr.', '007 - Msg.'],
            titleRule: (v) => !!v || 'Title is required',
            customer_status: '',
            customerstatusItems: ['000 - Active', '9GR - Guarantor Only'],
            customerstatusRule: (v) => !!v || 'Customer status is required',
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
            tinRule: (v) => !!v || 'Tin is Required',
            gender: '',
            genderRule: (v) => !!v || 'Gender is Required',
            genderItems: ['000 - Male', '001 - Female'],
            civilstatusRule: (v) => !!v || 'Civil status is Required',
            civil_status: '',
            civilstatusItems: ['D00 - Divored', 'M00 - Married', 'S00 - Single', 'W00 - Widowed'],
            mobile1: '',
            mobile1Rule: (v) => !!v || 'Mobile 1 is Required',
            mobile2: '',
            mobile2Rule: (v) => !!v || 'Mobile 2 is Required',
            email: '',
            emailRule: (v) => !!v || 'Email is Required',
            nationality: '',
            nationalityRule: (v) => !!v || 'Nationality is Required',
            address_type: '',
            addresstypeItems: ['001 - Home', '002 - Business', '009 - Others'],
            addresstypeRule: (v) => !!v || 'Address type is required',
            address_line1: '',
            addressline1Rule: (v) => !!v || 'Address Line 1 is Required',
            address_line2: '',
            addressline2Rule: (v) => !!v || 'Address Line 2 is Required',
            address_line3: '',
            addressline3Rule: (v) => !!v || 'Address Line 3 is Required',
            address_line4: '',
            addressline4Rule: (v) => !!v || 'Address Line 4 is Required',
            phone: '',
            fax: '',
            postal_code: '',
            postalcodeRule: (v) => !!v || 'Postal Code is Required',
            date: null,
            formattedDate: '',
            pickerVisible: false,
        };
    },
    methods: {
        updateDate(date) {
            this.formattedDate = this.formatDate(date);
            this.pickerVisible = false;
        },
        formatDate(date) {
            if (!date) return '';
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        },
    },
};
</script>

<style>
@import '~vuetify/styles';
</style>
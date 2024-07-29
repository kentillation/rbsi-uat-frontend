<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Open New Contact</h1>
        <v-sheet elevation="3" rounded="lg">
            <v-tabs v-model="tab" color="white" height="60" slider-color="#005c00" align-tabs="center"
                next-icon="mdi-chevron-right" prev-icon="mdi-chevron-left" show-arrows>
                <v-tab value="contact_info">Contact Information</v-tab>
                <v-tab value="address">Address</v-tab>
                <v-tab value="codes">Codes</v-tab>
                <v-tab value="related_contacts">Related Contacts</v-tab>
                <v-tab value="extended_properties">Extended Properties</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="contact_info">
                    <v-card flat>
                        <v-card-text>
                            <v-form ref="form">
                                <v-row justify="center" class="mt-5">
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="type" :rules="[typeRule]" label="Type"
                                            :items="typeItems" density="compact"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="title" :rules="[titleRule]" label="Title"
                                            :items="titleItems" density="compact"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="customer_status" :rules="[customerstatusRule]"
                                            label="Customer Status" :items="customerstatusItems"
                                            density="compact"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="first_name" :rules="[firstnameRule]" label="First Name"
                                            density="compact" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="middle_name" :rules="[middlenameRule]"
                                            label="Middle Name" density="compact" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="last_name" :rules="[lastnameRule]" label="Last Name"
                                            density="compact" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="initial" label="Initial (optional)"
                                            density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="display_name" :rules="[displaynameRule]"
                                            label="Display Name" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="staff_or_not" :rules="[staffornotRule]"
                                            label="Staff or Not" :items="staffornotItems"
                                            density="compact"></v-autocomplete>
                                    </v-col>
                                </v-row>

                                <v-card border="opacity-50 sm" class="mx-auto">
                                    <v-card-title>
                                        <h4 class="text-grey-lighten-1">Personal Information</h4>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row justify="center">
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-text-field v-model="tin" :rules="[tinRule]" label="Tin"
                                                    density="compact" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-autocomplete v-model="gender" :rules="[genderRule]" label="Gender"
                                                    :items="genderItems" density="compact"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                                <v-autocomplete v-model="civil_status" :rules="[civilstatusRule]"
                                                    label="Civil status" :items="civilstatusItems"
                                                    density="compact"></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="address">
                    <v-card flat>
                        <v-card-text>
                            Address
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
            staffornotRule: (v) => !!v || 'This is Required',
            staff_or_not: '',
            staffornotItems: ['Staff', 'Not a staff'],
            tin: '',
            tinRule: (v) => !!v || 'Tin is Required',
            gender: '',
            genderRule: (v) => !!v || 'Gender is Required',
            genderItems: ['000 - Male', '001 - Female'],
            civilstatusRule: (v) => !!v || 'Civil status is Required',
            civil_status: '',
            civilstatusItems: ['D00 - Divored', 'M00 - Married', 'S00 - Single', 'W00 - Widowed'],
        };
    },
};
</script>
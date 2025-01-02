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
                        <!-- Basic Information -->
                        <v-card border="opacity-50 sm" class="mb-10">
                            <v-container>
                                <div class="d-flex align-items-center justify-space-between">
                                    <h3 class="mb-4">Basic Information</h3>
                                    <v-btn :disabled="isIdentityCheckDisabled" @click="openConfirmIdentityDialog" prepend-icon="mdi-magnify" variant="tonal" class="bg-teal-darken-3 mb-3 to-hide" rounded>
                                        <span>Check&nbsp;</span>Identity
                                    </v-btn>
                                </div>
                                <v-row justify="center">
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="first_name" :rules="[firstnameRule]" label="First Name"
                                            variant="underlined" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="middle_name" :rules="[middlenameRule]"
                                            label="Middle Name" variant="underlined" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="last_name" :rules="[lastnameRule]" label="Last Name"
                                            variant="underlined" clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12" style="display: none;">
                                        <v-text-field v-model="display_name" :rules="[displaynameRule]"
                                            label="Display Name" variant="underlined" disabled></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="suffix" label="Suffix" :items="suffixesItems"
                                            item-title="suffix" item-value="id" variant="underlined">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-text-field v-model="initial" label="Initial (optional)" variant="underlined"
                                            clearable></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="type" :rules="[typeRule]" label="Type"
                                            :items="typeItems" item-title="type" item-value="id" variant="underlined">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="title" :rules="[titleRule]" label="Title"
                                            :items="titleItems" item-title="title" item-value="id"
                                            variant="underlined"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-autocomplete v-model="client_status" :rules="[clientstatusRule]"
                                            label="Client Status" :items="clientstatusItems" item-title="client_status"
                                            item-value="id" variant="underlined"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                                        <v-checkbox v-model="staff_or_not" color="success" label="Staff"></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                        <v-row>
                            <!-- Personal Information -->
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                <v-card border="opacity-50 sm" class="mb-5">
                                    <v-container>
                                        <h3 class="mb-4">Personal Information</h3>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-autocomplete v-model="gender" :rules="[genderRule]"
                                                            label="Gender" :items="genderItems" item-title="gender"
                                                            item-value="id" variant="underlined"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-autocomplete v-model="civil_status"
                                                            :rules="[civilstatusRule]" label="Civil status"
                                                            :items="civilstatusItems" item-title="civil_status"
                                                            item-value="id" variant="underlined"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field variant="underlined" disabled>Birthdate: {{
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
                            <!-- Address -->
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                <v-card border="opacity-50 sm" class="mb-5">
                                    <v-container>
                                        <h3 class="mb-4">Address</h3>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="address_line1" :rules="[addressline1Rule]"
                                                    label="Barangay" variant="underlined" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="address_line2" :rules="[addressline2Rule]"
                                                    label="City/Municipality" variant="underlined"
                                                    clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="address_line3" :rules="[addressline3Rule]"
                                                    label="Province" variant="underlined" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="postal_code" :rules="[postalcodeRule]"
                                                    label="Postal Code" variant="underlined" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="telephone" label="Telephone (optional)"
                                                    variant="underlined" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="fax" label="Fax (optional)" variant="underlined"
                                                    clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="address_type" :rules="[addresstypeRule]"
                                                    label="Address Type" :items="addresstypeItems"
                                                    item-title="address_type" item-value="id"
                                                    variant="underlined"></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <!-- Client Classification Codes -->
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                <v-card border="opacity-50 sm" class="mb-5">
                                    <v-container>
                                        <h3 class="mb-4">Client Classification Codes</h3>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="institution" :rules="[institutionRule]"
                                                    label="Institution" :items="institutionItems"
                                                    item-title="institution" item-value="id"
                                                    variant="underlined"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="entity" :rules="[entityRule]" label="Entity"
                                                    :items="entityItems" item-title="entity" item-value="id"
                                                    variant="underlined"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="employment" :rules="[employmentRule]"
                                                    label="Employment" :items="employmentItems" item-title="employment"
                                                    item-value="id" variant="underlined"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-file-input v-model="image_file" @change="previewImage" :rules="[imagefileRule]"
                                                    accept="image/*" label="Image file" append-inner-icon="mdi-camera"
                                                    prepend-icon="" variant="underlined" chips show-size >
                                                </v-file-input>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <!-- Contact Information -->
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                <v-card border="opacity-50 sm" class="mb-5">
                                    <v-container>
                                        <h3 class="mb-4">Contact Information</h3>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="mobile1" :rules="[mobile1Rule]"
                                                            label="Mobile 1" variant="underlined"
                                                            clearable></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="mobile2" label="Mobile 2 (optional)"
                                                            variant="underlined" clearable></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="email" type="email" :rules="[emailRule]"
                                                            label="Email" variant="underlined" clearable></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="nationality" :rules="[nationalityRule]"
                                                            label="Nationality" variant="underlined"
                                                            clearable></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <!-- Related Contacts -->
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                <v-card border="opacity-50 sm" class="mb-5">
                                    <v-container>
                                        <div class="d-flex align-items-center justify-space-between">
                                            <h3 class="mb-4">Related Contacts</h3>
                                            <v-btn class="bg-teal-darken-3 mb-3" @click="searchRltdCntct"
                                                prepend-icon="mdi-magnify" rounded>
                                                <span class="to-hide">Search&nbsp; Contact</span></v-btn>
                                        </div>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="rel_cid" label="Relation CID"
                                                    variant="underlined" disabled></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="rel_display_name" label="Name"
                                                    variant="underlined" disabled></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete v-model="relationship"
                                                    label="Relationship" :items="relationshipItems" item-title="relationship"
                                                    item-value="id" variant="underlined"></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <!-- Authentication -->
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                                <v-card border="opacity-50 sm" class="mb-5">
                                    <v-container>
                                        <h3 class="mb-4">Authentication Codes</h3>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="message_id" :rules="[message_idRule]"
                                                    label="Message ID" variant="underlined" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="token" :rules="[tokenRule]" label="Token"
                                                    variant="underlined" clearable></v-text-field>
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

        <!-- Dialog for identity submission -->
        <v-dialog v-model="confirmIdentityDialog" max-width="700px">
            <v-card>
                <v-card-title class="headline">Confirmation</v-card-title>
                <v-card-text>
                    Every checking of identity has a subscription from e-KYC API Provider. Make it sure to fill in the
                    exact name before you click Confirm button.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3 mb-4" prepend-icon="mdi-close-circle"
                        @click="confirmIdentityDialog = false" rounded>Close</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3 me-4 mb-4" prepend-icon="mdi-check" @click="confirmCheck"
                        rounded>Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog for submission confirmation -->
        <v-dialog v-model="confirmDialog" max-width="1000px">
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
                                    <img v-if="imgSrc" :src="imgSrc" width="241"
                                        style="border: 1px solid #ccc ;border-radius: 10px;" alt="Client Image" />
                                </p>
                            </v-container>
                        </div>
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
                                <p><span class="text-grey-lighten-1">Display Name: </span><strong>{{ display_name
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Suffix: </span><strong>{{
                                    getTitle(suffix, suffixesItems, 'suffix') }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Initial (optional): </span><strong>{{ initial
                                        }}</strong> </p>
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
                                <p><span class="text-grey-lighten-1">Staff: </span><strong>{{ staffLabel }}</strong> </p>
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
                                <p><span class="text-grey-lighten-1">Mobile 1: </span><strong>{{ mobile1 }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Mobile 2 (optional): </span><strong>{{ mobile2
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Email: </span><strong>{{ email }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Nationality: </span><strong>{{ nationality
                                        }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Barangay: </span><strong>{{ address_line1
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">City/Municipality: </span><strong>{{ address_line2
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Province: </span><strong>{{ address_line3
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
                                <p><span class="text-grey-lighten-1">Telephone (optional): </span><strong>{{ telephone
                                        }}</strong></p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Fax (optional): </span><strong>{{ fax }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Institution: </span><strong>{{
                                    getTitle(institution, institutionItems, 'institution') }}</strong> </p>
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
                                <p><span class="text-grey-lighten-1">Related CID: </span><strong>{{ rel_cid }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Related person's name: </span><strong>{{
                                    rel_display_name }}</strong> </p>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="4">
                                <p><span class="text-grey-lighten-1">Relationship: </span><strong>{{ getTitle(relationship,
                                    relationshipItems, 'relationship')
                                        }}</strong> </p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" text @click="closeConfirmDialog"
                        rounded>Check again</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-check" text @click="submitForm"
                        rounded>Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog for searching realted contact -->
        <v-dialog v-model="searchRltdDialog" max-width="700px">
            <v-card>
                <v-card-title>
                    <span class="headline">Related Contacts</span>
                </v-card-title>
                <v-card-text>
                    <div class="text-center w-100 mt-10">
                        <v-text-field v-model="search_relation_info" label="Search CID or last name..."
                            @keyup.enter="searchRelationInfo"></v-text-field>
                        <v-btn :disabled="!searchRelationValid || validatingRelation" @click="searchRelationInfo"
                            prepend-icon="mdi-magnify" variant="tonal" class="bg-teal-darken-4 ms-2" size="large" rounded>Search</v-btn>
                    </div>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" text
                        @click="closeSrchContactDialog" rounded>Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog for viewing relation basic info -->
        <v-dialog v-model="singleRltnDialog" transition="dialog-bottom-transition" width="1000px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Relation Basic Info</span>
                </v-card-title>
                <ClientDataMixin :client="singleRelation" :skeletonLoader="skeletonLoader" :imageCard="imageCard"
                    :imageSource="imageSource" :typeItems="typeItems" :titleItems="titleItems"
                    :clientstatusItems="clientstatusItems" :genderItems="genderItems"
                    :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems"
                    :institutionItems="institutionItems" :entityItems="entityItems"
                    :employmentItems="employmentItems" :relationshipItems="relationshipItems" />
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
                        @click="closeSnglRltnDialog" rounded>Close</v-btn>
                    <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-check" @click="selectFrmSnglRltn"
                        rounded>Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog for viewing multiple contacts -->
        <v-dialog v-model="multipleRltnDialog" transition="dialog-bottom-transition" width="700px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Relations Basic Info</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-data-table :headers="headers" :items="multipleRelation" item-key="cid" class="elevation-1">
                            <template v-slot:loading>
                                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-btn @click="selectFrmMltplRltn(item)" class="bg-teal-darken-4" rounded>Select</v-btn>
                                <v-btn @click="viewFrmMltplRltn(item)" class="bg-teal-darken-4 ms-2 ps-6"
                                    prepend-icon="mdi-eye-outline" rounded></v-btn>
                            </template>
                        </v-data-table>
                    </v-container>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
                        @click="closeMltplRltnDialog" rounded>Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
            <div class="d-flex align-items-center justify-space-between">
                {{ snackbar.message }}
            </div>
        </v-snackbar>
    </v-container>
</template>

<script>
import apiClient from '../axios';
import watchlistData from '@/temp/watchlist.json';
import { debounce } from 'lodash';
import FormDataMixin from '@/components/FormDataMixin.vue';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
    mixins: [FormDataMixin],
    components: {
        ClientDataMixin
    },
    data() {
        return {
            search_relation_info: "",
            imgSrc: null,
            skeletonLoader: false,
            searchRltdDialog: false,
            singleRltnDialog: false,
            validatingRelation: false,
            singleRelation: null,
            multipleRelation: [],
            multipleRltnDialog: false,
        }
    },
    created() {
        this.checkIdentity = debounce(this.checkIdentity, 300);
    },
    watch: {
        first_name: 'checkIdentityWebhooks',
        middle_name: 'checkIdentityWebhooks',
        last_name: 'checkIdentityWebhooks',
        'singleRelation.image_file': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.fetchClientImage(newValue);
                }
            },
        },
    },
    computed: {
        searchRelationValid() {
            return this.search_relation_info.trim() !== '';
        },
        staffLabel() {
            return this.staff_or_not === 2 ? 'No' : 'Yes';
        },
    },
    methods: {
        checkIdentityWebhooks() {
            this.checkIdentity();
        },
        openConfirmIdentityDialog() {
            this.confirmIdentityDialog = true;
        },
        confirmCheck() {
            this.confirmIdentityDialog = false;
            this.checkWatchlist();
        },
        searchRltdCntct() {
            this.searchRltdDialog = true;
        },
        closeSnglRltnDialog() {
            this.singleRltnDialog = false;
        },
        closeSrchContactDialog() {
            this.searchRltdDialog = false;
            this.singleRltnDialog = false;
        },
        closeConfirmDialog() {
            this.confirmDialog = false;
        },
        selectFrmSnglRltn() {
            if (this.singleRelation) {
                this.rel_cid = this.singleRelation.cid;
                this.rel_display_name = this.singleRelation.display_name;
                this.singleRltnDialog = false;
                this.searchRltdDialog = false;
                this.multipleRltnDialog = false;
                this.showSnackbar('Related contact has been added successfully!', 'success');
            } else {
                this.showSnackbar('No related contact selected!', 'warning');
            }
            this.singleRltnDialog = false;
        },
        closeMltplRltnDialog() {
            this.multipleRltnDialog = false;
        },
        viewFrmMltplRltn(item) {
            this.singleRelation = item; // Set the selected item
            this.singleRltnDialog = true; // Open the dialog
        },
        previewImage() {
            if (this.image_file && this.image_file instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                this.imgSrc = e.target.result;
                };
                reader.readAsDataURL(this.image_file);
            } else {
                this.imgSrc = null;
            }
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
                    this.showSnackbar('Name is on the watchlist.', 'error');
                } else {
                    this.showSnackbar('Name is NOT on the watchlist. You can now proceed!', 'success');
                }
            } catch (error) {
                this.showSnackbar('Error checking watchlist. Refresh the page!', 'error');
            }
        },
        async searchRelationInfo() {
            if (!this.searchRelationValid) return;
            this.validatingRelation = true;
            try {
                const response = await apiClient.get('/client_info', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    },
                    params: { search: this.search_relation_info }
                });
                const myRelation = response.data.map(client => ({
                    ...client,
                }));
                if (myRelation.length === 1) {
                    this.singleRelation = myRelation[0];
                    this.singleRltnDialog = true;
                    this.skeletonLoader = true;
                    this.imageCard = false
                    setTimeout(() => {
                        this.loading = false;
                        this.skeletonLoader = false
                        this.imageCard = true
                    }, 1000)
                } else if (myRelation.length > 1) {
                    this.multipleRelation = myRelation;
                    this.multipleRltnDialog = true;
                } else {
                    this.showSnackbar('No record found!', 'error');
                }
            } catch (error) {
                this.showSnackbar('An error occurred while searching!', 'error');
            } finally {
                this.validatingRelation = false;
            }
        },
        async selectFrmMltplRltn(infoFrmMltplRltn) {
            try {
                const response = await apiClient.get('/client_info', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    params: { search: infoFrmMltplRltn.cid },
                });
                const myRelation = response.data[0];
                if (myRelation) {
                    this.rel_cid = myRelation.cid;
                    this.rel_display_name = myRelation.display_name;
                    this.searchRltdDialog = false;
                    this.multipleRltnDialog = false;
                    this.showSnackbar('Related contact has been added successfully!', 'success');
                } else {
                    this.showSnackbar('No additional details found!', 'info');
                }
            } catch (error) {
                this.showSnackbar('An error occurred while selecting the item!', 'error');
            }
        },
        async fetchClientImage(imageFileName) {
            try {
                const response = await apiClient.get(`/client_image/${imageFileName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    responseType: 'blob',
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                this.imageSource = URL.createObjectURL(blob);
            } catch (error) {
                console.error('Error fetching client image:', error);
                this.imageSource = "";
            }
        },
        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
            this.skeletonLoader = true;
            this.imgSrc = false;
            setTimeout(() => {
                this.skeletonLoader = false;
                this.imgSrc = true;
                this.imgSrc = URL.createObjectURL(this.image_file);
            }, 1000);
        },
        async submitForm() {
            this.validating = true;
            try {
                if (this.$refs.form.validate()) {
                    const formData = new FormData();
                    const fields = [
                        'type', 'title', 'client_status', 'first_name', 'middle_name', 'last_name',
                        'display_name', 'suffix', 'initial', 'gender', 'civil_status', 'birthdate',
                        'mobile1', 'mobile2', 'email', 'nationality', 'address_line1', 'address_line2',
                        'address_line3', 'postal_code', 'address_type', 'telephone', 'fax', 'institution',
                        'entity', 'employment', 'image_file', 'relationship', 
                        // 'rel_cid', 'rel_display_name',
                        'message_id', 'token'
                    ];
                    // CHANGE TO PH TIMEZONE
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
                    formData.append('staff_or_not', Number(this.staff_or_not));
                    const response = await apiClient.post('/new_client_info', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    });
                    if (response.status === 200) {
                        this.showSnackbar('New client has been saved successfully.', 'success');
                        this.confirmDialog = false;
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
<template>
  <v-container>
    <div class="d-flex align-items-center">
      <v-icon @click="goBack" class="mt-2 me-3" size="x-large" icon="mdi-chevron-double-left" title="Back"></v-icon>
      <h1>Edit Client</h1>
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
                  <!-- Form Fields -->
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="first_name" :rules="[firstnameRule]" label="First Name" outlined
                      clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="middle_name" :rules="[middlenameRule]" label="Middle Name" outlined
                      clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="last_name" :rules="[lastnameRule]" label="Last Name" outlined
                      clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="type" :rules="[typeRule]" label="Type" :items="typeItems" item-title="type"
                      item-value="id"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="title" :rules="[titleRule]" label="Title" :items="titleItems"
                      item-title="title" item-value="id"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-autocomplete v-model="client_status" :rules="[clientstatusRule]" label="Client Status"
                      :items="clientstatusItems" item-title="client_status" item-value="id"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="initial" label="Initial" outlined clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="display_name" :rules="[displaynameRule]" label="Display Name"
                      disabled></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-checkbox v-model="staff_or_not" :color="checkboxColor" label="Staff"></v-checkbox>
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
                            <v-autocomplete v-model="gender" :rules="[genderRule]" label="Gender" :items="genderItems"
                              item-title="gender" item-value="id"></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete v-model="civil_status" :rules="[civilstatusRule]" label="Civil status"
                              :items="civilstatusItems" item-title="civil_status" item-value="id"></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <div class="d-flex">
                              <v-text-field type="date" v-model="birthdate" width="80"
                                class="custom-date-input"></v-text-field>
                              <v-text-field disabled width="700">Birthdate: {{ formattedBirthdate }}</v-text-field>
                            </div>
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
                            <v-text-field v-model="mobile1" :rules="[mobile1Rule]" label="Mobile 1" outlined
                              clearable></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field v-model="mobile2" label="Mobile 2" outlined clearable></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field v-model="email" :rules="[emailRule]" label="Email" outlined
                              clearable></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field v-model="nationality" :rules="[nationalityRule]" label="Nationality" outlined
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
                          label="Street/Purok/Sitio/Hda." clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="address_line2" :rules="[addressline2Rule]" label="Barangay"
                          clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="address_line3" :rules="[addressline3Rule]" label="City"
                          clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="postal_code" :rules="[postalcodeRule]" label="Postal Code"
                          clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="address_type" :rules="[addresstypeRule]" label="Address Type"
                          :items="addresstypeItems" item-title="address_type" item-value="id"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="telephone" label="Telephone" clearable></v-text-field>
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
                        <v-autocomplete v-model="institution" :rules="[institutionRule]" label="Institution"
                          :items="institutionItems" item-title="institution" item-value="id"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="entity" :rules="[entityRule]" label="Entity" :items="entityItems"
                          item-title="entity" item-value="id"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="employment" :rules="[employmentRule]" label="Employment"
                          :items="employmentItems" item-title="employment" item-value="id"></v-autocomplete>
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
        <v-btn @click="onRefresh" prepend-icon="mdi-refresh" class="bg-red-darken-4" size="large" variant="tonal"
          height="40" width="135" rounded>Reset</v-btn>
        <v-btn :disabled="!isFormValid || validating" @click="showConfirmDialog" prepend-icon="mdi-check"
          class="bg-teal-darken-3 ms-2 mb-8" size="large" variant="tonal" height="40" width="135" rounded>
          Submit
        </v-btn>
      </div>
    </v-form>

    <!-- Check Identiy Dialog -->
    <v-dialog v-model="confirmIdentityDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>
          Every checking of identity has a subscription from e-KYC API Provider. Make it sure to fill in the
          exact name before you click Confirm button.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3 mb-4" prepend-icon="mdi-close-circle"
            @click="confirmIdentityDialog = false" rounded>Check again</v-btn>
          <v-btn class="bg-teal-darken-3 px-3 me-4 mb-4" prepend-icon="mdi-check" @click="confirmCheck"
            rounded>Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog" transition="dialog-bottom-transition" width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Confirm Submission</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">First Name: <br /></span><strong>{{ first_name }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Middle Name: <br /></span><strong>{{ middle_name }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Last Name: <br /></span><strong>{{ last_name }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Display Name: <br /></span><strong>{{ display_name }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Title: <br /></span><strong>{{ getTitle(title, titleItems, 'title')
                    }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Initial: <br /></span><strong>{{ initial }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Type: <br /></span><strong>{{ getTitle(type, typeItems, 'type')
                    }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Staff: <br /></span><strong>{{ staffLabel }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Gender: <br /></span><strong>{{ getTitle(gender, genderItems,
                  'gender') }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Civil Status: <br /></span><strong>{{ getTitle(civil_status,
                  civilstatusItems, 'civil_status') }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Birthdate: <br /></span><strong>{{ formattedBirthdate }}</strong>
                </p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Mobile 1: <br /></span><strong>{{ mobile1 }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Mobile 2: <br /></span><strong>{{ mobile2 }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Email: <br /></span><strong>{{ email }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Nationality: <br /></span><strong>{{ nationality }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 1: <br /></span><strong>{{ address_line1 }}</strong>
                </p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 2: <br /></span><strong>{{ address_line2 }}</strong>
                </p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 3: <br /></span><strong>{{ address_line3 }}</strong>
                </p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Postal Code: <br /></span><strong>{{ postal_code }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Type: <br /></span><strong>{{ getTitle(address_type,
                  addresstypeItems, 'address_type') }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Telephone: <br /></span><strong>{{ telephone }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Fax: <br /></span><strong>{{ fax }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Institution: <br /></span><strong>{{ getTitle(institution,
                  institutionItems,
                  'institution') }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Entity: <br /></span><strong>{{ getTitle(entity, entityItems,
                  'entity') }}</strong></p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Employment: <br /></span><strong>{{ getTitle(employment,
                  employmentItems, 'employment') }}</strong></p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" @click="closeConfirmDialog"
            rounded>Cancel</v-btn>
          <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-check" @click="submitForm" rounded>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar ref="snackbarRef" />

  </v-container>
</template>


<script>
import apiClient from '../axios';
import FormDataMixin from '@/components/FormDataMixin.vue';
import Snackbar from '@/components/Snackbar.vue';

export default { 
  mixins: [FormDataMixin],
  components: {
    Snackbar
  },
  created() {
    this.fetchCID_LastName();
  },
  computed: {
    staffLabel: {
      // return this.staff_or_not === 2 ? 'No' : 'Yes';
        get() {
        return this.staff_or_not === 2;
      },
      set(value) {
        this.staff_or_not = value ? 2 : 1;
      },
    },
    // isStaff: {
    //   get() {
    //     return this.staff_or_not === 2;
    //   },
    //   set(value) {
    //     this.staff_or_not = value ? 1 : 2;
    //   },
    // },
    checkboxColor() {
      return this.staff_or_not === 1 ? 'primary' : 'secondary';
    },
  },
  methods: {
    goBack() {
        this.$router.go(-1);
    },
    toClientInfo() {
      this.$router.push({ name: 'ClientInfo' });
    },
    openConfirmIdentityDialog() {
      this.confirmIdentityDialog = true;
    },
    confirmCheck() {
      this.confirmIdentityDialog = false;
      this.checkWatchlist();
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
    },
    async fetchClientData(cid, last_name) {
      this.validating = true;
      try {
        const response = await apiClient.get(`/show_client_info/${cid}/${last_name}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const client = response.data;
        Object.assign(this, client);
        this.staff_or_not = client.staff_or_not;
      } catch (error) {
        this.handleFormError(error);
      } finally {
        this.validating = false;
      }
    },
    fetchCID_LastName() {
      const { cid, last_name } = this.$route.params;
      if (cid && last_name) {
        this.fetchClientData(cid, last_name);
      }
    },
    onRefresh() {
      this.fetchCID_LastName();
    },
    showConfirmDialog() {
      if (this.isFormValid) this.confirmDialog = true;
      this.skeletonLoader = true;
      this.imageCard = false;
      setTimeout(() => {
        this.skeletonLoader = false;
      }, 1000);
    },
    async submitForm() {
      this.confirmDialog = false;
      this.validating = true;
      this.to_HomePage = true
      try {
        await this.checkIdentity();
        if (this.snackbar.color === 'error') {
          this.validating = false;
          return;
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar('Error during identity check. Please try again.', 'error');
        this.validating = false;
        return;
      }

      const formData = new FormData();
      for (const key in this.$data) {
        if (
          Object.prototype.hasOwnProperty.call(this, key) &&
          key !== 'dialog' &&
          key !== 'validating'
        ) {
          formData.append(key, this[key]);
          formData.append('staff_or_not', Number(this.staff_or_not));
        }
      }
      try {
        const response = await apiClient.post(`/update_client_info/${this.cid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        if (response.status === 200) {
          this.$refs.snackbarRef.showSnackbar('New client has been saved successfully.', 'success');
          this.confirmDialog = false;
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar('Error updating client information.', 'error');
      } finally {
        this.validating = false;
      }
    },
  },
};
</script>

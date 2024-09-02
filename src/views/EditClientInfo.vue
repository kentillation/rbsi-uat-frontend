<template>
  <v-container>
    <h1>Edit Client</h1>
    <v-form @submit.prevent="showConfirmDialog" ref="form">
      <v-sheet elevation="3" rounded="lg">
        <v-card>
          <v-card-text>
            <v-card border="opacity-50 sm" class="mb-10">
              <v-container>
                <h3 class="mb-4">Basic Information</h3>
                <v-row justify="center">
                  <!-- Form Fields -->
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="first_name" :rules="[firstnameRule]" label="First Name"
                      outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="middle_name" :rules="[middlenameRule]" label="Middle Name"
                      outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="last_name" :rules="[lastnameRule]" label="Last Name" outlined></v-text-field>
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
                    <v-text-field v-model="initial" label="Initial" outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-text-field v-model="display_name" :rules="[displaynameRule]" label="Display Name"
                      disabled></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="12">
                    <v-checkbox v-model="staff_or_not" label="Staff" color="primary"></v-checkbox>
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
                            <v-text-field v-model="tin" label="TIN" clearable></v-text-field>
                          </v-col>
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
                              <!-- <v-date-picker :min="minDate" :max="maxDate" v-model="birthdate"></v-date-picker> -->
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
                            <v-text-field v-model="mobile1" :rules="[mobile1Rule]" label="Mobile 1"
                              outlined></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field v-model="mobile2" label="Mobile 2" outlined></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field v-model="email" :rules="[emailRule]" label="Email" outlined></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field v-model="nationality" :rules="[nationalityRule]" label="Nationality"
                              outlined></v-text-field>
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
                        <v-text-field v-model="address_line1" :rules="[addressline1Rule]" label="Line 1"
                          clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="address_line2" :rules="[addressline2Rule]" label="Line 2"
                          clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="address_line3" :rules="[addressline3Rule]" label="Line 3"
                          clearable></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="address_line4" :rules="[addressline4Rule]" label="Line 4"
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
                        <v-autocomplete v-model="undef" :rules="[undefRule]" label="Undefined" :items="undefItems"
                          item-title="undef" item-value="id"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="entity" :rules="[entityRule]" label="Entity" :items="entityItems"
                          item-title="entity" item-value="id"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="employment" :rules="[employmentRule]" label="Employment"
                          :items="employmentItems" item-title="employment" item-value="id"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-file-input v-model="image_file" :rules="[imagefileRule]" accept="image/*" label="Image file"
                          append-inner-icon="mdi-camera" prepend-icon="" chips show-size>
                        </v-file-input>
                        <p v-if="imageSrc">
                          <img :src="imageSrc" width="195" alt="Client Image" />
                        </p>
                        <p v-else>
                          No image available
                        </p>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="cus_lang_pref" label="Client Language Preferences"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="tax_code" :rules="[taxcodeRule]" label="Client Tax Code"
                          :items="taxcodeItems" item-title="tax_code" item-value="id"></v-autocomplete>
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
        <v-btn :disabled="loading" @click="onRefresh" prepend-icon="mdi-refresh" class="bg-red-darken-4" size="large"
          variant="tonal" height="40" width="135" rounded>Reset</v-btn>
        <v-btn :disabled="!isFormValid || validating" @click="showConfirmDialog" prepend-icon="mdi-check"
          class="bg-teal-darken-3 ms-2 mb-8" size="large" variant="tonal" :loading="validating" height="40" width="135"
          rounded>
          Submit
        </v-btn>
      </div>
    </v-form>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>{{ snackbar.message }}</v-snackbar>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Confirm Submission</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <p><span class="text-grey-lighten-1">First Name: </span><strong>{{ first_name }}</strong></p>
                <p><span class="text-grey-lighten-1">Middle Name: </span><strong>{{ middle_name }}</strong></p>
                <p><span class="text-grey-lighten-1">Last Name: </span><strong>{{ last_name }}</strong></p>
                <p><span class="text-grey-lighten-1">Type: </span><strong>{{ getTitle(type, typeItems, 'type')
                    }}</strong></p>
                <p><span class="text-grey-lighten-1">Title: </span><strong>{{ getTitle(title, titleItems, 'title')
                    }}</strong></p>
                <p><span class="text-grey-lighten-1">Client Status: </span><strong>{{ getTitle(client_status,
                  clientstatusItems, 'client_status') }}</strong></p>
                <p><span class="text-grey-lighten-1">Initial: </span><strong>{{ initial }}</strong></p>
                <p><span class="text-grey-lighten-1">Display Name: </span><strong>{{ display_name }}</strong></p>
                <p><span class="text-grey-lighten-1">Staff: </span><strong>{{ staff_or_not ? 'Yes' : 'No' }}</strong>
                </p>
                <p><span class="text-grey-lighten-1">TIN: </span><strong>{{ tin }}</strong></p>
                <p><span class="text-grey-lighten-1">Gender: </span><strong>{{ getTitle(gender, genderItems, 'gender')
                    }}</strong></p>
                <p><span class="text-grey-lighten-1">Civil Status: </span><strong>{{ getTitle(civil_status,
                  civilstatusItems, 'civil_status') }}</strong></p>
                <p><span class="text-grey-lighten-1">Birthdate: </span><strong>{{ formattedBirthdate }}</strong></p>
                <p><span class="text-grey-lighten-1">Mobile 1: </span><strong>{{ mobile1 }}</strong></p>
                <p><span class="text-grey-lighten-1">Mobile 2: </span><strong>{{ mobile2 }}</strong></p>
                <p><span class="text-grey-lighten-1">Email: </span><strong>{{ email }}</strong></p>
                <p><span class="text-grey-lighten-1">Nationality: </span><strong>{{ nationality }}</strong></p>
                <p><span class="text-grey-lighten-1">Address Line 1: </span><strong>{{ address_line1 }}</strong></p>
                <p><span class="text-grey-lighten-1">Address Line 2: </span><strong>{{ address_line2 }}</strong></p>
                <p><span class="text-grey-lighten-1">Address Line 3: </span><strong>{{ address_line3 }}</strong></p>
                <p><span class="text-grey-lighten-1">Address Line 4: </span><strong>{{ address_line4 }}</strong></p>
                <p><span class="text-grey-lighten-1">Postal Code: </span><strong>{{ postal_code }}</strong></p>
                <p><span class="text-grey-lighten-1">Address Type: </span><strong>{{ getTitle(address_type,
                  addresstypeItems, 'address_type') }}</strong></p>
                <p><span class="text-grey-lighten-1">Telephone: </span><strong>{{ telephone }}</strong></p>
                <p><span class="text-grey-lighten-1">Fax: </span><strong>{{ fax }}</strong></p>
                <p><span class="text-grey-lighten-1">Undefined: </span><strong>{{ getTitle(undef, undefItems, 'undef')
                    }}</strong></p>
                <p><span class="text-grey-lighten-1">Entity: </span><strong>{{ getTitle(entity, entityItems, 'entity')
                    }}</strong></p>
                <p><span class="text-grey-lighten-1">Employment: </span><strong>{{ getTitle(employment, employmentItems,
                  'employment') }}</strong></p>
                <p><span class="text-grey-lighten-1">Client Language Preferences: </span><strong>{{ cus_lang_pref
                    }}</strong></p>
                <p><span class="text-grey-lighten-1">Client Tax Code: </span><strong>{{ getTitle(tax_code, taxcodeItems,
                  'tax_code') }}</strong></p>
                <p><span class="text-grey-lighten-1">Image File: </span></p>
                <p>
                  <img :src="imageSrc" width="195" alt="Client Image" />
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" size="large" prepend-icon="mdi-close-circle" variant="tonal" @click="dialog = false" rounded>Cancel</v-btn>
          <v-btn class="bg-teal-darken-3 px-3" size="large" prepend-icon="mdi-cloud-download" variant="tonal" @click="saveForm" rounded>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import apiClient from '../axios';

export default {
  data() {
    return {
      dialog: false,
      first_name: '',
      middle_name: '',
      last_name: '',
      type: '',
      title: null,
      client_status: null,
      initial: '',
      display_name: '',
      staff_or_not: false,
      tin: '',
      gender: null,
      civil_status: null,
      birthdate: null,
      // pickerVisible: false,
      // minDate: '1930-01-01',
      // maxDate: this.formatToDateString(new Date()),
      timezone: 'Asia/Manila',
      mobile1: '',
      mobile2: '',
      email: '',
      nationality: 'Filipino',
      address_line1: '',
      address_line2: '',
      address_line3: '',
      address_line4: '',
      postal_code: '',
      address_type: null,
      telephone: '',
      fax: '',
      undef: null,
      entity: null,
      employment: null,
      image_file: null,
      image_url: '',
      cus_lang_pref: 'English - US',
      tax_code: null,
      validating: false,
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      undefItems: [],
      entityItems: [],
      employmentItems: [],
      taxcodeItems: [],
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
      addressline1Rule: (v) => !!v || 'Address Line 1 is required',
      addressline2Rule: (v) => !!v || 'Address Line 2 is required',
      addressline3Rule: (v) => !!v || 'Address Line 3 is required',
      addressline4Rule: (v) => !!v || 'Address Line 4 is required',
      postalcodeRule: (v) => !!v || 'Postal Code is required',
      addresstypeRule: (v) => !!v || 'Address type is required',
      undefRule: (v) => !!v || 'Undefined code is required',
      entityRule: (v) => !!v || 'Entity code is required',
      employmentRule: (v) => !!v || 'Employment code is required',
      imagefileRule: (v) => !!v || 'Image file is required',
      taxcodeRule: (v) => !!v || 'Client Tax Code is required',
      snackbar: {
        visible: false,
        message: '',
        color: ''
      }
    };
  },
  created() {
    this.fetchCID_LastName();
  },
  watch: {
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
    imageSrc() {
      if (this.image_file && this.image_file instanceof File) {
        return URL.createObjectURL(this.image_file);
      }
      else if (this.image_url) {
        return this.image_url;
      }
      return '';
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
      return [
        this.type, this.title, this.client_status, this.first_name, this.middle_name,
        this.last_name, this.display_name, this.tin, this.gender, this.civil_status,
        this.birthdate, this.mobile1, this.email, this.nationality, this.address_line1,
        this.address_line2, this.address_line3, this.address_line4, this.postal_code,
        this.address_type, this.undef, this.entity, this.employment, this.image_file,
        this.cus_lang_pref, this.tax_code
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
        this.image_url = client.image_file || '';
      } catch (error) {
        this.snackbar.message = error.response && error.response.status === 404
          ? 'Client not found'
          : 'Error fetching client data';
        this.snackbar.color = 'error';
        this.snackbar.visible = true;
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
    async fetchItems(endpoint, targetArray, errorMessage) {
      try {
        const response = await apiClient.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        this[targetArray] = response.data;
      } catch (error) {
        this.showSnackbar(errorMessage, 'error');
      }
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
      this.fetchItems('/undef', 'undefItems', 'Failed to fetch undefined codes');
    },
    async fetchEntityItems() {
      this.fetchItems('/entity', 'entityItems', 'Failed to fetch entities');
    },
    async fetchEmploymentItems() {
      this.fetchItems('/employment', 'employmentItems', 'Failed to fetch employment codes');
    },
    async fetchTaxCodeItems() {
      this.fetchItems('/tax_code', 'taxcodeItems', 'Failed to fetch tax codes');
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

        if (response1.data.exists) this.showSnackbar('Name already exists in MBWin database.', 'error');
        if (response2.data.exists) this.showSnackbar('Name already exists in new database.', 'error');
      } catch (error) {
        this.showSnackbar('Error checking identity. Refresh the page!', 'error');
      }
    },
    showConfirmDialog() {
      if (this.isFormValid) this.dialog = true;
    },
    async saveForm() {
      this.dialog = false;
      this.validating = true;

      try {
        // await this.checkIdentity();
        if (this.snackbar.color === 'error') {
          this.validating = false;
          return;
        }
      } catch (error) {
        this.showSnackbar('Error during identity check. Please try again.', 'error');
        this.validating = false;
        return;
      }

      const formData = new FormData();
      for (const key in this.$data) {
        if (
          Object.prototype.hasOwnProperty.call(this, key) &&
          key !== 'dialog' &&
          key !== 'validating' &&
          key !== 'image_url'
        ) {
          formData.append(key, this[key]);
        }
      }
      if (this.image_file) formData.append('image_file', this.image_file);

      try {
        await apiClient.post(`/update_client_info/${this.cid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        this.showSnackbar('Client information updated successfully', 'success');
      } catch (error) {
        this.showSnackbar('Error updating client information.', 'error');
      } finally {
        this.validating = false;
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
    getTitle(value, items, key) {
      const item = items.find(item => item.id === value);
      return item ? item[key] : 'N/A';
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
.custom-date-input input[type="date"]::-webkit-inner-spin-button {
  display: none;
  /* Hides the spin button (Chrome/Safari) */
}

.custom-date-input input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: 15px;
  /* Adjust as needed */
  color: gray;
  /* Icon color */
  cursor: pointer;
  font-size: 25px;
}

.custom-date-input {
  position: relative;
}

.custom-date-input input[type="date"] {
  padding-left: 50px;
  /* Adjust to ensure text does not overlap with icon */
  color: transparent;
  /* Hides the text */
}

.custom-date-input input[type="date"]::-webkit-datetime-edit {
  color: transparent;
  /* For WebKit browsers */
}
</style>

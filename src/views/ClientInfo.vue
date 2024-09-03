<template>
  <v-container>
    <h1>Client Info</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
      rounded>
      <div class="d-flex justify-end w-100">
        <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" @click="toNewContact" size="large">
          New <span class="to-hide">&nbsp;Contact</span>
        </v-btn>
      </div>
      <div class="w-75 mt-10">
        <v-text-field v-model="search_item" label="Type CID or last name..." @keyup.enter="searchClients"
          :loading="validating"></v-text-field>
        <v-btn prepend-icon="mdi-magnify" class="bg-teal-lighten-3 ms-2" size="large"
          :disabled="!searchValid || validating" @click="searchClients">
          Search
        </v-btn>
      </div>
    </v-sheet>

    <!-- Dialog for viewing client details -->
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" width="1000px">
      <v-card>
        <v-card-title>
          <span class="headline">Client Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <div class="text-center">
              <h3><span class="text-grey-lighten-1">CID: </span>{{ selectedClient?.cid }}</h3>
              <!-- <p><span class="text-grey-lighten-1">Image File: </span>{{ selectedClient?.image_file }}</p> -->
              <p class="my-5"><img :src="imageSrc" width="280" style="border: 1px solid #ccc ;border-radius: 10px;" alt="Client Image" /></p>
            </div>
            <v-row>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">First Name: </span>{{ selectedClient?.first_name }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Middle Name: </span>{{ selectedClient?.middle_name }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Last Name: </span>{{ selectedClient?.last_name }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Type: </span>{{ getTitle(selectedClient?.type, typeItems,
                  'type') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Title: </span>{{ getTitle(selectedClient?.title, titleItems,
                  'title') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Client Status: </span>{{
                  getTitle(selectedClient?.client_status, clientstatusItems, 'client_status') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Initial: </span>{{ selectedClient?.initial }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Display Name: </span>{{ selectedClient?.display_name }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Staff: </span>{{ staffLabel }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">TIN: </span>{{ selectedClient?.tin }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Gender: </span>{{ getTitle(selectedClient?.gender, genderItems,
                  'gender') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Civil Status: </span>{{ getTitle(selectedClient?.civil_status,
                  civilstatusItems, 'civil_status') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Birthdate: </span>{{ selectedClient?.birthdate ?
                  formatDate(selectedClient?.birthdate) : 'N/A' }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Mobile 1: </span>{{ selectedClient?.mobile1 }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Mobile 2: </span>{{ selectedClient?.mobile2 }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Email: </span>{{ selectedClient?.email }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Nationality: </span>{{ selectedClient?.nationality }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 1: </span>{{ selectedClient?.address_line1 }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 2: </span>{{ selectedClient?.address_line2 }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 3: </span>{{ selectedClient?.address_line3 }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Line 4: </span>{{ selectedClient?.address_line4 }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Postal Code: </span>{{ selectedClient?.postal_code }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Address Type: </span>{{ getTitle(selectedClient?.address_type,
                  addresstypeItems, 'address_type') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Telephone: </span>{{ selectedClient?.telephone }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Fax: </span>{{ selectedClient?.fax }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Undefined Field: </span>{{ getTitle(selectedClient?.undef,
                  undefItems, 'undef') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Entity: </span>{{ getTitle(selectedClient?.entity, entityItems,
                  'entity') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Employment: </span>{{ getTitle(selectedClient?.employment,
                  employmentItems, 'employment') }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Language Preference: </span>{{
                  selectedClient?.cus_lang_pref }}</p>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <p><span class="text-grey-lighten-1">Tax Code: </span>{{ getTitle(selectedClient?.tax_code,
                  taxcodeItems, 'tax_code') }}</p>
              </v-col>
            </v-row>
          </v-container>
          <!--Insert table for the same last_name -->
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle" @click="dialog = false"
            rounded>Close</v-btn>
          <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-pencil" @click="toEditClientInfo" rounded>Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
  name: 'ClientInfo',
  data() {
    return {
      search_item: '',
      validating: false,
      selectedClient: null,
      dialog: false,
      snackbar: {
        visible: false,
        message: '',
        color: ''
      },
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      undefItems: [],
      entityItems: [],
      employmentItems: [],
      taxcodeItems: []
    };
  },
  computed: {
    searchValid() {
      return this.search_item.trim() !== '';
    },
    staffLabel() {
      return this.selectedClient?.staff_or_not === 1 ? 'Yes' : 'No';
    },
  },
  created() {
    if (this.selectedClient?.image_file) {
      this.fetchClientImage(this.selectedClient.image_file);
    }
  },
  watch: {
    'selectedClient.image_file': {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.fetchClientImage(newValue);
        }
      },
    },
  },
  methods: {
    async fetchClientImage(imageFileName) {
      try {
        const response = await apiClient.get(`/client_image/${imageFileName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          responseType: 'blob', // Important for handling binary data
        });

        // Create a blob URL from the response
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.imageSrc = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching client image:', error);
        this.imageSrc = ''; // Handle errors by clearing the image
      }
    },
    toNewContact() {
      this.$router.push({ name: 'NewContact' });
    },
    toEditClientInfo() {
      if (this.selectedClient) {
        this.$router.push({
          name: 'EditClientInfo',
          params: {
            cid: this.selectedClient.cid,
            last_name: this.selectedClient.last_name,
          },
        });
      }
    },
    async searchClients() {
      if (!this.searchValid) return;

      this.validating = true;
      try {
        const response = await apiClient.get('/client_info', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: { search: this.search_item }
        });

        if (response.data && response.data.length > 0) {
          this.selectedClient = response.data[0];
          this.dialog = true;
        } else {
          this.showSnackbar('No client found with the provided CID or last name', 'error');
        }
      } catch (error) {
        this.showSnackbar('An error occurred while searching for clients', 'error');
      } finally {
        this.validating = false;
      }
    },
    getTitle(id, items, titleKey) {
      const item = items.find(item => item.id === id);
      return item ? item[titleKey] : 'Unknown';
    },
    async fetchItems(endpoint, key) {
      try {
        const response = await apiClient.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this[key] = response.data;
      } catch (error) {
        this.showSnackbar(`Failed to fetch ${key}`, 'error');
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    },
  },
  mounted() {
    this.fetchItems('/types', 'typeItems');
    this.fetchItems('/titles', 'titleItems');
    this.fetchItems('/client_status', 'clientstatusItems');
    this.fetchItems('/genders', 'genderItems');
    this.fetchItems('/civil_status', 'civilstatusItems');
    this.fetchItems('/address_type', 'addresstypeItems');
    this.fetchItems('/undef', 'undefItems');
    this.fetchItems('/entity', 'entityItems');
    this.fetchItems('/employment', 'employmentItems');
    this.fetchItems('/tax_code', 'taxcodeItems');
  }
};
</script>

<style scoped>
.to-hide {
  display: none;
}
</style>

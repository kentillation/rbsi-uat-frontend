<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Client Info</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
      rounded>
      <div class="d-flex justify-end w-100">
        <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" @click="toNewContact" size="large">New</v-btn>
      </div>
      <div class="w-75 mt-10">
        <v-text-field v-model="search_item" label="Search CID or last name..." @keyup.enter="searchClients"
          :loading="validating"></v-text-field>
        <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2" size="large"
          :disabled="!searchValid || validating" @click="searchClients" rounded>
          Search
        </v-btn>
      </div>
    </v-sheet>

    <!-- Dialog for viewing client filtered details -->
    <v-dialog v-model="dialogSingle" transition="dialog-bottom-transition" width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Client Details</span>
        </v-card-title>
        <!-- <v-card-text>
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
              <h3 class="mb-7"><span class="text-grey-lighten-1">CID: </span>{{ selectedClient?.cid }}</h3>
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
        </v-card-text> -->
        <ClientDataMixin :client="selectedClient" :skeletonLoader="skeletonLoader" :imageCard="imageCard"
          :imageSrc="imageSrc" :typeItems="typeItems" :titleItems="titleItems" :clientstatusItems="clientstatusItems"
          :genderItems="genderItems" :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems"
          :undefItems="undefItems" :entityItems="entityItems" :employmentItems="employmentItems"
          :taxcodeItems="taxcodeItems" />
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline" @click="dialogSingle = false"
            rounded>Close</v-btn>
          <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-pencil-outline" @click="toEditClientInfo" rounded>Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for viewing multiple filtered client details -->
    <v-dialog v-model="dialogMultiple" transition="dialog-bottom-transition" width="1200px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Clients Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table :headers="headers" :items="multipleClients" item-key="cid" class="elevation-1">
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
              <template v-slot:item.action="{ item }">
                <div class="text-center">
                  <v-btn @click="viewItem(item)" class="bg-teal-darken-4" prepend-icon="mdi-eye-outline" rounded>View</v-btn>
                </div>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline" @click="dialogMultiple = false"
            rounded>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>
      <div class="d-flex align-items-center">
        <span><v-icon icon="mdi-information-outline"></v-icon></span>
        <span>&nbsp; {{ snackbar.message }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
import apiClient from '../axios';
import dataMixins from '@/mixins/dataMixins';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
  name: 'ClientInfo',
  mixins: [dataMixins],
  components: {
    ClientDataMixin
  },
  data() {
    return {
      validating: false,
      singleClient: null,
      multipleClients: [],
      dialogSingle: false,
      dialogMultiple: false,
      snackbar: {
        visible: false,
        message: '',
        color: ''
      },
    };
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
  computed: {
    searchValid() {
      return this.search_item.trim() !== '';
    },
  },
  methods: {
    toNewContact() {
      this.$router.push({ name: 'NewContact' });
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
        const clients = response.data.map(client => ({
          ...client,
          created_at: this.formatDate(client.created_at),
          updated_at: this.formatDate(client.updated_at)
        }));
        if (clients.length === 1) {
          this.singleClient = clients[0];
          this.selectedClient = this.singleClient;
          this.dialogSingle = true;
          this.skeletonLoader = true
          this.imageCard = false
          setTimeout(() => {
            this.loading = false;
            this.skeletonLoader = false
            this.imageCard = true
          }, 1000)
        } else if (clients.length > 1) {
          this.multipleClients = clients;
          this.dialogMultiple = true;
        } else {
          this.showSnackbar('No client record found.', 'error');
        }
      } catch (error) {
        this.showSnackbar('An error occurred while searching for clients', 'error');
      } finally {
        this.validating = false;
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
  },
};
</script>

<style scoped>
.to-hide {
  display: none;
}
</style>

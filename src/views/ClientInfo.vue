<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Client Information</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
      rounded>
      <div class="d-flex justify-end w-100">
        <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" @click="toNewContact" size="large">
          New <span class="to-hide">Information</span>
        </v-btn>
      </div>
      <div class="w-75 mt-5">
        <v-text-field v-model="search_item_CID" ref="searchItemCID" label="Search CID or last name..." @keyup.enter="searchClients"
          :loading="validating"></v-text-field>
        <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2" size="large"  variant="tonal"
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
        <ClientDataMixin :client="selectedClient" :skeletonLoader="skltnLdr" :imageCard="imgCrd"
          :imageSource="imgSrc" :typeItems="typeItems" :titleItems="titleItems" :clientstatusItems="clientstatusItems"
          :genderItems="genderItems" :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems"
          :institutionItems="institutionItems" :entityItems="entityItems" :employmentItems="employmentItems" />
        <v-card-actions class="mx-4 my-4">
          <v-btn class="bg-teal-darken-4 px-3" prepend-icon="mdi-eye-outline" @click="toClientAccountList"
            rounded>List of Accounts</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline" @click="dialogSingle = false"
            rounded>Close</v-btn>
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
                  <v-btn @click="viewItem(item)" class="bg-teal-darken-4" prepend-icon="mdi-eye-outline"
                    rounded>View</v-btn>
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

    <Snackbar ref="snackbarRef" />
  </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
  name: 'ClientInfo',
  components: {
    ClientDataMixin,
    Snackbar
  },
  data() {
    return {
      validating: false,
      singleClient: null,
      skltnLdr: false,
      imgCrd: false,
      image_file: null,
      imgSrc: null,
      search_item_CID: '',
      staff_or_not: 2,
      headers: [
        { title: 'CID', value: 'CID', sortable: false },
        { title: 'Last Name', value: 'Name1', sortable: false },
        { title: 'First Name', value: 'Name2', sortable: false },
        { title: 'Middle Name', value: 'Name3', sortable: false },
        { title: 'Display Name', value: 'DisplayName', sortable: true },
        { title: 'Created At', value: 'RegisterDate', sortable: true },
        { title: 'Updated At', value: 'LastChangeDate', sortable: true },
        { title: 'Actions', value: 'action', sortable: false }
      ],
      selectedClient: null,
      selectedImage: null,
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      institutionItems: [],
      entityItems: [],
      employmentItems: [],
      multipleClients: [],
      dialogSingle: false,
      dialogMultiple: false,
      messages: {
        noRecordFound: "No record found!",
        searchError: "An error occurred while searching for clients",
        fetchError: "Failed to fetch",
      },
      TIMEOUT_DURATION: 1000,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.searchItemCID.focus();
    });
  },
  created() {
    if (this.selectedImage?.display_name && this.selectedImage?.image_file) {
      this.fetchClientImage(this.selectedImage.display_name, this.selectedImage.image_file);
    }
  },
  computed: {
    searchValid() {
      return this.search_item_CID.trim() !== '';
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
        const response = await apiClient.get('/mbwin_client_cid_lastname', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: { search: this.search_item_CID }
        });
        const clients = response.data.map(client => ({
          ...client,
          RegisterDate: this.formatDate(client.RegisterDate),
          LastChangeDate: this.formatDate(client.LastChangeDate),
        }));

        if (clients.length === 1) {
          this.singleClient = clients[0];
          this.selectedClient = this.singleClient;
          this.dialogSingle = true;
          this.toggleSkeletonLoader(true);
          await this.fetchClientInfoByCID(this.singleClient.CID);
        } else if (clients.length > 1) {
          this.multipleClients = clients;
          this.dialogMultiple = true;
        } else {
          this.$refs.snackbarRef.showSnackbar(this.messages.noRecordFound, "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar(this.messages.searchError, "error");
      } finally {
        this.validating = false;
      }
    },
    async fetchClientInfoByCID(cid) {
      try {
        const response = await apiClient.get(`/client_info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          params: { search: cid }
        });
        const clientData = response.data;
        if (Array.isArray(clientData) && clientData.length > 0) {
          const client = clientData[0]; // Fetch only the first record
          if (client.last_name && client.first_name && client.middle_name && client.image_file) {
            this.selectedImage = {
              last_name: client.last_name,
              first_name: client.first_name,
              middle_name: client.middle_name,
              image_file: client.image_file,
            };
            const fullName = [client.last_name + ',', client.first_name, client.middle_name].filter(Boolean).join(' ');
            this.fetchClientImage(fullName, client.image_file);
          } else {
            this.selectedImage = null;
            this.imgSrc = '';
            console.warn('No image data available for the selected client.');
          }
        } else {
          console.warn('No client data found.');
          this.selectedImage = null;
          this.imgSrc = '';
        }
      } catch (error) {
        console.error('Error fetching client info by CID:', error);
        this.$refs.snackbarRef.showSnackbar(this.messages.fetchError, "error");
      }
    },
    toClientAccountList() {
      if (this.selectedClient) {
          this.$router.push({
          name: 'ClientAccountList',
          params: {
              CID: this.selectedClient.CID,
          },
          });
      }
    },
    viewItem(item) {
      this.selectedClient = {
          ...item,
          RegisterDate: this.formatDate(item.RegisterDate),
          LastChangeDate: this.formatDate(item.LastChangeDate),
      };
      this.dialogSingle = true;
      this.toggleSkeletonLoader(true);
      this.fetchClientInfoByCID(item.CID);
    },
    async fetchClientImage(folderName, imageFileName) {
      try {
        const response = await apiClient.get(`/client_image/${folderName}/${imageFileName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.imgSrc = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching client image:', error);
        this.imgSrc = '';
      }
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
        this.$refs.snackbarRef.showSnackbar(`${this.messages.fetchError} ${key}`, "error");
      }
    },
    toggleSkeletonLoader(state) {
      this.skltnLdr = state;
      this.imgCrd = !state;
      if (state) {
        setTimeout(() => {
          this.skltnLdr = false;
          this.imgCrd = true;
        }, this.TIMEOUT_DURATION);
      }
    },
    formatDate(date) {
      if (!date) return 'Invalid date';
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
          return 'Invalid date';
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
    },
  },
};
</script>

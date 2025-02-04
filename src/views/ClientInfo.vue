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
        <v-text-field v-model="search_item_CI" label="Search CID or last name..." @keyup.enter="searchClients"
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
        <ClientDataMixin :client="selectedClient" :skeletonLoader="skltnLdr" :imageCard="imgCrd"
          :imageSource="imgSrc" :typeItems="typItms" :titleItems="ttlItms" :clientstatusItems="clntsttsItms"
          :genderItems="gndrItms" :civilstatusItems="cvlsttsItms" :addresstypeItems="addresstypItms"
          :institutionItems="instttnItms" :entityItems="enttyItms" :employmentItems="emplymntItms" 
          :relationshipItems="rltnshpItms" />
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline" @click="dialogSingle = false"
            rounded>Close</v-btn>
          <v-btn class="bg-teal-darken-3 px-3" prepend-icon="mdi-pencil-outline" @click="toEditClientInfo"
            rounded>Edit</v-btn>
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
// import SomeDataMixin from '@/components/SomeDataMixin';
import ClientDataMixin from '@/components/ClientDataMixin.vue';

export default {
  name: 'ClientInfo',
  // mixins: [SomeDataMixin],
  components: {
    ClientDataMixin
  },
  data() {
    return {
      validating: false,
      singleClient: null,
      loading: true,
      skltnLdr: false,
      imgCrd: false,
      image_file: null,
      imgSrc: '',
      search_item_CI: '',
      staff_or_not: 2,
      headers: [
        { title: 'CID', value: 'cid', sortable: false },
        { title: 'Last Name', value: 'last_name', sortable: false },
        { title: 'First Name', value: 'first_name', sortable: false },
        { title: 'Middle Name', value: 'middle_name', sortable: false },
        { title: 'Display Name', value: 'display_name', sortable: true },
        { title: 'Created At', value: 'created_at', sortable: true },
        { title: 'Updated At', value: 'updated_at', sortable: true },
        { title: 'Actions', value: 'action', sortable: false }
      ],
      selectedClient: null,
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      institutionItems: [],
      entityItems: [],
      employmentItems: [],
      relationshipItems: [],
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
  computed: {
    searchValid() {
      return this.search_item_CI.trim() !== '';
    },
  },
  mounted() {
    this.fetchItems('/suffixes', 'suffixesItems');
    this.fetchItems('/types', 'typeItems');
    this.fetchItems('/titles', 'titleItems');
    this.fetchItems('/client_status', 'clientstatusItems');
    this.fetchItems('/genders', 'genderItems');
    this.fetchItems('/civil_status', 'civilstatusItems');
    this.fetchItems('/address_type', 'addresstypeItems');
    this.fetchItems('/institution', 'institutionItems');
    this.fetchItems('/entity', 'entityItems');
    this.fetchItems('/employment', 'employmentItems');
    this.fetchItems('/relationship', 'relationshipItems');
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
          params: { search: this.search_item_CI }
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
          this.skltnLdr = true
          this.imgCrd = false
          setTimeout(() => {
            this.loading = false;
            this.skltnLdr = false
            this.imgCrd = true
          }, 1000)
        } else if (clients.length > 1) {
          this.multipleClients = clients;
          this.dialogMultiple = true;
        } else {
          this.showSnackbar('No record found!', 'error');
        }
      } catch (error) {
        this.showSnackbar('An error occurred while searching for clients', 'error');
      } finally {
        this.validating = false;
      }
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
    viewItem(item) {
      this.selectedClient = {
          ...item,
          created_at: this.formatDate(item.created_at),
          updated_at: this.formatDate(item.updated_at)
      };
      this.dialogSingle = true;
      this.skltnLdr = true
      this.imgCrd = false
      setTimeout(() => {
          this.skltnLdr = false
          this.imgCrd = true
      }, 1000)
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
        this.showSnackbar(`Failed to fetch ${key}`, 'error');
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

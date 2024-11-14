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
        <ClientDataMixin :client="selectedClient" :skeletonLoader="skeletonLoader" :imageCard="imageCard"
          :imageSrc="imageSrc" :typeItems="typeItems" :titleItems="titleItems" :clientstatusItems="clientstatusItems"
          :genderItems="genderItems" :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems"
          :institutionItems="institutionItems" :entityItems="entityItems" :employmentItems="employmentItems" />
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
          this.showSnackbar('No record found!', 'error');
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

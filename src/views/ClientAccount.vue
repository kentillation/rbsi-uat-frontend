<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Client Account</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
      rounded>
      <div class="d-flex justify-end w-100">
        <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" @click="toNewContact" size="large">New Account</v-btn>
      </div>
      <div class="w-75 mt-10">
        <v-text-field v-model="search_item_ACC" label="Search account..." @keyup.enter="searchAccount"
          :loading="validating"></v-text-field>
        <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2" size="large"
          :disabled="!searchValid || validating" @click="searchAccount" rounded>
          Search
        </v-btn>
      </div>
    </v-sheet>

    <!-- Dialog for viewing multiple filtered client details -->
    <v-dialog v-model="dialogMultiple" transition="dialog-bottom-transition" width="1200px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Account Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table :headers="headers" :items="clientAccounts" item-key="acc" class="elevation-1">
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
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

export default {
  name: 'ClientAccount',
  components: {
    Snackbar
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
      search_item_ACC: '',
      staff_or_not: 2,
      headers: [
        { title: 'Outstanding Balance', value: 'balAmt', sortable: false },
        { title: 'Available Balance', value: 'availBalAmt', sortable: false },
        { title: 'Interest Rate', value: 'intRate', sortable: false },
        { title: 'Interest Effective Date', value: 'intEffDate', sortable: true },
      ],
      selectedClient: null,
      appTypeItems: [],
      dialogMultiple: false,
    };
  },
  computed: {
    searchValid() {
      return this.search_item_ACC.trim() !== '';
    },
  },
  mounted() {
    this.fetchItems('/app_type', 'appTypeItems');
  },
  methods: {
    async searchAccount() {
      if (!this.searchValid) return;
      this.validating = true;
      try {
        const response = await apiClient.get('/accountEnquiry', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: { search: this.search_item_ACC }
        });
        const clients = response.data.map(client => ({
          ...client,
          intEffDate: this.formatDate(client.intEffDate)
        }));
        if (clients.length === 1) {
          this.singleClient = clients[0];
          this.selectedClient = this.singleClient;
          this.skltnLdr = true
          this.imgCrd = false
          setTimeout(() => {
            this.loading = false;
            this.skltnLdr = false
            this.imgCrd = true
          }, 1000)
        } else if (clients.length > 1) {
          this.clientAccounts = clients;
          this.dialogMultiple = true;
        } else {
          this.$refs.snackbarRef.showSnackbar("No account found!", "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("An error occurred while searching for account", "error");
      } finally {
        this.validating = false;
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
        this.$refs.snackbarRef.showSnackbar(`Failed to fetch ${key}`, "error");
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

<style scoped>
.to-hide {
  display: none;
}
</style>

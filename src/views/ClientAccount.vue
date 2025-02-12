<template>
  <v-container>
    <div class="d-flex align-items-center">
      <v-icon @click="goBack" class="mt-2 me-3" size="x-large" icon="mdi-chevron-double-left" title="Back"></v-icon>
      <h1>Client Accounts</h1>
    </div>
    <v-data-table :headers="headers" :items="account_list" :loading="loading" class="elevation-1">
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <div class="d-flex justify-end w-100">
            <v-btn append-icon="mdi-refresh" class="me-3 pe-7" variant="outlined" @click="onRefresh"></v-btn>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ formatAcc(item.acc) }}</td>
          <td>{{ getTitle(item.appType, this.apptypeItems, "app_type") }}</td>
          <td>{{ item.relType }}</td>
          <td>{{ item.accStatus }}</td>
          <td>{{ item.prType }}</td>
          <td>₱ {{ formatCurrency(item.balAmt) }}</td>
          <td>₱ {{ formatCurrency(item.availBalAmt) }}</td>
        </tr>
      </template>
    </v-data-table>

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
      account_list: [],
      apptypeItems: [],
      loading: true,
      headers: [
        { title: 'Account No.', value: 'acc', sortable: false },
        { title: 'Application Type', value: 'app_type', sortable: false }, // Fixed
        { title: 'Rel Type', value: 'relType', sortable: false },
        { title: 'Status', value: 'accStatus', sortable: false },
        { title: 'Product Type', value: 'prType', sortable: true },
        { title: 'Balance Amount', value: 'balAmt', sortable: true },
        { title: 'Available Balance Amount', value: 'availBalAmt', sortable: true },
      ],
    };
  },
  mounted () {
    this.fetchAppTypesItems();
  },
  created() {
    this.fetchCID_LastName();
  },
  methods: {
    goBack() {
        this.$router.go(-1);
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
        this.$refs.snackbarRef.showSnackbar(errorMessage, 'error');
      }
    },
    async fetchAppTypesItems() {
      this.fetchItems('/app_types', 'apptypeItems', 'Failed to fetch app types');
    },
    getTitle(id, items, titleKey) {
      const item = items.find(item => String(item.id) === String(id));
      return item ? item[titleKey] : "Unknown";
    },
    async fetchClientAccount(cid) {
      try {
        const response = await apiClient.post(`/account_list/${cid}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        console.log("API Response:", response.data); // Debugging log

        if (response.data && response.data.data && Array.isArray(response.data.data.accs)) {
          this.account_list = response.data.data.accs;
        } else {
          this.account_list = []; // Prevents errors if the structure changes
        }
      } catch (error) {
        console.error("Error fetching accounts:", error); // Debugging log
        this.$refs.snackbarRef.showSnackbar("No accounts found.", "error");
      } finally {
        this.loading = false;
      }
    },
    fetchCID_LastName() {
      const { cid } = this.$route.params;
      if (cid) {
        this.fetchClientAccount(cid);
      }
    },
    onRefresh() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.fetchCID_LastName();
      }, 2000);
    },
    formatAcc(acc) {
      if (!acc) return acc;
      const accStr = String(acc); // Ensure it's a string
      return accStr.replace(/^(\d{2})(\d{5})(\d{1})$/, "$1-$2-$3");
    },
    formatCurrency(value) {
      if (!value || isNaN(value)) return "0.00";
      return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
};
</script>

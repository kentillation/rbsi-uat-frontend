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
          <h2 class="ms-3 w-75 text-teal-darken-4">CID: {{ this.cid }}</h2>
          <!-- <v-divider vertical></v-divider> -->
          <div class="d-flex justify-end w-100">
            <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 me-4" @click="toNewAccount">New Account</v-btn>
            <v-btn append-icon="mdi-refresh" class="me-3 pe-7" variant="outlined" @click="onRefresh"></v-btn>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ formatAcc(item.acc) }}</td>
          <td>{{ formatProductType(item.prType) }}</td>
          <td>{{ formatAccStatus(item.accStatus) }}</td>
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
  name: 'ClientAccountList',
  components: {
    Snackbar
  },
  data() {
    return {
      cid: "",
      account_list: [],
      appTypeItems: [],
      productTypeItems: [],
      loading: true,
      headers: [
        { title: 'Account No.', value: 'acc', sortable: true },
        { title: 'Product Type', value: 'product_type_code', sortable: true },
        { title: 'Status', value: 'accStatus', sortable: true },
        { title: 'Outstanding Balance', value: 'balAmt', sortable: true },
        { title: 'Available Balance', value: 'availBalAmt', sortable: true },
      ],
    };
  },
  created() {
    this.fetchCID();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toNewAccount() {
      const { cid } = this.$route.params;
      if (cid) {
        this.$router.push({
          name: 'NewAccount',
          params: {
            cid: cid,
          },
        });
      }
    },
    onRefresh() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.fetchCID();
      }, 2000);
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
    fetchCID() {
      const { cid } = this.$route.params;
      if (cid) {
        this.cid = cid;
        this.fetchClientAccount(cid);
      }
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
    },
    formatAccStatus(accStatus) {
      return accStatus === '01' ? 'Active' : 'Inactive';
    },
    formatProductType(productType) {
      return productType === '51' ? 'Regular Savings (Basic)' : 
              productType === '52' ? 'Regular Savings' :
              productType === '20' ? 'Current Account (Corporate)' :
              productType === '25' ? 'Current Account (Personal)' : 'Unknown';
    },
  }
};
</script>

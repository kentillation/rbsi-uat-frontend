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
          <h2 class="ms-3 w-75 text-teal-darken-1">CID: {{ this.cid }}</h2>
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
          <td class="text-center">
            <v-btn @click="viewItem(item)" class="bg-teal-darken-4" prepend-icon="mdi-eye-outline" rounded>
              Details
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogAccountDetails" transition="dialog-bottom-transition" width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Account Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="selectedAccount">
              <v-col cols="12">
                <p><strong>Outstanding Balance: </strong>₱{{ formatCurrency(selectedAccount.balAmt) }}</p>
                <p><strong>Available Balance: </strong>₱{{ formatCurrency(selectedAccount.availBalAmt) }}</p>
                <p><strong>Interest Rate: </strong>{{ selectedAccount.intRate }}%</p>
                <p><strong>Interest Effective Date: </strong>{{ formatDate(selectedAccount.intEffDate) }}</p>
                <p><strong>Status Date:</strong> {{ formatDate(selectedAccount.accStatusDate) }}</p>
                <p><strong>Open Date:</strong> {{ formatDate(selectedAccount.openDate) }}</p>
                <p>
                  <strong>Account Status: </strong> 
                  <span :class="{ 'text-red-darken-1' : selectedAccount.accStatus === '00' }">
                    {{ acc_status(selectedAccount.accStatus) }}
                  </span>
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12" class="text-center">
                <p>No account details available.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-btn class="bg-teal-darken-4 px-3" prepend-icon="mdi-clipboard-outline" @click="showDialogTrnsctnHstry"
            rounded>Transaction History
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
            @click="dialogAccountDetails = false" rounded>
            Close
          </v-btn>
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
  name: 'ClientAccountList',
  components: {
    Snackbar
  },
  data() {
    return {
      cid: '',
      acc: '',
      appType: '',
      selectedAccount: null,
      account_list: [],
      appTypeItems: [],
      productTypeItems: [],
      loading: true,
      dialogAccountDetails: false,
      headers: [
        { title: 'Account No.', value: 'acc', sortable: true },
        { title: 'Product Type', value: 'product_type_code', sortable: true },
        { title: 'Status', value: 'accStatus', sortable: true },
        { title: 'Outstanding Balance', value: 'balAmt', sortable: true },
        { title: 'Available Balance', value: 'availBalAmt', sortable: true },
        { title: 'Actions', value: 'action', sortable: false }
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
    async viewItem(item) {
      this.acc = item.acc;
      this.appType = item.appType;
      try {
        const response = await apiClient.post('/account_enquiry', {
          acc: item.acc,
          appType: item.appType
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        });
        if (response.data && typeof response.data === "object") {
          this.selectedAccount = {
            ...response.data.data,
            intEffDate: this.formatDate(response.data.data.intEffDate),
            accStatusDate: this.formatDate(response.data.data.accStatusDate),
            openDate: this.formatDate(response.data.data.openDate)
          };
          this.dialogAccountDetails = true;
        } else {
          this.$refs.snackbarRef.showSnackbar("Unexpected response format", "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("An error occurred while searching for account", "error");
        console.error("Error:", error);
      }
    },
    async fetchClientAccount(cid) {
      try {
        const response = await apiClient.post(`/account_list/${cid}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        console.log("API Response:", response.data);
        if (response.data && response.data.data && Array.isArray(response.data.data.accs)) {
          this.account_list = response.data.data.accs;
        } else {
          this.account_list = [];
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
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
    formatDate(date) {
      if (!date) return 'Invalid date';
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return 'Invalid date';
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
    },
    acc_status() {
      const statusMap = {
        '01': 'Active',
        '00': 'Inactive',
      };
      return statusMap[this.selectedAccount.accStatus] || 'Unknown Status';
    }
  }
};
</script>

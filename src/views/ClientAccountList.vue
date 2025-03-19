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

    <v-dialog v-model="dialogTransactionHistory" transition="dialog-bottom-transition" width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Transaction History</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                <v-dialog v-model="startDateMenu" width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <label for="">Start Date</label>
                    <v-text-field v-bind="attrs" v-on="on" :value="formattedStartDate" variant="outlined" readonly
                      @click="startDateMenu = true"></v-text-field>
                  </template>
                  <v-date-picker v-model="startdate" @input="startDateMenu = false"></v-date-picker>
                  <v-btn class="bg-teal-darken-4" @click="startDateMenu = false" size="large" width="25">Ok</v-btn>
                </v-dialog>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                <v-dialog v-model="endDateMenu" width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <label for="">End Date</label>
                    <v-text-field v-bind="attrs" v-on="on" :value="formattedEndDate" variant="outlined" readonly
                      @click="endDateMenu = true"></v-text-field>
                  </template>
                  <v-date-picker v-model="enddate" @input="endDateMenu = false"></v-date-picker>
                  <v-btn class="bg-teal-darken-4" @click="closeEndDateDialog" size="large" width="25">Ok</v-btn>
                </v-dialog>
              </v-col>
            </v-row>
            <div class="d-flex flex-column align-center text-center mx-auto">
              <v-btn prepend-icon="mdi-eye-outline" class="bg-teal-darken-4" size="large"
                :disabled="!datesSelected || validatingDate" @click="viewTransactionHistory" rounded>
                <v-progress-circular v-if="validatingDate" size="20" color="white" indeterminate />
                <span v-else>View</span>
              </v-btn>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
            @click="dialogTransactionHistory = false" rounded>
            Close
          </v-btn>
        </v-card-actions>

        <v-dialog v-model="dialogTransactionHistoryTable" transition="dialog-bottom-transition" width="1000px"
          persistent>
          <v-card>
            <v-card-title>
              <span class="headline">Transaction History</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <h4>Account number: {{ this.acc }}</h4>
                <v-data-table :headers="transactionHeaders" :items="transactionHistory" class="elevation-1">
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ formatDate(item.trnDate) }}</td>
                      <td>{{ formatDate(item.valueDate) }}</td>
                      <td>{{ formatCurrency(item.debitAmt) }}</td>
                      <td>{{ formatCurrency(item.creditAmt) }}</td>
                      <td>{{ formatCurrency(item.balAmt) }}</td>
                      <td>{{ item.seqRef }}</td>
                      <td>{{ item.trnDesc }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-container>
            </v-card-text>
            <v-card-actions class="mx-4 my-4">
              <v-spacer></v-spacer>
              <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
                @click="dialogTransactionHistoryTable = false" rounded>
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
      validatingDate: false,
      dialogAccountDetails: false,
      dialogTransactionHistory: false,
      dialogTransactionHistoryTable: false,
      startdate: null,
      enddate: null,
      transactionHistory: [],
      startDateMenu: false,
      endDateMenu: false,
      headers: [
        { title: 'Account No.', value: 'acc', sortable: true },
        { title: 'Product Type', value: 'product_type_code', sortable: true },
        { title: 'Status', value: 'accStatus', sortable: true },
        { title: 'Outstanding Balance', value: 'balAmt', sortable: true },
        { title: 'Available Balance', value: 'availBalAmt', sortable: true },
        { title: 'Actions', value: 'action', sortable: false }
      ],
      transactionHeaders: [
        { title: 'Date', value: 'trnDate' },
        { title: 'Value Date', value: 'valueDate' },
        { title: 'Debit Amount', value: 'debitAmt' },
        { title: 'Credit Amount', value: 'creditAmt' },
        { title: 'Balance', value: 'balAmt' },
        { title: 'Reference', value: 'seqRef' },
        { title: 'Description', value: 'trnDesc' },
      ],
    };
  },
  computed: {
    formattedStartDate() {
      return this.startdate ? this.formatDateToYYYYMMDD(this.startdate) : '';
    },
    formattedEndDate() {
      return this.enddate ? this.formatDateToYYYYMMDD(this.enddate) : '';
    },
    datesSelected() {
      return this.startdate && this.enddate;
    }
  },
  watch: {
    startdate(newDate) {
      if (newDate) {
        const endDate = new Date(newDate);
        endDate.setDate(endDate.getDate() + 30);
        this.enddate = endDate;
      }
    },
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
    showDialogTrnsctnHstry() {
      this.dialogAccountDetails = false;
      this.dialogTransactionHistory = true;
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
    formatDateToYYYYMMDD(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    closeStartDateDialog() {
      this.startDateMenu = false;
    },
    closeEndDateDialog() {
      this.endDateMenu = false;
    },
    async viewTransactionHistory() {
      this.validatingDate = true;
      try {
        const response = await apiClient.post('/account_transaction_history', {
          acc: this.acc,
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        // Ensure the response data is an array
        this.transactionHistory = Array.isArray(response.data.data.trans) ? response.data.data.trans : [];
        this.dialogTransactionHistoryTable = true;
        this.validatingDate = false;
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("No transaction history found!", "error");
        console.error("Error:", error);
        this.validatingDate = false;
      }
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

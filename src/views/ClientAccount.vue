<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Client Account</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
      rounded>
      <div class="d-flex justify-end w-100">
        <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" @click="dialogOpenCID" size="large">New
          Account</v-btn>
      </div>
      <div class="w-75 mt-10">
        <v-text-field v-model="search_item_ACC" label="Search account..." @keyup.enter="searchAccount"></v-text-field>
        <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2" size="large"
          :disabled="!searchValid || validating" @click="searchAccount" rounded>
          <v-progress-circular v-if="validating" size="20" color="white" indeterminate />
          <span v-else>Search</span>
        </v-btn>
      </div>
    </v-sheet>

    <v-dialog v-model="dialogCID" transition="dialog-bottom-transition" width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline"></span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-sheet class="d-flex flex-column align-center text-center mx-auto" height="100" width="100%" rounded>
              <div class="w-75">
                <v-text-field v-model="search_item_CID" label="Enter CID..." @keyup.enter="searchCID"></v-text-field>
                <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2"
                  :disabled="!searchValidCID || validatingCID" @click="searchCID" rounded>
                  <v-progress-circular v-if="validatingCID" size="20" color="white" indeterminate />
                  <span v-else>Search</span>
                </v-btn>
              </div>
            </v-sheet>
          </v-container>
        </v-card-text>
        <v-card-actions class="mx-4 my-4">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline" @click="dialogCID = false"
            rounded>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAccountDetails" transition="dialog-bottom-transition" width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Account Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="selectedAccount">
              <v-col cols="12">
                <p><strong>Outstanding Balance:</strong>₱ {{ formatCurrency(selectedAccount.balAmt) }}</p>
                <p><strong>Available Balance:</strong>₱ {{ formatCurrency(selectedAccount.availBalAmt) }}</p>
                <p><strong>Interest Rate:</strong> {{ selectedAccount.intRate }}%</p>
                <p><strong>Interest Effective Date:</strong> {{ formatDate(selectedAccount.intEffDate) }}</p>
                <p><strong>Account Status:</strong> {{ selectedAccount.accStatus }}</p>
                <p><strong>Status Date:</strong> {{ formatDate(selectedAccount.accStatusDate) }}</p>
                <p><strong>Currency Type:</strong> {{ selectedAccount.ccyType }}</p>
                <p><strong>Open Date:</strong> {{ formatDate(selectedAccount.openDate) }}</p>
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
  name: 'ClientAccount',
  components: {
    Snackbar
  },
  data() {
    return {
      cid: '',
      appType: '',
      startDate: '',
      endDate: '',
      dialogCID: false,
      validating: false,
      validatingDate: false,
      validatingCID: false,
      singleClient: null,
      search_item_CID: '',
      search_item_ACC: '',
      headers: [
        { title: 'Outstanding Balance', value: 'balAmt', sortable: false },
        { title: 'Available Balance', value: 'availBalAmt', sortable: false },
        { title: 'Interest Rate', value: 'intRate', sortable: false },
        { title: 'Interest Effective Date', value: 'intEffDate', sortable: true },
      ],
      selectedClient: null,
      appTypeItems: [],
      dialogAccountDetails: false,
      dialogTransactionHistory: false,
      dialogSearchTransactionHistory: false,
      dialogTransactionHistoryTable: false,
      startdate: null,
      enddate: null,
      startDateMenu: false,
      endDateMenu: false,
      transactionHistory: [],
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
    searchValid() {
      return this.search_item_ACC.trim() !== '';
    },
    searchValidCID() {
      return this.search_item_CID.trim() !== '';
    },
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
    search_item_ACC(newVal) {
      const firstTwoDigits = newVal.substring(0, 2);
      if (firstTwoDigits === '51' || firstTwoDigits === '52') {
        this.appType = 1;
      } else if (firstTwoDigits === '20' || firstTwoDigits === '25') {
        this.appType = 2;
      } else {
        this.appType = '';
      }
    }
  },

  methods: {
    dialogOpenCID() {
      this.dialogCID = true;
    },
    showDialogTrnsctnHstry() {
      this.dialogAccountDetails = false;
      this.dialogTransactionHistory = true;
    },
    async searchCID() {
      if (!this.searchValidCID) return;
      this.validatingCID = true;
      try {
        const response = await apiClient.get('/get_search_cid_mbwin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: { search: this.search_item_CID }
        });
        // console.log("API Response:", response.data); 
        if (response.data.length === 1) {
          const selectedCID = response.data[0].CID;
          this.$router.push({
            name: 'NewAccount',
            params: {
              cid: String(selectedCID),
            },
          });
        } else {
          this.$refs.snackbarRef.showSnackbar("CID not found. Please try again!", "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("An error occurred while searching for CID", "error");
        this.validatingCID = false;
      } finally {
        this.validatingCID = false;
      }
    },
    async searchAccount() {
      if (!this.searchValid) return;
      this.validating = true;
      try {
        const response = await apiClient.post('/account_enquiry', {
          acc: this.search_item_ACC,
          appType: this.appType
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: { search: this.search_item_ACC }
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
      } finally {
        this.validating = false;
      }
    },
    formatCurrency(value) {
      if (!value || isNaN(value)) return "0.00";
      return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
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
          acc: this.search_item_ACC,
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
        this.$refs.snackbarRef.showSnackbar("An error occurred while fetching transaction history", "error");
        console.error("Error:", error);
        this.validatingDate = false;
      }
    },
    formatAcc(acc) {
      if (!acc) return acc;
      const accStr = String(acc);
      return accStr.replace(/^(\d{2})(\d{5})(\d{1})$/, "$1-$2-$3");
    },

  },
};
</script>

<style scoped>
.to-hide {
  display: none;
}
</style>

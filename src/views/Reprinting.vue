<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Reprinting</h1>
    <v-sheet class="d-flex align-center text-center" elevation="4" height="180" rounded>
      <div class="d-flex flex-column mt-5 mx-auto">
        <v-btn @click="openPassBookDialog" prepend-icon="mdi-book-open-page-variant" class="bg-teal-darken-4 ms-2 mb-3" size="large"
          rounded>Reprint Passbook</v-btn>
        <v-btn prepend-icon="mdi-book-open-outline" class="bg-teal-darken-4 ms-2 mb-3" size="large" rounded>Reprint Signature
          Card</v-btn>
      </div>
    </v-sheet>
    <v-dialog v-model="passbookDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Reprint Passbook</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-sheet class="d-flex flex-column align-center text-center mx-auto" height="200" width="100%" rounded>
              <div class="w-75">
                <v-text-field v-model="search_item_ACC" ref="searchItemAcc" @keyup.enter="searchACC"
                  label="Enter account number..." variant="underlined"></v-text-field>
                <v-text-field v-model="passbookNumber" @keyup.enter="searchACC" label="Enter passbook number..."
                  variant="underlined"></v-text-field>
              </div>
              <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2"
                :disabled="!searchValidACC || validatingACC" @click="searchACC" rounded>
                <v-progress-circular v-if="validatingACC" size="20" color="white" indeterminate />
                <span v-else>Search</span>
              </v-btn>
            </v-sheet>
          </v-container>
        </v-card-text>
        <v-card-actions class="me-3 my-3">
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline"
            @click="passbookDialog = false" rounded>
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
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Reprinting',
  components: {
    Snackbar
  },
  data() {
    return {
      search_item_ACC: '',
      passbookNumber: '',
      trimmedAcc: '',
      chd: '',
      appType: '',
      cid: '',
      TitleCode: '',
      DisplayName: '',
      Line1: '',
      Line2: '',
      Line3: '',
      Line4: '',
      currentDate: '',
      validatingACC: false,
      passbookDialog: false,
    };
  },
  computed: {
    searchValidACC() {
      return this.search_item_ACC.trim() !== '' && this.passbookNumber.trim() !== '';
    },
  },
  watch: {
    search_item_ACC(newVal) {
      const firstTwoDigits = newVal.substring(0, 2);
      if (firstTwoDigits === '51' || firstTwoDigits === '52') {
        this.appType = 1;
      } else if (firstTwoDigits === '20' || firstTwoDigits === '25') {
        this.appType = 2;
      } else {
        this.appType = '';
      }
      if (newVal.length >= 8) {
        this.chd = newVal.charAt(7);
        this.trimmedAcc = newVal.slice(0, 7);
      } else {
        this.chd = '';
        this.trimmedAcc = newVal;
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    openPassBookDialog() {
      this.passbookDialog = true;
      this.$nextTick(() => {
        this.$refs.searchItemAcc.focus();
      });
    },
    async searchACC() {
      if (!this.searchValidACC) return;
      this.validatingACC = true;
      console.log("Sent account number:", this.trimmedAcc);
      console.log("Sent chd:", this.chd);
      try {
        const response = await apiClient.get('/get_acc_chd_mbwin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: {
            acc: this.trimmedAcc,
            chd: this.chd,
          }
        });
        if (response.data && Object.keys(response.data).length > 0) {
          console.log("API Response:", response.data);
          this.cid = response.data.CID;
          this.printAccount();
        } else {
          this.$refs.snackbarRef.showSnackbar("Account not found. Please try again!", "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("Account not found. Please try again!", "error");
        this.validatingACC = false;
      } finally {
        this.validatingACC = false;
      }
    },
    async fetchClientData(cid) {
      this.validatingACC = true;
      try {
        const response = await apiClient.get(`/show_mbwin_client_info/${cid}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const client = response.data;
        Object.assign(this, client);
        if (client) {
          this.acc = client.search_item_ACC || "";
          this.Name1 = client.Name1 || "";
          this.Name2 = client.Name2 || "";
          this.Name3 = client.Name3 || "";
          this.Name4 = client.Name4 || "";
          this.Mobile1 = client.Mobile1 || "";
          if (Array.isArray(client.address) && client.address.length > 0) {
            const firstAddress = client.address[0];
            this.Line1 = firstAddress.Line1 || "";
            this.Line2 = firstAddress.Line2 || "";
            this.Line3 = firstAddress.Line3 || "";
          } else {
            this.Line1 = this.Line2 = this.Line3 = this.Line4 = "";
          }
        } else {
          console.warn("No data found in response.");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar('Client CID not found. Please try again!', 'error');
      } finally {
        this.validating = false;
      }
    },
    async printAccount() {
      if (!this.cid) {
        this.$refs.snackbarRef.showSnackbar("Account is required!", "error");
        return;
      }
      await this.fetchClientData(this.cid);
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/print_passbook';
      form.target = '_blank';
      const authToken = localStorage.getItem('auth_token');
      const params = {
        acc: this.search_item_ACC,
        CID: this.cid,
        passbook_number: this.passbookNumber,
        Name1: this.Name1,
        Name2: this.Name2,
        Name3: this.Name3,
        Name4: this.Name4,
        Mobile1: this.Mobile1,
        Line1: this.Line1,
        Line2: this.Line2,
        Line3: this.Line3,
        token: `Bearer ${authToken}`,
      };
      Object.keys(params).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    handleKeyPress(event) {
      if (event.key === 'F1') {
        event.preventDefault();
        this.fetchAccountDetails();
      }
    },
    async fetchAccountDetails() {
      try {
        const response = await apiClient.get('/get_mbwin_client_account_number', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (response.data) {
          this.search_item_ACC = response.data.ACC + response.data.Chd || '';
          this.$refs.snackbarRef.showSnackbar("Account number fetched successfully!", "success");
        } else {
          this.$refs.snackbarRef.showSnackbar("No account details found!", "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("Failed to fetch account details. Please try again!", "error");
      }
    },
  },
};
</script>

<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Reprinting</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="180" width="50%" rounded>
      <div class="w-75 mt-10">
        <v-btn @click="openPassBookDialog" prepend-icon="mdi-book" class="bg-teal-darken-4 ms-2 mb-3" size="large"
          rounded>Reprint Passbook</v-btn>
        <v-btn prepend-icon="mdi-clipboard" class="bg-teal-darken-4 ms-2 mb-3" size="large" rounded>Reprint Signature
          Card</v-btn>
      </div>

    </v-sheet>
    <v-dialog v-model="passbookDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Search Account</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-sheet class="d-flex flex-column align-center text-center mx-auto" height="100" width="100%" rounded>
              <div class="w-75 d-flex">
                <v-text-field v-model="search_item_ACC" ref="searchItemAcc" :style="{ width: '90%' }"
                  label="Enter Account..." variant="underlined"></v-text-field>
                <v-text-field v-model="search_item_CHD" ref="searchItemChd" :style="{ width: '10%' }" @keyup.enter="searchACC"
                  :disabled="search_item_ACC.length !== 7" variant="underlined"></v-text-field>
              </div>
              <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2"
                :disabled="!searchValidACC || validatingACC" @click="searchACC" rounded>
                <v-progress-circular v-if="validatingACC" size="20" color="white" indeterminate />
                <span v-else>Search</span>
              </v-btn>
            </v-sheet>
          </v-container>
        </v-card-text>
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
      search_item_CHD: '',
      appType: '',
      validatingACC: false,
      passbookDialog: false,
    };
  },
  computed: {
    searchValidACC() {
      return this.search_item_ACC.trim() !== '' && this.search_item_CHD.trim() !== '';
    },
  },
  watch: {
    search_item_ACC(newVal) {
      if (newVal.length === 7) {
        this.$nextTick(() => {
          this.$refs.searchItemChd.focus();
        });
      } else if (newVal.length > 7) {
        this.search_item_ACC = newVal.slice(0, 7);
      } else {
        this.search_item_CHD = '';
      }

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
    openPassBookDialog() {
      this.passbookDialog = true;
      this.$nextTick(() => {
        this.$refs.searchItemAcc.focus();
      });
    },
    async searchACC() {
      if (!this.searchValidACC) return;
      this.validatingACC = true;
      console.log("Sent account number:", this.search_item_ACC);
      console.log("Sent chd:", this.search_item_CHD);
      try {
        const response = await apiClient.get('/get_acc_chd_mbwin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          params: {
            acc: this.search_item_ACC,
            chd: this.search_item_CHD
          }
        });
        if (response.data && Object.keys(response.data).length > 0) {
          console.log("API Response:", response.data);
          this.$refs.snackbarRef.showSnackbar("Fetching account success!", "success");
        } else {
          this.$refs.snackbarRef.showSnackbar("Account not found. Please try again!", "error");
        }
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar("An error occurred while searching for account", "error");
        this.validatingACC = false;
      } finally {
        this.validatingACC = false;
      }
    }
    ,
    async printAccount() {
      if (!this.cid) {
        this.$refs.snackbarRef.showSnackbar("Account is required!", "error");
        return;
      }
      await this.fetchClientData(this.cid);
      const queryParams = new URLSearchParams({
        account_number: this.account_number,
        ACC: this.cid,
        TitleCode: this.TitleCode,
        DisplayName: this.DisplayName,
        Line1: this.Line1,
        Line2: this.Line2,
        Line3: this.Line3,
        Line4: this.Line4,
        date: this.currentDate,
      }).toString();
      const printUrl = `/print-passbook?${queryParams}`;
      if (printUrl) {
        window.open(printUrl, '_blank');
      } else {
        console.error("Failed to generate print URL");
      }
    },
  },
};
</script>

<style scoped>
.to-hide {
  display: none;
}
</style>

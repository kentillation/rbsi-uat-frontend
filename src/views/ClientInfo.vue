<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Client Information</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="250" width="100%"
      rounded>
      <div class="d-flex justify-end w-100">
        <v-btn prepend-icon="mdi-plus" class="bg-teal-darken-4 mt-4 me-4" @click="toNewContact" size="large">
          New <span class="to-hide">Information</span>
        </v-btn>
      </div>
      <div class="w-75 mt-5">
        <v-text-field v-model="search_item_CID" ref="searchItemCID" label="Search CID or last name..."
          @keyup.enter="searchClients" :loading="validating"></v-text-field>
        <v-btn prepend-icon="mdi-magnify" class="bg-teal-darken-4 ms-2" size="large" variant="tonal"
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
        <ClientDataMixin :client="selectedClient" :skeletonLoader="skltnLdr" :imageCard="imgCrd" :imageSource="imgSrc"
          :typeItems="typeItems" :titleItems="titleItems" :clientstatusItems="clientstatusItems"
          :genderItems="genderItems" :civilstatusItems="civilstatusItems" :addresstypeItems="addresstypeItems"
          :institutionItems="institutionItems" :entityItems="entityItems" :employmentItems="employmentItems" />
        <v-card-actions class="mx-4 my-4">
          <v-btn class="bg-teal-darken-4 px-3" prepend-icon="mdi-eye-outline" @click="toClientAccountList" rounded>List
            of Accounts</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-4 px-3" prepend-icon="mdi-close-circle-outline" @click="dialogSingle = false"
            rounded>Close</v-btn>
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
            <v-data-table :headers="clientInfoDetailsHeaders" :items="multipleClients" item-key="cid"
              class="elevation-1">
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

    <Snackbar ref="snackbarRef" />
  </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';
import ClientDataMixin from '@/components/ClientDataMixin.vue';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

export default {
  name: 'ClientInfo',
  components: {
    ClientDataMixin,
    Snackbar
  },
  data() {
    return {
      encryptor: new JSEncrypt(),
      publicKey: null,
      sessionKey: localStorage.getItem('session_key') || null,
      sessionId: localStorage.getItem('session_id') || null,
      validating: false,
      singleClient: null,
      skltnLdr: false,
      imgCrd: false,
      image_file: null,
      imgSrc: null,
      search_item_CID: '',
      staff_or_not: 2,
      clientInfoDetailsHeaders: [
        { title: 'CID', value: 'CID', sortable: false },
        { title: 'Last Name', value: 'Name1', sortable: false },
        { title: 'First Name', value: 'Name2', sortable: false },
        { title: 'Middle Name', value: 'Name3', sortable: false },
        { title: 'Display Name', value: 'DisplayName', sortable: true },
        { title: 'Last Changes', value: 'LastChangeDate', sortable: true },
        { title: 'Actions', value: 'action', sortable: false }
      ],
      selectedClient: null,
      selectedImage: null,
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      institutionItems: [],
      entityItems: [],
      employmentItems: [],
      multipleClients: [],
      dialogSingle: false,
      dialogMultiple: false,
      messages: {
        noRecordFound: "No record found!",
        searchError: "An error occurred while searching for clients",
        fetchError: "Failed to fetch",
        encryptionError: "Security initialization failed. Please refresh."
      },
      TIMEOUT_DURATION: 1000,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.searchItemCID.focus();
    });
    this.initializeEncryption();
  },
  created() {
    if (this.selectedImage?.display_name && this.selectedImage?.image_file) {
      this.fetchClientImage(this.selectedImage.display_name, this.selectedImage.image_file);
    }
  },
  computed: {
    searchValid() {
      return this.search_item_CID.trim() !== '';
    },
  },
  methods: {
    async ensureEncryptionReady() {
      if (this.sessionKey && this.sessionId) {
        return true;
      }
      
      try {
        await this.initializeEncryption();
        return true;
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar('Security initialization failed', 'error');
        return false;
      }
    },
    async ensureEncryptionInitialized() {
      if (this.sessionKey && this.sessionId) return true;
      try {
        await this.initializeEncryption();
        return true;
      } catch (error) {
        console.error('Encryption initialization failed:', error);
        return false;
      }
    },
    async initializeEncryption() {
      try {
        // Clear any existing invalid session
        if (!this.publicKey) {
          const response = await apiClient.get('/encryption/init');
          this.publicKey = response.data.publicKey;
          this.encryptor.setPublicKey(this.publicKey);
        }

        // Generate new session key if needed
        if (!this.sessionKey) {
          const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
          this.sessionKey = btoa(String.fromCharCode(...randomBytes));
        }

        // Encrypt and establish session
        const encryptedKey = this.encryptor.encrypt(this.sessionKey);
        if (!encryptedKey) {
          throw new Error('RSA encryption failed');
        }

        const establishResponse = await apiClient.post('/encryption/establish', {
          encryptedKey: encryptedKey
        });

        // Update both component state and localStorage
        this.sessionId = establishResponse.data.sessionId;
        localStorage.setItem('session_key', this.sessionKey);
        localStorage.setItem('session_id', this.sessionId);

        return true;
      } catch (error) {
        console.error('Encryption initialization failed:', error);
        this.clearSensitiveData();
        throw error;
      }
    },

    async encryptPayload(data) {
      if (!await this.ensureEncryptionReady()) {
        throw new Error('Session key not available');
      }
      try {
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          CryptoJS.enc.Base64.parse(this.sessionKey),
          { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
        return iv.toString() + encrypted.toString();
      } catch (error) {
        console.error('Encryption failed:', error);
        this.clearSensitiveData();
        throw new Error('Encryption failed');
      }
    },

    async decryptResponse(encryptedData) {
      try {
        if (!this.sessionKey) await this.initializeEncryption();
        const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
        const ciphertext = encryptedData.substr(32);
        const decrypted = CryptoJS.AES.decrypt(
          ciphertext,
          CryptoJS.enc.Base64.parse(this.sessionKey),
          { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Decryption failed');
      }
    },

    clearSensitiveData() {
      this.sessionKey = null;
      this.sessionId = null;
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
        this.imgSrc = null;
      }
    },

    async searchClients() {
      if (!this.searchValid) return;
      this.validating = true;
      try {
        // This will ensure encryption is ready before proceeding
        const encryptedPayload = await this.encryptPayload({ 
          search: this.search_item_CID.trim() 
        });
        const response = await apiClient.post('/mbwin_client_cid_lastname',
          { data: encryptedPayload },
          {
            headers: {
              'X-Session-ID': this.sessionId,
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        );
        const clients = await this.decryptResponse(response.data) || [];
        if (clients.length === 1) {
          this.singleClient = clients[0];
          this.selectedClient = this.singleClient;
          this.dialogSingle = true;
        } else if (clients.length > 1) {
          this.multipleClients = clients;
          this.dialogMultiple = true;
        } else {
          this.$refs.snackbarRef.showSnackbar(this.messages.noRecordFound, "error");
        }
      } catch (error) {
        console.error('Search Error:', error);
        console.log('Session ID:', this.sessionId);
        console.log('Session Key:', this.sessionKey);
        let errorMessage = this.messages.searchError;
        if (error.response?.status === 401) {
          errorMessage = "Session expired. Please login again.";
          this.clearSensitiveData();
          this.$router.push('/');
        }
        this.$refs.snackbarRef.showSnackbar(errorMessage, "error");
      } finally {
        this.validating = false;
      }
    },

    async fetchClientInfoByCID(cid) {
      try {
        const encryptedPayload = await this.encryptPayload({ search: cid });
        const response = await apiClient.post('/client_info',
          { data: encryptedPayload },
          {
            headers: {
              'X-Session-ID': this.sessionId,
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        );
        const clientData = await this.decryptResponse(response.data);
        if (Array.isArray(clientData) && clientData.length > 0) {
          const client = clientData[0];
          if (client.last_name && client.first_name && client.middle_name && client.image_file) {
            this.selectedImage = {
              last_name: client.last_name,
              first_name: client.first_name,
              middle_name: client.middle_name,
              image_file: client.image_file,
            };
            const fullName = [client.last_name + ',', client.first_name, client.middle_name].filter(Boolean).join(' ');
            this.fetchClientImage(fullName, client.image_file);
          } else {
            this.selectedImage = null;
            this.imgSrc = '';
            console.warn('No image data available for the selected client.');
          }
        }
      } catch (error) {
        console.error('Error fetching client info by CID:', error);
        this.$refs.snackbarRef.showSnackbar(this.messages.fetchError, "error");
      }
    },

    toClientAccountList() {
      if (this.selectedClient) {
        this.$router.push({
          name: 'ClientAccountList',
          params: {
            CID: this.selectedClient.CID,
          },
        });
      }
    },

    viewItem(item) {
      this.selectedClient = {
        ...item,
        LastChangeDate: this.formatDate(item.LastChangeDate),
      };
      this.dialogSingle = true;
      this.toggleSkeletonLoader(true);
      this.fetchClientInfoByCID(item.CID);
    },

    async fetchClientImage(folderName, imageFileName) {
      try {
        const response = await apiClient.get(`/client_image/${folderName}/${imageFileName}`, {
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
        const encryptedPayload = await this.encryptPayload({});
        const response = await apiClient.post(endpoint,
          { data: encryptedPayload },
          {
            headers: {
              'X-Session-ID': this.sessionId,
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        );
        const decryptedData = await this.decryptResponse(response.data);
        this[key] = decryptedData;
      } catch (error) {
        this.$refs.snackbarRef.showSnackbar(`${this.messages.fetchError} ${key}`, "error");
      }
    },

    toNewContact() {
      this.$router.push({ name: 'NewContact' });
    },

    toggleSkeletonLoader(state) {
      this.skltnLdr = state;
      this.imgCrd = !state;
      if (state) {
        setTimeout(() => {
          this.skltnLdr = false;
          this.imgCrd = true;
        }, this.TIMEOUT_DURATION);
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
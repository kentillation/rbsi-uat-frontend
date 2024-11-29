<template>
    <v-container></v-container>
</template>
<script>
import apiClient from '../axios';
export default {
  data() {
    return {
      loading: true,
      skeletonLoader: false,
      imageCard: false,
      image_file: null,
      imageSource: '',
      search_item: '',
      staff_or_not: 2,
      headers: [
        { title: 'CID', value: 'cid', sortable: false },
        { title: 'Last Name', value: 'last_name', sortable: false },
        { title: 'First Name', value: 'first_name', sortable: false },
        { title: 'Middle Name', value: 'middle_name', sortable: false },
        { title: 'Display Name', value: 'display_name', sortable: true },
        { title: 'Created At', value: 'created_at', sortable: true },
        { title: 'Updated At', value: 'updated_at', sortable: true },
        { title: 'Actions', value: 'action', sortable: false }
      ],
      selectedClient: null,
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      institutionItems: [],
      entityItems: [],
      employmentItems: [],
      relationshipItems: [],
    };
  },
  created() {
    if (this.selectedClient?.image_file) {
      this.fetchClientImage(this.selectedClient.image_file);
    }
  },
  mounted() {
    this.fetchItems('/suffixes', 'suffixesItems');
    this.fetchItems('/types', 'typeItems');
    this.fetchItems('/titles', 'titleItems');
    this.fetchItems('/client_status', 'clientstatusItems');
    this.fetchItems('/genders', 'genderItems');
    this.fetchItems('/civil_status', 'civilstatusItems');
    this.fetchItems('/address_type', 'addresstypeItems');
    this.fetchItems('/institution', 'institutionItems');
    this.fetchItems('/entity', 'entityItems');
    this.fetchItems('/employment', 'employmentItems');
    this.fetchItems('/relationship', 'relationshipItems');
  },
  methods: {
    toEditClientInfo() {
      if (this.selectedClient) {
          this.$router.push({
          name: 'EditClientInfo',
          params: {
              cid: this.selectedClient.cid,
              last_name: this.selectedClient.last_name,
          },
          });
      }
    },
    viewItem(item) {
      this.selectedClient = {
          ...item,
          created_at: this.formatDate(item.created_at),
          updated_at: this.formatDate(item.updated_at)
      };
      this.dialogSingle = true;
      this.skeletonLoader = true
      this.imageCard = false
      setTimeout(() => {
          this.skeletonLoader = false
          this.imageCard = true
      }, 1000)
    },
    async fetchClientImage(imageFileName) {
      try {
          const response = await apiClient.get(`/client_image/${imageFileName}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          responseType: 'blob',
          });
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          this.imageSource = URL.createObjectURL(blob);
      } catch (error) {
          console.error('Error fetching client image:', error);
          this.imageSource = '';
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
        this.showSnackbar(`Failed to fetch ${key}`, 'error');
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
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
  },
};

</script>
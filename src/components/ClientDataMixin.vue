<template>
  <v-container>
    <div class="text-center">
      <v-container class="skeleton-loader">
        <p>
          <v-skeleton-loader v-if="skeletonLoader" type="image" width="240" height="248"
            style="border: 1px solid #ccc; border-radius: 10px;"></v-skeleton-loader>
          <img v-if="imageCard" :src="imageSource" width="241" style="border: 1px solid #ccc; border-radius: 10px;"
            alt="Client Image" />
        </p>
      </v-container>
      <h3 class="mb-7"><span class="text-grey-lighten-1">CID: </span>{{ client?.cid }}</h3>
    </div>
    <v-row>
      <v-col cols="12" lg="4" md="4" sm="4" v-for="field in clientFields" :key="field.label">
        <p><span class="text-grey-lighten-1">{{ field.label }}: </span>{{ field.value }}</p>
      </v-col>
    </v-row>
    <Snackbar ref="snackbarRef" />
  </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';
export default {
  name: "ClientDetails",
  components: {
    Snackbar
  },
  data() {
    return {
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
    }
  },
  props: {
    client: Object,
    skeletonLoader: Boolean,
    imageCard: Boolean,
    imageSource: String,
  },
  computed: {
    clientFields() {
      return [
        { label: "First Name", value: this.client?.first_name },
        { label: "Middle Name", value: this.client?.middle_name },
        { label: "Last Name", value: this.client?.last_name },
        { label: "Title", value: this.getTitle(this.client?.title, this.titleItems, "title") },
        { label: "Display Name", value: this.client?.display_name },
        { label: "Initial", value: this.client?.initial },
        { label: "Staff or Not", value: this.staffLabel },
        { label: "Type", value: this.getTitle(this.client?.type, this.typeItems, "type") },
        { label: "Mobile 1", value: this.client?.mobile1 },
        { label: "Email", value: this.client?.email },
        { label: "Nationality", value: this.client?.nationality },
        { label: "Gender", value: this.getTitle(this.client?.gender, this.genderItems, "gender") },
        { label: "Civil Status", value: this.getTitle(this.client?.civil_status, this.civilstatusItems, "civil_status") },
        { label: "Birthdate", value: this.client?.birthdate ? this.formatDate(this.client?.birthdate) : "N/A" },
        { label: "Purok/Street/Block No.", value: this.client?.address_line1 },
        { label: "Barangay", value: this.client?.address_line2 },
        { label: "City/Municipality", value: this.client?.address_line3 },
        { label: "Address Type", value: this.getTitle(this.client?.address_type, this.addresstypeItems, "address_type") },
        { label: "Telephone", value: this.client?.telephone },
        { label: "Postal Code", value: this.client?.postal_code },
      ];
    },
    staffLabel() {
      return this.client?.staff_or_not === 2 ? 'No' : 'Yes';
    },
  },
  mounted() {
    this.fetchSuffixesItems();
    this.fetchTypesItems();
    this.fetchTitlesItems();
    this.fetchGenderItems();
    this.fetchCivilStatusItems();
    this.fetchAddressTypeItems();
  },
  methods: {
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
    async fetchSuffixesItems() {
      this.fetchItems('/suffixes', 'suffixesItems', 'Failed to fetch suffixes');
    },
    async fetchTypesItems() {
      this.fetchItems('/types', 'typeItems', 'Failed to fetch types');
    },
    async fetchTitlesItems() {
      this.fetchItems('/titles', 'titleItems', 'Failed to fetch titles');
    },
    async fetchGenderItems() {
      this.fetchItems('/genders', 'genderItems', 'Failed to fetch gender');
    },
    async fetchCivilStatusItems() {
      this.fetchItems('/civil_status', 'civilstatusItems', 'Failed to fetch civil status');
    },
    async fetchAddressTypeItems() {
      this.fetchItems('/address_type', 'addresstypeItems', 'Failed to fetch address type');
    },
    getTitle(id, items, titleKey) {
      const item = items.find(item => String(item.id) === String(id));
      return item ? item[titleKey] : "Unknown";
    },
    formatDate(date) {
      if (!date) return "Invalid date";
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return "Invalid date";
      }
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
    },
  }
};
</script>

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
      <h3 class="mb-7"><span class="text-grey-lighten-1">CID: </span>{{ client?.CID }}</h3>
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
        { label: "First Name", value: this.client?.Name2 },
        { label: "Middle Name", value: this.client?.Name3 },
        { label: "Last Name", value: this.client?.Name1 },
        { label: "Title", value: this.getTitle(this.client?.TitleCode, this.titleItems, "title") },
        { label: "Display Name", value: this.client?.DisplayName },
        { label: "Initial", value: this.client?.Initials },
        { label: "Staff", value: this.staffLabel },
        { label: "Type", value: this.getTitle(this.client?.Type, this.typeItems, "type") },
        { label: "Mobile 1", value: this.client?.Mobile1 },
        { label: "Email", value: this.client?.Email1 },
        { label: "Nationality", value: this.client?.Email2 },
        { label: "Gender", value: this.getTitle(this.client?.GenderType, this.genderItems, "gender") },
        { label: "Civil Status", value: this.getTitle(this.client?.CivilStatusCode, this.civilstatusItems, "civil_status") },
        { label: "Birthdate", value: this.client?.BirthDate ? this.formatDate(this.client?.BirthDate) : "N/A" },
        { label: "Prk./St./Blck.", value: this.client?.address?.[0]?.Line1 },
        { label: "Barangay", value: this.client?.address?.[0]?.Line2 },
        { label: "City/Municipality", value: this.client?.address?.[0]?.Line3 },
        { label: "Address Type", value: this.getTitle(this.client?.address?.[0]?.AddressType, this.addresstypeItems, "address_type") },
        { label: "Telephone", value: this.client?.address?.[0]?.Phone1 },
        { label: "Postal Code", value: this.client?.address?.[0]?.PostalCode },
      ];
    },
    staffLabel() {
      return this.client?.DosriTF === 'F' ? 'No' : 'Yes';
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
    getTitle(code, items, titleKey) {
      const item = items.find(item => String(item.code) === String(code));
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

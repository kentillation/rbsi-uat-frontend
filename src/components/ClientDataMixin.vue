<template>
  <v-container>
    <div class="text-center">
      <v-container class="skeleton-loader">
        <p>
          <v-skeleton-loader v-if="skeletonLoader" type="image" width="240" height="248" style="border: 1px solid #ccc; border-radius: 10px;"></v-skeleton-loader>
          <img v-if="imageCard" :src="imageSrc" width="241" style="border: 1px solid #ccc; border-radius: 10px;" alt="Client Image" />
        </p>
      </v-container>
      <h3 class="mb-7"><span class="text-grey-lighten-1">CID: </span>{{ client?.cid }}</h3>
    </div>
    <v-row>
      <v-col cols="12" lg="4" md="4" sm="4" v-for="field in clientFields" :key="field.label">
        <p><span class="text-grey-lighten-1">{{ field.label }}: </span>{{ field.value }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ClientDetails",
  props: {
    client: Object,
    skeletonLoader: Boolean,
    imageCard: Boolean,
    imageSrc: String,
    typeItems: Array,
    titleItems: Array,
    clientstatusItems: Array,
    genderItems: Array,
    civilstatusItems: Array,
    addresstypeItems: Array,
    undefItems: Array,
    entityItems: Array,
    employmentItems: Array,
    taxcodeItems: Array,
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
        { label: "Client Status", value: this.getTitle(this.client?.client_status, this.clientstatusItems, "client_status") },
        { label: "Type", value: this.getTitle(this.client?.type, this.typeItems, "type") },
        { label: "Mobile 1", value: this.client?.mobile1 },
        { label: "Mobile 2", value: this.client?.mobile2 },
        { label: "Email", value: this.client?.email },
        { label: "Nationality", value: this.client?.nationality },
        { label: "TIN", value: this.client?.tin },
        { label: "Gender", value: this.getTitle(this.client?.gender, this.genderItems, "gender") },
        { label: "Civil Status", value: this.getTitle(this.client?.civil_status, this.civilstatusItems, "civil_status") },
        { label: "Birthdate", value: this.client?.birthdate ? this.formatDate(this.client?.birthdate) : "N/A" },
        { label: "Address Line 1", value: this.client?.address_line1 },
        { label: "Address Line 2", value: this.client?.address_line2 },
        { label: "Address Line 3", value: this.client?.address_line3 },
        { label: "Address Line 4", value: this.client?.address_line4 },
        { label: "Address Type", value: this.getTitle(this.client?.address_type, this.addresstypeItems, "address_type") },
        { label: "Telephone", value: this.client?.telephone },
        { label: "Fax", value: this.client?.fax },
        { label: "Postal Code", value: this.client?.postal_code },
        { label: "Undefined", value: this.getTitle(this.client?.undef, this.undefItems, "undef") },
        { label: "Entity", value: this.getTitle(this.client?.entity, this.entityItems, "entity") },
        { label: "Employment", value: this.getTitle(this.client?.employment, this.employmentItems, "employment") },
        { label: "Language Preferences", value: this.client?.cus_lang_pref },
        { label: "Tax Code", value: this.getTitle(this.client?.tax_code, this.taxcodeItems, "tax_code") }
      ];
    },
    staffLabel() {
      return this.client?.staff_or_not === 1 ? 'Yes' : 'No';
    },
  },
  methods: {
    getTitle(id, items, titleKey) {
      const item = items.find(item => item.id === id);
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
    }
  }
};
</script>

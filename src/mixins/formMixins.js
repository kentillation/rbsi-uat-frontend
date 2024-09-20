
import apiClient from '../axios';

export default {
  data() {
    return {
      dialog: false,
      type: "",
      client_status: "",
      first_name: "",
      middle_name: "",
      display_name: "",
      initial: "",
      tin: "",
      pickerVisible: false,
      minDate: '1930-01-01',
      maxDate: this.formatToDateString(new Date()),
      timezone: 'Asia/Manila',
      mobile1: "",
      mobile2: "",
      email: "",
      nationality: 'Filipino',
      address_line2: "",
      address_line3: "",
      address_line4: "",
      postal_code: "",
      telephone: "",
      fax: "",
      image_file: null,
      typeItems: [],
      titleItems: [],
      clientstatusItems: [],
      genderItems: [],
      civilstatusItems: [],
      addresstypeItems: [],
      institutionItems: [],
      entityItems: [],
      employmentItems: [],
      taxcodeItems: [],
      typeRule: (v) => !!v || 'Type is required',
      titleRule: (v) => !!v || 'Title is required',
      clientstatusRule: (v) => !!v || 'Client status is required',
      firstnameRule: (v) => !!v || 'First name is required',
      middlenameRule: (v) => !!v || 'Middle name is required',
      lastnameRule: (v) => !!v || 'Last name is required',
      displaynameRule: (v) => !!v || 'Display name is required',
      tinRule: (v) => !!v || 'TIN is required',
      genderRule: (v) => !!v || 'Gender is required',
      civilstatusRule: (v) => !!v || 'Civil status is required',
      mobile1Rule: (v) => !!v || 'Mobile 1 is required',
      emailRule: (v) => !!v || 'Email is required',
      nationalityRule: (v) => !!v || 'Nationality is required',
      addressline1Rule: (v) => !!v || 'Address Line 1 is required',
      addressline2Rule: (v) => !!v || 'Address Line 2 is required',
      addressline3Rule: (v) => !!v || 'Address Line 3 is required',
      addressline4Rule: (v) => !!v || 'Address Line 4 is required',
      postalcodeRule: (v) => !!v || 'Postal Code is required',
      addresstypeRule: (v) => !!v || 'Address type is required',
      institutionRule: (v) => !!v || 'Undefined code is required',
      entityRule: (v) => !!v || 'Entity code is required',
      employmentRule: (v) => !!v || 'Employment code is required',
      imagefileRule: (v) => !!v || 'Image file is required',
      taxcodeRule: (v) => !!v || 'Client Tax Code is required',
      validating: false,
      snackbar: {
        visible: false,
        message: "",
        color: ""
      },
      to_HomePage: false,
      confirm_identity_dialog: false,
    };
  },
  watch: {
    displayName(newVal) {
      this.display_name = newVal;
    }
  },
  mounted() {
    this.fetchTypesItems();
    this.fetchTitlesItems();
    this.fetchClientStatusItems();
    this.fetchGenderItems();
    this.fetchCivil_StatusItems();
    this.fetchUndefItems();
    this.fetchEntityItems();
    this.fetchEmploymentItems();
    this.fetchAddressTypeItems();
    this.fetchTaxCodeItems();
  },
  computed: {
    displayName() {
      const firstName = this.first_name || '';
      const middleName = this.middle_name ? `${this.middle_name.charAt(0)}.` : '';
      const lastName = this.last_name || '';
      return `${lastName}, ${firstName} ${middleName}`.trim();
    },
    formattedBirthdate() {
      if (!this.birthdate) return '';
      const date = new Date(this.birthdate);
      return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: this.timezone,
      }).format(date);
    },
    isFormValid() {
      return [
        this.type, this.title, this.client_status, this.first_name, this.middle_name,
        this.last_name, this.display_name, this.tin, this.gender, this.civil_status,
        this.birthdate, this.mobile1, this.email, this.nationality, this.address_line1,
        this.address_line2, this.address_line3, this.address_line4, this.postal_code,
        this.address_type, this.institution, this.entity, this.employment, this.image_file, this.tax_code
      ].every(field => !!field);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    formatToDateString(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async fetchItems(endpoint, targetArray, errorMessage) {
      try {
        const response = await apiClient.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        this[targetArray] = response.data;
      } catch (error) {
        this.showSnackbar(errorMessage, 'error');
      }
    },
    async fetchTypesItems() {
      this.fetchItems('/types', 'typeItems', 'Failed to fetch types');
    },
    async fetchTitlesItems() {
      this.fetchItems('/titles', 'titleItems', 'Failed to fetch titles');
    },
    async fetchClientStatusItems() {
      this.fetchItems('/client_status', 'clientstatusItems', 'Failed to fetch client status');
    },
    async fetchGenderItems() {
      this.fetchItems('/genders', 'genderItems', 'Failed to fetch gender');
    },
    async fetchCivil_StatusItems() {
      this.fetchItems('/civil_status', 'civilstatusItems', 'Failed to fetch civil status');
    },
    async fetchAddressTypeItems() {
      this.fetchItems('/address_type', 'addresstypeItems', 'Failed to fetch address type');
    },
    async fetchUndefItems() {
      this.fetchItems('/institution', 'institutionItems', 'Failed to fetch institution codes');
    },
    async fetchEntityItems() {
      this.fetchItems('/entity', 'entityItems', 'Failed to fetch entities');
    },
    async fetchEmploymentItems() {
      this.fetchItems('/employment', 'employmentItems', 'Failed to fetch employment codes');
    },
    async fetchTaxCodeItems() {
      this.fetchItems('/tax_code', 'taxcodeItems', 'Failed to fetch tax codes');
    },
    async checkIdentity() {
      if (!this.first_name || !this.middle_name || !this.last_name) return;
      try {
        const [response1, response2] = await Promise.all([
          apiClient.get('/check_mbwin_client_info', {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            params: { first_name: this.first_name, middle_name: this.middle_name, last_name: this.last_name }
          }),
          apiClient.get('/check_new_db_client_info', {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            params: { first_name: this.first_name, middle_name: this.middle_name, last_name: this.last_name }
          })
        ]);
        if (response1.data.exists) this.showSnackbar('Name already exists in MBWin database.', 'error');
        if (response2.data.exists) this.showSnackbar('Name already exists in new database.', 'error');
      } catch (error) {
        this.showSnackbar('Error checking identity. Refresh the page!', 'error');
      }
    },
    getTitle(value, items, key) {
      const item = items.find(item => item.id === value);
      return item ? item[key] : 'N/A';
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
    handleFormError(error) {
      let message = 'An unknown error occurred.';
      if (error.response) {
        switch (error.response.status) {
          case 404:
            message = 'Client not found.';
            break;
          case 422:
            message = 'Invalid input.';
            break;
          case 429:
            message = 'Too many API requests. Refresh the page!';
            break;
          case 409:
            message = 'Contact already exist!';
            break;
          case 500:
            message = 'Internal server error. Please try again later.';
            break;
          default:
            message = `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        message = 'No response from server.';
      } else {
        message = 'Request error. Please try again!';
      }
      this.showSnackbar(message, 'error');
    },
    showConfirmDialog() {
      // console.log(this.mapFormDataToAPI());
      if (this.isFormValid) this.dialog = true;
      this.skeletonLoader = true;
      this.imageCard = false;
      setTimeout(() => {
        this.skeletonLoader = false;
        this.imageCard = true;
        this.imageSrc = URL.createObjectURL(this.image_file);
      }, 1000);
    },
  },
};

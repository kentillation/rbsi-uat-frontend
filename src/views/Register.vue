<template>
  <v-container class="mt-12">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="mx-auto pa-12 pb-8 mt-12" elevation="8" max-width="448" rounded="lg">
          <v-card-title>
            <h1 class="text-center">Sign-up</h1>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register" ref="form">
              <div class="text-subtitle-1 text-medium-emphasis">Last Name</div>
              <v-text-field v-model="first_name" :rules="[first_nameRule]" required density="compact"
                placeholder="Enter your last name" prepend-inner-icon="mdi-account-outline"
                variant="outlined"></v-text-field>
              <div class="text-subtitle-1 text-medium-emphasis mt-2">First Name</div>
              <v-text-field v-model="midlle_name" :rules="[midlle_nameRule]" required density="compact"
                placeholder="Enter your first name" prepend-inner-icon="mdi-account-outline"
                variant="outlined"></v-text-field>
              <div class="text-subtitle-1 text-medium-emphasis mt-2">Middle Name</div>
              <v-text-field v-model="last_name" :rules="[last_nameRule]" required density="compact"
                placeholder="Enter your middle name" prepend-inner-icon="mdi-account-outline"
                variant="outlined"></v-text-field>
              <v-btn :disabled="!isFormValid || validating" color="white" type="submit" block
                class="bg-orange-darken-4 mb-8 mt-5" size="large" variant="tonal" :loading="validating" height="40"
                text="Validate" width="135" rounded>
                Proceed
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top>
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Register',
  data() {
    return {
      first_name: '',
      midlle_name: '',
      last_name: '',
      first_nameRule: (v) => !!v || 'First name is required',
      midlle_nameRule: (v) => !!v || 'Middle name is required',
      last_nameRule: (v) => !!v || 'Last name is required',
      validating: false,
      snackbar: {
        visible: false,
        message: '',
        color: ''
      }
    };
  },
  computed: {
    isFormValid() {
      return this.first_name !== '' && this.midlle_name !== '' && this.last_name !== '';
    }
  },
  methods: {
    async register() {
      this.validating = true;
      try {
        if (this.$refs.form.validate()) {
          const response = await apiClient.post('/register', {
            first_name: this.first_name,
            midlle_name: this.midlle_name,
            last_name: this.last_name
          });

          if (response.status === 200) {
            this.showSnackbar('Account has been saved successfully.', 'success');
            this.$router.push('/register');
          }
        }
      } catch (error) {
        let message = 'An unknown error occurred.';
        let color = 'error';

        if (error.response) {
          switch (error.response.status) {
            case 422:
              message = 'Invalid input.';
              break;
            case 409:
              message = 'Account already exists.';
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

        this.showSnackbar(message, color);
      } finally {
        this.validating = false;
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>

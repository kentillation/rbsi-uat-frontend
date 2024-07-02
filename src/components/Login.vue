<template>
    <v-container class="mt-12">
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-card class="mx-auto pa-12 pb-8 mt-12" elevation="8" max-width="448" rounded="lg">
                    <v-card-title>
                        <h1 class="text-center">Sign-in</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login" ref="form">
                            <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                            <v-text-field v-model="email" :rules="[emailRule]" autocomplete="username" required
                                density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                                variant="outlined">
                            </v-text-field>

                            <div class="text-subtitle-1 text-medium-emphasis mt-2">Password</div>
                            <v-text-field v-model="password" :rules="[passwordRule]" autocomplete="current-password"
                                required :type="visible ? 'text' : 'password'"
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" density="compact"
                                placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
                                variant="outlined" @click:append-inner="visible = !visible">
                            </v-text-field>

                            <v-btn :disabled="!isFormValid || validating" color="white" type="submit" block
                                class="bg-orange-darken-4 mb-8 mt-5" size="large" variant="tonal" :loading="validating"
                                height="40" text="Validate" width="135" rounded>
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
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            emailRule: (v) => !!v || 'Email is required',
            passwordRule: (v) => !!v || 'Password is required',
            validating: false,
            visible: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            }
        };
    },
    computed: {
        isFormValid() {
            return this.email !== '' && this.password !== '';
        }
    },
    methods: {
        async login() {
            this.validating = true;
            try {
                if (this.$refs.form.validate()) {
                    const response = await apiClient.post('/login', {
                        email: this.email,
                        password: this.password,
                    });

                    if (response.status === 200) {
                        localStorage.setItem('auth_token', response.data.access_token);
                        this.$router.push('/dashboard');
                        this.showSnackbar('Login successful!', 'success');
                    }
                }
            } catch (error) {
                let message = 'An unknown error occurred.';
                let color = 'error';

                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            message = 'Invalid email address.';
                            break;
                        case 401:
                            message = 'Email or password is incorrect.';
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
    },
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>

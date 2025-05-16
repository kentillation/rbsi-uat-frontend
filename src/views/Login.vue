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
                            <v-text-field v-model="email" :rules="[emailRule]" autocomplete="email" required
                                density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                                variant="outlined" clearable></v-text-field>
                            <div class="text-subtitle-1 text-medium-emphasis mt-2">Password</div>
                            <v-text-field v-model="password" :rules="[passwordRule]" autocomplete="current-password"
                                required :type="visible ? 'text' : 'password'"
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" density="compact"
                                placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
                                variant="outlined" @click:append-inner="visible = !visible" clearable></v-text-field>
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
    </v-container>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="top" timeout="5000">
        <div class="d-flex align-items-center py-3">
            <span><v-icon icon="mdi-information-outline"></v-icon></span>
            <span>&nbsp; {{ snackbar.message }}</span>
        </div>
    </v-snackbar>
</template>

<script>
import apiClient from '../axios';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Login',
    data() {
        return {
            encryptionKey: null, // Will be received from server
            publicKey: null,    // For RSA key exchange
            sessionKey: null,    // Generated AES key for the session
            encryptor: new JSEncrypt(),
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
    mounted() {
        this.initializeEncryption();
    },
    methods: {
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        },
        async initializeEncryption() {
            try {
                // Get server's public key
                const response = await apiClient.get('/encryption/init');
                this.publicKey = response.data.publicKey;
                this.encryptor.setPublicKey(this.publicKey);

                // Generate random 32-byte session key (256-bit) as Base64
                const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
                this.sessionKey = btoa(String.fromCharCode.apply(null, randomBytes));

                // Encrypt with RSA (using PKCS#1 v1.5 padding which is more compatible)
                const encryptedKey = this.encryptor.encrypt(this.sessionKey);

                if (!encryptedKey) {
                    throw new Error('RSA encryption failed');
                }

                // Send to server and store session ID
                const establishResponse = await apiClient.post('/encryption/establish', {
                    encryptedKey: encryptedKey
                });

                // Store session ID for future requests
                this.sessionId = establishResponse.data.sessionId;

            } catch (error) {
                console.error('Encryption initialization failed:', error);
                this.showSnackbar('Security initialization failed. Please refresh.', 'error');
                throw error; // Re-throw to handle in calling method
            }
        },

        async login() {
            try {
                if (this.$refs.form.validate()) {
                    this.validating = true;

                    // Ensure encryption is ready
                    if (!this.sessionKey || !this.sessionId) {
                        await this.initializeEncryption();
                    }

                    const payload = {
                        email: this.email,
                        password: this.password,
                        timestamp: Date.now()
                    };

                    // Encrypt with AES
                    const encryptedPayload = CryptoJS.AES.encrypt(
                        JSON.stringify(payload),
                        CryptoJS.enc.Base64.parse(this.sessionKey),
                        { mode: CryptoJS.mode.CBC }
                    ).toString();

                    const response = await apiClient.post('/admin-login', {
                        data: encryptedPayload,
                        headers: {
                            'X-Session-ID': this.sessionId
                        }
                    });

                    if (response.status === 200) {
                        localStorage.setItem('auth_token', response.data.access_token);
                        this.$router.push('/client_info');
                    }
                }
            } catch (error) {
                let message = 'An unknown error occurred.';
                let color = 'error';
                console.error('Login error:', error);
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            message = 'Invalid email address.';
                            break;
                        case 401:
                            message = 'Email or password is incorrect.';
                            break;
                        case 403:
                            message = 'You do not have permission to this action.';
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
        }
    },

};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
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
                            <h5 class="text-center"><v-icon>mdi-lock-outline</v-icon>&nbsp; Secured with end-to-end
                                encryption.</h5>
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
            encryptionKey: null,
            publicKey: null,
            sessionKey: null,
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
                const response = await apiClient.get('/encryption/init');
                this.publicKey = response.data.publicKey;
                this.encryptor.setPublicKey(this.publicKey);
                const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
                this.sessionKey = btoa(String.fromCharCode(...randomBytes));
                const encryptedKey = this.encryptor.encrypt(this.sessionKey);
                if (!encryptedKey) {
                    throw new Error('RSA encryption failed');
                }
                const establishResponse = await apiClient.post('/encryption/establish', {
                    encryptedKey: encryptedKey
                });
                console.log('Encrypted key:', encryptedKey);
                console.log("Session Key (Base64):", this.sessionKey);
                this.sessionId = establishResponse.data.sessionId;

            } catch (error) {
                console.error('Encryption initialization failed:', error);
                this.showSnackbar('Security initialization failed. Please refresh.', 'error');
                throw error;
            }
        },

        async login() {
            try {
                const isValid = await this.$refs.form.validate();
                if (!isValid.valid) return;

                if (this.$refs.form.validate()) {
                    this.validating = true;
                    if (!this.sessionKey || !this.sessionId) {
                        await this.initializeEncryption();
                    }
                    const payload = {
                        email: this.email,
                        password: this.password,
                        timestamp: Date.now()
                    };

                    // Generate IV and convert to WordArray
                    const iv = CryptoJS.lib.WordArray.random(16);

                    // Encrypt
                    const encrypted = CryptoJS.AES.encrypt(
                        JSON.stringify(payload),
                        CryptoJS.enc.Base64.parse(this.sessionKey),
                        {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        }
                    );

                    // Check if encryption was successful
                    if (!encrypted) {
                        throw new Error('AES encryption failed');
                    }

                    // Combine IV and ciphertext in binary format
                    const ivBinary = CryptoJS.enc.Hex.parse(iv.toString(CryptoJS.enc.Hex));
                    const ciphertextBinary = CryptoJS.enc.Base64.parse(encrypted.toString());

                    // Concatenate and convert to single Base64
                    const combined = CryptoJS.lib.WordArray.create()
                        .concat(ivBinary)
                        .concat(ciphertextBinary);

                    const ivAndCiphertext = combined.toString(CryptoJS.enc.Base64);

                    const response = await apiClient.post('/admin-login',
                        { data: ivAndCiphertext },
                        {
                            headers: {
                                'X-Session-ID': this.sessionId
                            }
                        }
                    );

                    if (response.status === 200) {
                        localStorage.setItem('auth_token', response.data.access_token);
                        this.$router.push('/client_info');
                    }
                }
            } catch (error) {
                console.error('Login failed:', error);
                const message = error.response?.data?.message || 'Login failed. Please try again.';
                this.showSnackbar(message, 'error');
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
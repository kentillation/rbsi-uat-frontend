import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import apiClient from '../axios';

export default {
    data() {
        return {
            encryptionKey: null,
            publicKey: null,
            sessionKey: null,
            sessionId: null,
            encryptor: new JSEncrypt()
        };
    },
    created() {
        apiClient.interceptors.request.use(config => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, error => Promise.reject(error));
    },
    methods: {
        async initializeEncryption() {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) throw new Error('No auth token found');
                
                const response = await apiClient.get('/encryption/init', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                this.publicKey = response.data.publicKey;
                this.encryptor.setPublicKey(this.publicKey);
                
                const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
                this.sessionKey = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(randomBytes));
                
                const encryptedKey = this.encryptor.encrypt(this.sessionKey);
                if (!encryptedKey) throw new Error('RSA encryption failed');
                
                const establishResponse = await apiClient.post('/encryption/establish', {
                    encryptedKey: encryptedKey
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                this.sessionId = establishResponse.data.sessionId;
            } catch (error) {
                console.error('Encryption init failed:', error);
                this.clearSensitiveData();
                throw error;
            }
        },
        async decryptResponseV1(encryptedData) {
            try {
                const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData); // Parse Base64 input
                if (encryptedBytes.sigBytes < 16) {
                    throw new Error("Encrypted data too short (missing IV?)");
                }
                const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4)); // Extract IV (first 16 bytes) and ciphertext
                const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4));
                console.log("IV (hex):", iv.toString(CryptoJS.enc.Hex));  // Debug logs
                console.log("Ciphertext length:", ciphertext.sigBytes, "bytes");
                const decrypted = CryptoJS.AES.decrypt(  // Decrypt
                    { ciphertext: ciphertext },
                    CryptoJS.enc.Base64.parse(this.sessionKey),
                    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
                );
                let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8); // Try UTF-8, fall back to Latin1 if needed
                if (!decryptedStr) {
                    decryptedStr = decrypted.toString(CryptoJS.enc.Latin1);
                    console.warn("Used Latin1 fallback for decrypted data");
                }
                return JSON.parse(decryptedStr);
            } catch (error) {
                console.error("Decryption failed:", error);
                throw new Error("Failed to decrypt response: " + error.message);
            }
        },
        async decryptResponseV2(encryptedData) {
            const encryptedResponse = CryptoJS.enc.Base64.parse(encryptedData);
            const iv = CryptoJS.lib.WordArray.create(encryptedResponse.words.slice(0, 4));
            const ciphertext = CryptoJS.lib.WordArray.create(encryptedResponse.words.slice(4));
            const decrypted = CryptoJS.AES.decrypt(
                { ciphertext: ciphertext },
                CryptoJS.enc.Base64.parse(this.sessionKey),
                {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            );
            const decryptedBytes = decrypted.toString(CryptoJS.enc.Latin1);
            return JSON.parse(decryptedBytes);
        },
    }
};
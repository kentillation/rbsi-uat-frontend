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
    methods: {
        async initializeEncryption() {
            try {
                const response = await apiClient.get('/encryption/init');
                this.publicKey = response.data.publicKey;
                this.encryptor.setPublicKey(this.publicKey);
                const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
                this.sessionKey = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(randomBytes));
                const encryptedKey = this.encryptor.encrypt(this.sessionKey);
                if (!encryptedKey) {
                    throw new Error('RSA encryption failed');
                }
                const establishResponse = await apiClient.post('/encryption/establish', {
                    encryptedKey: encryptedKey
                });
                this.sessionId = establishResponse.data.sessionId;
                return true;
            } catch (error) {
                console.error('Encryption initialization failed:', error);
                throw error;
            }
        },
        
        async decryptResponse(encryptedData) {
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
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        }
    }
};
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h1>Home</h1>
        <v-btn @click="customerinfo">Customer Info</v-btn>
        <v-btn @click="logout">Logout</v-btn>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Dashboard',
    methods: {
        async customerinfo() {
            try {
                this.$router.push('/customer-info');
            } catch (error) {
                console.error('Error in accessing customer info:', error);
            }
        },
        async logout() {
            try {
                await apiClient.post('/logout', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                localStorage.removeItem('auth_token');
                this.$router.push('/');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    }
};
</script>
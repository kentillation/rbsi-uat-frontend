<template>
  <v-app dark>
    <v-main>
      <v-layout class="h-screen">
        <v-navigation-drawer v-if="showSidebar" expand-on-hover rail>
          <v-list>
            <v-list-item
              prepend-avatar="https://scontent.fmnl9-2.fna.fbcdn.net/v/t39.30808-6/337302138_184463887675079_4544857132514647302_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFyZVtD3gKw0nWquJDl0NEvMUBmZuLlPskxQGZm4uU-yUWIKlUjgrW-qgSOHHpXR7RgBFhIiGjVhveHNnvCg-z9&_nc_ohc=LBCM5aBq-d4Q7kNvgEsY6T_&_nc_ht=scontent.fmnl9-2.fna&oh=00_AYAUeTQjWPiR3Dk2ojrLPRy3yPiDxSaOxRdYbj7uAFNrRQ&oe=669B9056"
              subtitle="support@rbsagay.com.ph"
              title="Administrator"
            ></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home" @click="home">Home</v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple" @click="customerinfo">Customers</v-list-item>
            <v-list-item prepend-icon="mdi-logout" @click="logout">Signout</v-list-item>
          </v-list>
        </v-navigation-drawer>
        <router-view />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import apiClient from './axios';

export default {
  name: 'App',
  computed: {
    showSidebar() {
      return this.$route.name !== 'Login';
    }
  },
  methods: {
    async home() {
      try {
        this.$router.push('/home');
      } catch (error) {
        console.error('Error accessing home:', error);
      }
    },
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

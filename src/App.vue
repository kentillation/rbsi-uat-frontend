<template>
  <v-app>
    <v-main>
      <v-app-bar prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title><span class="to-hide-head">Rural Bank of Sagay, Inc.</span><span class="to-show-head">RBSI</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>
      <v-navigation-drawer class="h-screen" v-model="drawer" v-if="showSidebar" expand-on-hover rail>
        <v-list>
          <v-list-item
            prepend-avatar="https://file.juancash.com/group1/M00/02/71/rBDKAWKph1qAS2RCAAA5jllxxdg605.jpg"
            subtitle="support@rbsagay.com.ph" title="Administrator"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-outline" @click="home">Home</v-list-item>
          <v-list-item prepend-icon="mdi-information-outline" @click="client_info">Client_Information</v-list-item>
          <v-list-subheader class="ms-5" size="30">Reports</v-list-subheader>
          <v-list-item prepend-icon="mdi-account-multiple-outline" @click="all_clients">Clients_Masterlist</v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-logout" @click="logout">Signout</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-layout>
        <router-view />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import apiClient from './axios';

export default {
  name: 'App',
  data: () => ({
      drawer: false,
      group: null,
    }),

    watch: {
      group () {
        this.drawer = false
      },
    },
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
    async client_info() {
      try {
        this.$router.push('/client_info');
      } catch (error) {
        console.error('Error in accessing client info:', error);
      }
    },
    async all_clients() {
      try {
        this.$router.push('/all_clients');
      } catch (error) {
        console.error('Error in accessing all clients:', error);
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

<style>
.to-show-head {
  display: none;
}
@media (max-width: 450px) {
    .to-hide-head {
        display: none;
    }
    .to-show-head {
      display: flex;
    }
}
</style>

<template>
  <v-app>
    <v-main>
      <v-app-bar prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Rural Bank of Sagay, Inc.</v-toolbar-title>
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
            prepend-avatar="https://scontent.fmnl9-2.fna.fbcdn.net/v/t39.30808-6/337302138_184463887675079_4544857132514647302_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFyZVtD3gKw0nWquJDl0NEvMUBmZuLlPskxQGZm4uU-yUWIKlUjgrW-qgSOHHpXR7RgBFhIiGjVhveHNnvCg-z9&_nc_ohc=LBCM5aBq-d4Q7kNvgEsY6T_&_nc_ht=scontent.fmnl9-2.fna&oh=00_AYAUeTQjWPiR3Dk2ojrLPRy3yPiDxSaOxRdYbj7uAFNrRQ&oe=669B9056"
            subtitle="support@rbsagay.com.ph" title="Administrator"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home" @click="home">Home</v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" @click="clientinfo">Clients</v-list-item>
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
    async clientinfo() {
      try {
        this.$router.push('/client_info');
      } catch (error) {
        console.error('Error in accessing client info:', error);
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

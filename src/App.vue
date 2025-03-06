<template>
  <v-app>
    <v-main>
      <v-app-bar prominent>
        <v-app-bar-nav-icon v-if="showMenu" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title><span class="to-hide-head">Rural Bank of Sagay, Inc.</span><span class="to-show-head">RBSI</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleTheme" :title="themeText">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
        <v-btn v-if="showLogout" icon @click="logout" title="Signout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer class="h-screen" v-model="drawer" v-if="showSidebar" expand-on-hover rail>
        <v-list>
          <v-list-item
            prepend-avatar="https://file.juancash.com/group1/M00/02/71/rBDKAWKph1qAS2RCAAA5jllxxdg605.jpg"
            subtitle="support@rbsagay.com.ph" title="Administrator"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-subheader class="ms-5" size="30">Client</v-list-subheader>
          <v-list-item prepend-icon="mdi-information-outline" @click="client_info" class="text-teal-darken-1">Information</v-list-item>
          <v-list-item prepend-icon="mdi-bank-outline" @click="client_account" class="text-teal-darken-1">Account</v-list-item>
          <v-list-subheader class="ms-5" size="30">Reports</v-list-subheader>
          <v-list-item prepend-icon="mdi-account-multiple-outline" @click="all_clients" class="text-teal-darken-1">Masterlist</v-list-item>
          <v-list-item prepend-icon="mdi-printer" @click="reprinting" class="text-teal-darken-1">Reprinting</v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-subheader class="ms-5" size="30">More</v-list-subheader>
          <v-list-item prepend-icon="mdi-help-circle-outline" class="text-teal-darken-1">Help</v-list-item>
          <v-list-item prepend-icon="mdi-information-outline" class="text-teal-darken-1">About</v-list-item>
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
import { useTheme } from 'vuetify';

export default {
  name: 'App',
  setup() {
        const theme = useTheme();
        const toggleTheme = () => {
            const newTheme = theme.global.name.value === 'light' ? 'dark' : 'light';
            theme.global.name.value = newTheme;
            localStorage.setItem('theme', newTheme);
        };
        return { theme, toggleTheme };
    },
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
    },
    showLogout() {
      return this.$route.name !== 'Login';
    },
    showMenu() {
      return this.$route.name !== 'Login';
    },
    themeText() {
      return this.theme.global.name.value === 'light' ? 'Dark Mode' : 'Light Mode';
    }
  },
  methods: {
    async client_info() {
      try {
        this.$router.push('/client_info');
      } catch (error) {
        console.error('Error in accessing client info:', error);
      }
    },
    async client_account() {
      try {
        this.$router.push('/client_account');
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
    async reprinting() {
      try {
        this.$router.push('/reprinting');
      } catch (error) {
        console.error('Error in accessing reprinting:', error);
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

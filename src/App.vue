<template>
  <v-app>
    <v-main>
      <v-app-bar prominent>
        <v-app-bar-nav-icon v-if="showMenu && hideForbiddenPage && hideNotFoundPage" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title v-if="hideForbiddenPage && hideNotFoundPage"><span class="to-hide-head">Rural Bank of Sagay, Inc.</span><span class="to-show-head">RBSI</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleTheme" :title="themeText">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
        <v-btn v-if="showLogout && hideForbiddenPage && hideNotFoundPage" icon @click="logout" title="Signout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer class="h-screen" v-model="drawer" v-if="showSidebar && hideForbiddenPage && hideNotFoundPage" expand-on-hover rail>
        <v-list>
          <v-list-item :prepend-avatar="logo" subtitle="support@rbsagay.org" title="Administrator"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-subheader class="ms-5" size="30">Client</v-list-subheader>
          <v-list-item prepend-icon="mdi-information-outline" @click="client_info" class="text-teal-darken-2">Information</v-list-item>
          <v-list-item prepend-icon="mdi-bank-outline" @click="client_account" class="text-teal-darken-2">Account</v-list-item>
          <v-list-item prepend-icon="mdi-printer" @click="reprinting" class="text-teal-darken-2">Reprinting</v-list-item>
          <v-list-item prepend-icon="mdi-web" @click="fetch_online" class="text-teal-darken-2">Online</v-list-item>
          <!-- <v-list-item prepend-icon="mdi-ocr" @click="ocr" class="text-teal-darken-2">OCR</v-list-item> -->
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-subheader class="ms-5" size="30">More</v-list-subheader>
          <v-list-item prepend-icon="mdi-help-circle-outline" class="text-teal-darken-2">Help</v-list-item>
          <v-list-item prepend-icon="mdi-information-outline" class="text-teal-darken-2">About</v-list-item>
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
    logo: require('@/assets/logo.png'),
    drawer: true,
    group: null,
  }),
  watch: {
    group() {
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
    },
    hideForbiddenPage() {
      return this.$route.name !== 'ForbiddenPage';
    },
    hideNotFoundPage() {
      return this.$route.name !== 'NotFound';
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
    async fetch_online() {
      try {
        this.$router.push('/fetch_online');
      } catch (error) {
        console.error('Error in accessing online page:', error);
      }
    },
    async ocr() {
      try {
        this.$router.push('/ocr');
      } catch (error) {
        console.error('Error in accessing OCR page:', error);
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

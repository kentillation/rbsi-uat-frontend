<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <h1>Reprinting</h1>
    <v-sheet class="d-flex flex-column align-center text-center mx-auto" elevation="4" height="180" width="50%"
      rounded>
      <div class="w-75 mt-10">
        <v-btn prepend-icon="mdi-book" class="bg-teal-darken-4 ms-2 mb-3" size="large" rounded>Reprint Passbook</v-btn>
        <v-btn prepend-icon="mdi-clipboard" class="bg-teal-darken-4 ms-2 mb-3" size="large" rounded>Reprint Signicature Card</v-btn>
      </div>
    </v-sheet>

  </v-container>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Reprinting',
  data() {
    return {
      
    };
  },
  computed: {

  },
  watch: {

  },

  methods: {

  },
};
</script>

<style scoped>
.to-hide {
  display: none;
}
</style>

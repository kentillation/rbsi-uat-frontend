<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <h1>Open New Contact</h1>
        <v-sheet elevation="3" rounded="lg">
            <v-tabs v-model="tab" :items="tabs" align-tabs="center" color="white" height="60" slider-color="#f78166">
                <template v-slot:tab="{ item }">
                    <v-tab :prepend-icon="item.icon" :text="item.text" :value="item.value" class="text-none"></v-tab>
                </template>

                <template v-slot:item="{ item }">
                    <v-tabs-window-item :value="item.value" class="pa-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est
                        labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque
                        porro libero rerum unde voluptatem!
                    </v-tabs-window-item>
                </template>
            </v-tabs>
        </v-sheet>
    </v-container>
</template>

<script>
// import apiClient from '../axios';

export default {
    name: 'NewContact',
    data: () => ({
        tab: 'tab-1',
        tabs: [
            {
                icon: 'mdi-information-outline',
                text: 'Contact Information',
                value: 'tab-1',
            },
            {
                icon: 'mdi-pin',
                text: 'Address',
                value: 'tab-2',
            },
            {
                icon: 'mdi-code-tags-check',
                text: 'Codes',
                value: 'tab-3',
            },
            {
                icon: 'mdi-contacts-outline',
                text: 'Related Contacts',
                value: 'tab-4',
            },
            {
                icon: 'mdi-map-legend',
                text: 'Extended Properties',
                value: 'tab-5',
            },
        ],
    }),

};
</script>

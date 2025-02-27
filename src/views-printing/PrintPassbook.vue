<template>
    <v-sheet>
        <div class="d-flex align-center flex-column">
            <h4>RURAL BANK OF SAGAY, INC.</h4>
            <p><em>National Highway, Poblacion II</em></p>
            <p><em>Sagay City 6122, NIR Philippines</em></p>
            <br>
            <h3><strong>Account No: {{ account_number }}</strong></h3>
            <h3><strong>Client ID: {{ CID }}</strong></h3>
            <p>{{ TitleCode }} {{ DisplayName }}</p>
            <p>{{ Line1 }}</p>
            <p>{{ Line2 }}</p>
            <p>{{ Line3 }}</p>
            <p>{{ Line4 }}</p>
            <br><br>
            <p>{{ dateToday }}</p>
        </div>
    </v-sheet>
</template>

<script>
export default {
    data() {
        return {
            account_number: this.$route.query.account_number || '',
            CID: this.$route.query.CID || '',
            TitleCode: this.$route.query.TitleCode || '',
            DisplayName: this.$route.query.DisplayName || '',
            Line1: this.$route.query.Line1 || '',
            Line2: this.$route.query.Line2 || '',
            Line3: this.$route.query.Line3 || '',
            Line4: this.$route.query.Line4 || '',
            dateToday: this.formatDate(this.$route.query.date),
        };
    },
    mounted() {
        document.body.classList.add('hide-app-bar');
        this.$nextTick(() => window.print());
    },
    unmounted() {
        document.body.classList.remove('hide-app-bar');
    },
    created() {
        window.print();
    },
    methods: {
        formatDate(dateStr) {
            const date = dateStr ? new Date(dateStr) : new Date();
            return new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Manila',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(date).toUpperCase();
        }
    },
};
</script>

<style>
.hide-app-bar .v-app-bar {
    display: none !important;
}
</style>

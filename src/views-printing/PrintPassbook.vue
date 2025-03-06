<template>
    <div class="d-flex flex-column" :style="{ marginLeft: '2cm' }">
        <div class="d-flex align-center">
            <img :src="logo" :style="{ width: '70px' }" alt="Logo">
            <div class="d-flex flex-column ms-2">
                <h4>RURAL BANK OF SAGAY, INC.</h4>
                <h5><em>National Highway, Poblacion II</em></h5>
                <h5 class="mb-2"><em>Sagay City 6122, NIR Philippines</em></h5>
            </div>
        </div>
        <h4><strong>Account No: {{ formatAcc(account_number) }}</strong></h4>
        <h4><strong>Client ID: {{ CID }}</strong></h4>
        <h4><strong>Passbook No: {{ passbookNumber }} </strong></h4>
        <h4><strong>Contact No: {{ Mobile1 }} </strong></h4>
        <h5>{{ Name1 }}, {{ Name2 }} {{ Name3 }} {{ Name4 }}</h5>
        <h5>{{ Line1 }}, Brgy. {{ Line2 }}, {{ Line3 }} City</h5>
    </div>
</template>

<script>
export default {
    data() {
        return {
            logo: require('@/assets/logo.png'),
            account_number: this.$route.query.account_number || '',
            CID: this.$route.query.CID || '',
            passbookNumber: this.$route.query.passbook_number || '',
            Name1: this.$route.query.Name1 || '',
            Name2: this.$route.query.Name2 || '',
            Name3: this.$route.query.Name3 || '',
            Name4: this.$route.query.Name4 || '',
            Mobile1: this.$route.query.Mobile1 || '',
            Line1: this.$route.query.Line1 || '',
            Line2: this.$route.query.Line2 || '',
            Line3: this.$route.query.Line3 || '',
        };
    },
    mounted() {
        document.body.classList.add('hide-app-bar');
        if (this.Name4 === 'none') {
            this.Name4 = '';
        }
        this.$nextTick(() => window.print());
    },
    unmounted() {
        document.body.classList.remove('hide-app-bar');
    },
    methods: {
        formatAcc(acc) {
            if (!acc) return acc;
            const accStr = String(acc);
            return accStr.replace(/^(\d{2})(\d{5})(\d{1})$/, "$1-$2-$3");
        },
    },
};
</script>

<style>
.hide-app-bar .v-app-bar {
    display: none !important;
}
</style>

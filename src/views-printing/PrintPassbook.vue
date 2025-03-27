<template>
    <div class="d-flex flex-column mt-0" :style="{ marginLeft: '3cm' }" v-if="isValidToken">
        <div class="d-flex align-center">
            <img :src="logo" :style="{ width: '70px' }" alt="Logo">
            <div class="d-flex flex-column ms-2">
                <h3>RURAL BANK OF SAGAY, INC.</h3>
                <h5><em>National Highway, Poblacion II (Brgy. 2)</em></h5>
                <h5 class="mb-2"><em>Sagay City, Negros Island Region, Philippines</em></h5>
            </div>
        </div>
        <p><strong>Account No: {{ formatAcc(acc) }}</strong></p>
        <p><strong>Client ID: {{ CID }}</strong></p>
        <h5>Passbook No: {{ passbookNumber }}</h5>
        <h5>Name: {{ Name1 }}, {{ Name2 }} {{ Name3 }} {{ Name4 }}</h5>
        <h5>Contact No: {{ Mobile1 }}</h5>
        <h5>Address: {{ Line1 }}, Brgy. {{ Line2 }}, {{ Line3 }} City</h5>
        <h5>Date Registered: {{ formatDateForPrint(new Date()) }}</h5>
        <p class="mt-1">__________________</p>

    </div>
</template>

<script>
export default {
    data() {
        return {
            logo: require('@/assets/logo.png'),
            acc: this.$route.query.acc || '',
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
            token: this.$route.query.token || '',
            isValidToken: false,
        };
    },
    mounted() {
        document.body.classList.add('hide-app-bar');
        if (this.Name4 === 'none') {
            this.Name4 = '';
        }
        this.validateToken();
        this.$nextTick(() => window.print());
    },
    unmounted() {
        document.body.classList.remove('hide-app-bar');
    },
    methods: {
        validateToken() {
            const decodedToken = decodeURIComponent(this.token);
            console.log("Decoded token:", decodedToken);
            if (decodedToken === 'valid-token') {
                this.isValidToken = true;
            } else {
                alert('Invalid or missing token. Redirecting to error page.');
                this.$router.push('/error');
            }
        },
        formatAcc(acc) {
            if (!acc) return acc;
            const accStr = String(acc);
            return accStr.replace(/^(\d{2})(\d{5})(\d{1})$/, "$1-$2-$3");
        },
        formatDateForPrint(date) {
            if (!date) return 'Invalid date';
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return 'Invalid date';
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
        }
    },
};
</script>

<style>
.hide-app-bar .v-app-bar {
    display: none !important;
}
p {
    margin: 0;
    font-size: 17px;
}
h5 {
    margin: 0;
    font-size: 14px;
}
@media print {
    body {
        margin: 0 !important;
    }
}
</style>

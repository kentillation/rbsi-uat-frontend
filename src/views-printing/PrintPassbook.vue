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
        <p><strong>Account No: {{ formattedAcc }}</strong></p>
        <p><strong>Client ID: {{ CID }}</strong></p>
        <h5>Passbook No: {{ passbookNumber }}</h5>
        <h5>Name: {{ Name1 }} {{ Name2 }} {{ Name3 }} {{ displayName4 }}</h5>
        <h5>Contact No: {{ Mobile1 }}</h5>
        <h5>Address: {{ Line1 }}, Brgy. {{ Line2 }}, {{ Line3 }} City</h5>
        <h5>Date Registered: {{ formattedDate }}</h5>
        <p class="mt-1">__________________</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            logo: require('@/assets/logo.png'),
            acc: '',
            CID: '',
            passbookNumber: '',
            Name1: '',
            Name2: '',
            Name3: '',
            Name4: '',
            Mobile1: '',
            Line1: '',
            Line2: '',
            Line3: '',
            token: '',
            isValidToken: false,
        };
    },
    created() {
        const { acc, CID, passbook_number, Name1, Name2, Name3, Name4, Mobile1, Line1, Line2, Line3, token } = this.$route.query;
        this.acc = acc || '';
        this.CID = CID || '';
        this.passbookNumber = passbook_number || '';
        this.Name1 = Name1 || '';
        this.Name2 = Name2 || '';
        this.Name3 = Name3 || '';
        this.Name4 = Name4 === 'none' ? '' : Name4 || '';
        this.Mobile1 = Mobile1 || '';
        this.Line1 = Line1 || '';
        this.Line2 = Line2 || '';
        this.Line3 = Line3 || '';
        this.token = token || '';
        this.validateToken();
    },
    mounted() {
        document.body.classList.add('hide-app-bar');
        // this.$nextTick(() => window.print());
    },
    unmounted() {
        document.body.classList.remove('hide-app-bar');
    },
    computed: {
        formattedAcc() {
            return this.acc ? String(this.acc).replace(/^(\d{2})(\d{5})(\d{1})$/, "$1-$2-$3") : '';
        },
        formattedDate() {
            const date = new Date();
            return isNaN(date.getTime()) ? 'Invalid date' : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
        },
        displayName4() {
            return this.Name4 ? ` ${this.Name4}` : '';
        }
    },
    methods: {
        validateToken() {
            let decodedToken = decodeURIComponent(this.token).trim();
            console.log("Raw token from URL:", this.token);
            console.log("Decoded token:", decodedToken);
            if (decodedToken.startsWith("Bearer ")) {
                this.isValidToken = true;
            } else {
                alert("Invalid or missing token. Redirecting to error page.");
                this.$router.push("/error");
            }
        }
    }

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

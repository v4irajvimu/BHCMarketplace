<template>
  <div>
    <div id="following-modal" class="custom-modal">
      <div class="modal-content following-content">
        <div class="modal-head">
          <h3>Following</h3>
          <span class="close-following-modal">&times;</span>
        </div>
        <div id="followingBody" class="modal-body">
          <div
            v-for="(item, index) in following"
            :key="index"
            class="row follower-list"
          >
            <div class="col-3 col-sm-3 col-md-3 col-lg-3">
              <a :href="asset_url + 'profile/' + item.wallet">
                <img :src="item.display_photo" alt="" />
              </a>
            </div>
            <div class="col-9 col-sm9 col-md-9 col-lg-9">
              <small>{{ item.bio }}</small>
              <a class="user_name" :href="asset_url + 'profile/' + item.wallet">
                {{ item.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["following", "asset_url"],
};
</script>
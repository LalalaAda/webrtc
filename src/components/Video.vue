<template>
  <v-card elevation="2">
    <video
      ref="video"
      :id="id"
      autoplay
      playsinline
      muted
      class="local-video"
      :style="{ display: `${minimize ? 'none' : ''}` }"
    />
    <div class="local-video-btn">
      <v-btn @click="onMiniMizeClick"></v-btn>
      <v-icon>mdi-card-off-outline</v-icon>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Video extends Vue {
  @Prop() private stream!: MediaStream;
  video!: HTMLVideoElement;
  id = "";
  minimize = false;

  onMiniMizeClick() {
    this.minimize = !this.minimize;
  }

  mounted() {
    console.log("video mounted!");
    console.log(this.stream);
    this.video = this.$refs.video as HTMLVideoElement;
    this.video.srcObject = this.stream;
  }
  destroyed() {
    this.video.srcObject = null;
  }
}
</script>

<style scoped lang="scss">
.local-video {
  position: relative;
  .local-video-btn {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: transparent;
  }
}
</style>

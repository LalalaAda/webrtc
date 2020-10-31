<template>
  <v-container>
    <header></header>
    <section>
      name: {{ user.name }} <br />
      room: {{ user.roomId }}
      <v-container flex v-if="videoStream">
        <Video :stream="videoStream" />
      </v-container>
    </section>
    <footer>百灵声学&copy;</footer>
  </v-container>
</template>

<script lang="ts">
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
import Client from "@/kulark-sdk-js/client";
import WebSocketIp from "@/websockip";
import Video from "@/components/Video.vue";
import { LocalStream } from '@/kulark-sdk-js/stream';

interface User {
  name: string;
  roomId: string;
}

@Component({
  components: {
    Video
  }
})
export default class Home extends Vue {
  user = this.$store.state.user;
  client!: Client;
  localAudioEnabled = false;
  localVideoEnabled = false;
  screenSharingEnabled = false;
  isFullScreen = false;

  videoStream = "";

  async _cleanUp() {
    // await this.conference.cleanUp();
    // await this.client.leave();
  }

  _notification(message?: string, description?: string) {
    // TODO  改为全局的底部右边pop？
    console.log(message);
    console.log(description);
  }

  _createClient() {
    const url = WebSocketIp;
    const client = new Client({ url: url });
    // client.url = url;
    return client;
  }

  async _handleJoin(u: User) {
    const client = this._createClient();

    window.onunload = async () => {
      await this._cleanUp();
    };

    client.on("peer-join", (id, info) => {
      console.log(`Peer join, peer => ${info.name}, join!`);
      // this._onSystemMessage(`${info.name}, join!`);
    });

    client.on("peer-leave", id => {
      console.log(`Peer leave, peer => ${id}, leave!`);
    });

    client.on("transport-open", () => {
      console.log("transport open!");
      this._handleTransportOpen(u);
    });

    client.on("transport-closed", () => {
      console.log("transport closed!");
    });

    client.on("stream-add", (id, info) => {
      console.log("stream-add %s,%s!", id, info);
    });

    client.on("stream-remove", stream => {
      console.log("stream-remove %s,%", stream.id);
      this._notification("Stream Remove", "id => " + stream.id);
    });

    client.on("broadcast", (mid, info) => {
      console.log("broadcast %s,%s!", mid, info);
      // TODO this._onMessageReceived(info);
    });

    this.client = client;
  }

  // TODO delete -------------------------
  async _handleAddStream(mid: string, info: string) {
    const client = this.client;
    const stream = await client.subscribe(mid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (stream as any).info = info;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.videoStream as any) = stream || "";
  }
  async handleLocalStream(enabled: boolean) {
    const client = this.client;
    let localStream;
    try {
      if (enabled) {
        localStream = await LocalStream.getUserMedia({
          codec: "VP8",
          resolution: "hd",
          // bandwidth: ,
          audio: true,
          video: true
        });
        await client.publish(localStream);
      } else {
        throw new Error("xxxx");
      }
      console.log("local stream", localStream.getTracks());
    } catch (e) {
      console.log("handleLocalStream error => " + e);
      // this._notification("publish/unpublish failed!", e);
    }
  }
  // -----------------------------
  async _handleLeave() {
    // TODO confirm
    this._cleanUp();
  }

  async _handleTransportOpen(values: User) {
    await this.client.join(values.roomId, { name: values.name });
    // TODO handleLocalStream
    // TODO DELETE-------------
    await this.handleLocalStream(true);
    // ----------------------
  }

  _handleAudioTrackEnabled(enabled: boolean) {
    this.localAudioEnabled = enabled;
    // TODO muteMediaTrack audio
  }

  _handleVideoTrackEnabled(enabled: boolean) {
    this.localVideoEnabled = enabled;
    // TODO muteMediaTrack video
  }

  _handleScreenSharing(enabled: boolean) {
    this.screenSharingEnabled = enabled;
    // TODO handleScreenSharing
  }

  _onFullScreenClickHandler() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docElm: any = document.documentElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = document;
    function fullscreenState() {
      return (
        (doc.fullscreenElement && doc.fullscreenElement !== null) ||
        (!doc.mozFullScreen && !doc.webkitIsFullScreen)
      );
    }
    if (fullscreenState()) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
      this.isFullScreen = false;
    } else {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
      this.isFullScreen = true;
    }
  }

  // TODO MediaSettingChanged
  // TODO MessageReceived
  // TODO SendMessage
  // TODO SystemDialog???

  // vue生命周期钩子
  created() {
    console.log("created");
  }
  mounted() {
    if (!this.user.roomId) {
      return this.$router.push({ path: "/join" });
    }
    this._handleJoin(this.user);
  }
}
</script>
<style lang="scss" scoped>
@import "../styles/app.scss";
</style>

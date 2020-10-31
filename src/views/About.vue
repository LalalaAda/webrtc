<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- <div class="test">
      <el-button type="primary" @click="testClientConnect">
        测试连接client
      </el-button>

      <el-row type="flex" class="test-box">
        <div v-for="step in steps" :key="step.title" class="test-item">
          <el-tooltip placement="top">
            <div slot="content">
              {{ `${step.title} ${step.status ? ": " + step.status : null}` }}
              <div v-if="step.info">{{ step.info }}</div>
            </div>
            <div class="svgico">
              <div v-html="step.icon" style="width:40px;height:40px;"></div>
            </div>
          </el-tooltip>
          <div class="badge">
            <i :class="step.iconClass" :style="{ color: step.color }"></i>
          </div>
        </div>
      </el-row>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Client from "@/kulark-sdk-js/client.ts";
import WebSocketIp from "@/websockip";
import BIZ from "../assets/images/test/biz.svg";
import ROOM from "../assets/images/test/room.svg";
import PUBLISH from "../assets/images/test/publish.svg";
import SUBSCRIPTION from "../assets/images/test/subscription.svg";

interface Icons {
  [x: string]: string;
}
const ICONS: Icons = {
  connected: "el-icon-check",
  ok: "el-icon-check",
  pending: "el-icon-loading",
  warning: "el-icon-close",
  "no candidates": "el-icon-close",
  error: "el-icon-loading",
  joined: "el-icon-check",
  published: "el-icon-check",
  subscribed: "el-icon-check"
};

interface Step {
  status: string;
  title: string;
  info?: string;
  icon?: string;
  color?: string;
  iconClass?: string;
}

interface TestStyle {
  Icon?: string;
  color?: string;
}

@Component
export default class About extends Vue {
  @Prop() private client!: Client;
  private testUpdateLoop!: number;

  private steps: Step[] = [
    {
      status: "pending",
      title: "Biz Websocket",
      info: "",
      icon: BIZ,
      color: "",
      iconClass: ""
    },
    {
      status: "pending",
      title: "Joining Test Room",
      info: "",
      icon: ROOM,
      color: "",
      iconClass: ""
    },
    {
      status: "pending",
      title: "Publish",
      info: "",
      icon: PUBLISH,
      color: "",
      iconClass: ""
    },
    {
      status: "pending",
      title: "Subscription",
      info: "",
      icon: SUBSCRIPTION,
      color: "",
      iconClass: ""
    }
  ];

  async cleanup() {
    if (this.testUpdateLoop) {
      clearInterval(this.testUpdateLoop);
    }
    if (this.client) {
      await this.client.leave();
    }
  }

  testClientConnect() {
    const url = WebSocketIp;
    //for dev by scripts
    // if(process.env.NODE_ENV == "development"){
    //   const proto = this._settings.isDevMode ? "ws" : "wss"
    //   url = proto + "://" + window.location.host;
    // }
    const client = new Client({ url: url });
    return client;
  }

  testStep({
    step,
    status,
    info = ""
  }: {
    step: string;
    status: string;
    info?: string;
  }) {
    const p = this.steps;
    p.forEach(item => {
      if (item.title === step) {
        item.status = status;
        item.info = info;
      }
    });
    this.steps = p;
  }

  connectionStep(step: Step) {
    const color =
      step.status === "pending"
        ? null
        : step.status === "warning" || step.status === "no candidates"
        ? "orange"
        : step.status === "error"
        ? "red"
        : "green";
  }
}
</script>

<style lang="scss" scoped>
.test {
  width: 100%;
  justify-content: center;
  align-items: center;
  .test-box {
    display: flex;
    justify-content: space-evenly;
    width: 360px;
    margin: 28px auto 0;
    border: 2px dashed;
    padding: 10px 0;
    .test-item {
      position: relative;
      .svgico {
        width: 50px;
        height: 50px;
        color: #fff;
        background-color: #ccc;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .badge {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 22px;
      }
    }
  }
}
</style>

<template>
  <div :class="{ root: true, sidebarClose }">
    <Header />
    <Sidebar />
    <div ref="content" class="content animated fadeInUp">
      <transition name="router-animation">
        <router-view />
      </transition>
    </div>
    <footer class="contentFooter">
      MHS Management Dashboard Demo - Made by
      <a href="https://koritsuki.com" target="_blank"
        >Koritsuki Entertainment</a
      >
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

import "./Layout.scss";

export default {
  name: "Layout",
  components: { Sidebar, Header },
  methods: {
    ...mapActions("layout", ["switchSidebar", "changeSidebarActive"]),
  },
  computed: {
    ...mapState("layout", {
      sidebarClose: (state) => state.sidebarClose,
    }),
  },
  created() {},
  mounted() {
    this.$refs.content.addEventListener("animationend", () => {
      this.$refs.content.classList.remove("animated");
      this.$refs.content.classList.remove("fadeInUp");
    });
  },
};
</script>

<style src="./Layout.scss" lang="scss" />

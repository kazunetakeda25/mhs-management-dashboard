<template>
  <b-navbar toggleable="md" class="app-header d-print-none">
    <b-navbar-nav class="ml-auto">
      <b-nav-item @click="logout">
        <i class="fi flaticon-power-1 px-2" />
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>

export default {
  name: "Header",
  components: {  },
  data() {
    return {
      name: "",
      alertCount: 0,
      showNavbarAlert: true,
    };
  },
  methods: {
    switchSidebarMethod() {
      if (!this.sidebarClose) {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      } else {
        this.switchSidebar(false);
        const paths = this.$route.fullPath.split("/");
        paths.pop();
        this.changeSidebarActive(paths.join("/"));
      }
    },
    logout() {
      window.localStorage.setItem("authenticated", false);
      this.$router.push("/login");
    },
  },
};
</script>

<style src="./Header.scss" lang="scss" />

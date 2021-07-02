<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  created() {
    if (window.localStorage.getItem("authenticated") != "true") {
      if (this.$route.path != "/login") {
        this.$router.push("/login").catch(() => {});
      }
    } else {
      if (this.$route.path != "/app/dashboard") {
        this.$router.push("/app/dashboard").catch(() => {});
      }
    }
  },
};
</script>

<style src="./styles/theme.scss" lang="scss" />

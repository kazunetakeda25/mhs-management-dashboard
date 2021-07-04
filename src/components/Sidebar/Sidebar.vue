<template>
  <b-collapse
    class="sidebar-collapse"
    id="sidebar-collapse"
    :visible="sidebarOpened"
  >
    <nav :class="{ sidebar: true }">
      <header class="logo">
        <router-link to="/app/dashboard"
          ><img class="header-logo" src="../../assets/MHS_Logo.png"
        /></router-link>
      </header>
      <ul class="nav">
        <h5 class="navTitle">MENU</h5>
        <NavLink
          :activeItem="activeItem"
          header="Dashboard"
          link="/app/dashboard"
          iconName="flaticon-grid"
          index="dashboard"
          isHeader
        />
      </ul>
    </nav>
  </b-collapse>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavLink from "./NavLink/NavLink";

export default {
  name: "Sidebar",
  components: { NavLink },
  data() {
    return {
      alerts: [
        {
          id: 0,
          title: "Today's Progress",
          value: 25,
          footer: "3 Items Completed... 25%",
          color: "primary",
        },
        {
          id: 1,
          title: "Monthly Report",
          value: 75,
          footer: "120 items completed...75%",
          color: "danger",
        },
      ],
    };
  },
  methods: {
    ...mapActions("layout", ["changeSidebarActive", "switchSidebar"]),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split("/");
      paths.pop();
      this.changeSidebarActive(paths.join("/"));
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState("layout", {
      sidebarOpened: (state) => !state.sidebarClose,
      activeItem: (state) => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>

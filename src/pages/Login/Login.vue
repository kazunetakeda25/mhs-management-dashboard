<template>
  <div class="auth-page">
    <b-container>
      <Widget
        class="widget-auth mx-auto"
        title="<br><h3 class='mt-0'>MHS Management Login</h3>"
        customHeader
      >
        <br />
        <p class="widget-auth-info">Use your email to sign in.</p>
        <form class="mt" @submit.prevent="login">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            {{ errorMessage }}
          </b-alert>
          <b-form-group label="Email" label-for="email">
            <b-input-group>
              <b-input-group-text slot="prepend"
                ><i class="la la-user text-white"></i
              ></b-input-group-text>
              <input
                id="email"
                ref="email"
                class="form-control input-transparent pl-3"
                type="email"
                required
                placeholder="Email"
              />
            </b-input-group>
          </b-form-group>
          <b-form-group label="Password" label-for="password">
            <b-input-group>
              <b-input-group-text slot="prepend"
                ><i class="la la-lock text-white"></i
              ></b-input-group-text>
              <input
                id="password"
                ref="password"
                class="form-control input-transparent pl-3"
                type="password"
                required
                placeholder="Password"
              />
            </b-input-group>
          </b-form-group>
          <div class="bg-widget auth-widget-footer pt-2">
            <b-button type="submit" variant="danger" class="auth-btn" size="sm">
              Login
            </b-button>
            <p class="widget-auth-info mt-4">
              Don't have an account? Sign up now!
            </p>
            <router-link class="d-block text-center mb-4" to="login"
              >Create an Account</router-link
            >
            <div class="social-buttons">
              <b-button variant="primary" class="social-button">
                <i class="social-icon social-google"></i>
                <p class="social-text">GOOGLE</p>
              </b-button>
              <b-button variant="success" class="social-button">
                <i class="social-icon social-microsoft"></i>
                <p class="social-text">MICROSOFT</p>
              </b-button>
            </div>
          </div>
        </form>
      </Widget>
    </b-container>
    <footer class="auth-footer">
      MHS Management Dashboard Demo - Made by
      <a href="https://koritsuki.com" target="_blank"
        >Koritsuki Entertainment</a
      >
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";

export default {
  name: "LoginPage",
  components: { Widget },
  data() {
    return {
      errorMessage: null,
    };
  },
  methods: {
    login() {
      const email = this.$refs.email.value;
      const password = this.$refs.password.value;

      if (email.length !== 0 && password.length !== 0) {
        Vue.axios
          .post(
            "http://localhost:3000/api/auth/login",
            {
              email: email,
              password: password,
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          )
          .then((response) => {
            window.localStorage.setItem("userid", response.data.data.userid);
            window.localStorage.setItem("name", response.data.data.name);
            window.localStorage.setItem(
              "username",
              response.data.data.username
            );
            window.localStorage.setItem("email", response.data.data.email);
            window.localStorage.setItem("role", response.data.data.role);
            window.localStorage.setItem(
              "stationname",
              response.data.data.stationname
            );
            window.localStorage.setItem("authenticated", true);
            if (this.$route.path != "/app/dashboard") {
              this.$router.push("/app/dashboard").catch(() => {});
            }
          });
      }
    },
  },
  created() {
    if (window.localStorage.getItem("authenticated") === "true") {
      if (this.$route.path != "/app/dashboard") {
        this.$router.push("/app/dashboard").catch(() => {});
      }
    }
  },
};
</script>

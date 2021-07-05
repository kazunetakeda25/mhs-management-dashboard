<template>
  <div class="error-page">
    <b-container>
      <div class="errorContainer mx-auto">
        <h1 class="errorCode">404</h1>
        <p class="errorInfo">
            Oops, it seems this page does not exist.
        </p>
        <p class="errorHelp mb-3">
            If you are sure there must be a page, search for it.
        </p>
        <b-form>
          <b-form-group>
            <b-form-input class="input-transparent" size="lg" type="text" placeholder="Search Pages" />
          </b-form-group>
          <router-link tag="a" to="/app/dashboard">
            <b-button class="errorBtn" type="submit" variant="inverse">
                Search <i class="fa fa-search ml-xs" />
            </b-button>
          </router-link>
        </b-form>
      </div>
      <footer class="pageFooter">
        MHS Management Dashboard Demo- Made by <a href="https://koristuki.com" target="_blank">Koritsuki Entertainment</a>
      </footer>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
};
</script>

<style src="./Error.scss" lang="scss" scoped />

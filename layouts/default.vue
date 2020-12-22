<template>
  <section class="page">
    <div class="is-full container">
      <b-navbar centered class="nav py-4 is-full">
        <template slot="brand">
          <img
            src="~assets/logo.png"
            alt="Logo"
            class="image"
            width="261"
            height="52"
          />
        </template>
        <template slot="start">
          <b-navbar-item v-if="$route.path !== '/'" tag="div">
            <NuxtLink
              to="/"
              tag="div"
              class="is-link is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="home" />
              <span class="ml-1 is-size-6 has-text-weight-semibold"
                >Главная</span
              >
            </NuxtLink>
          </b-navbar-item>
          <b-navbar-item tag="div">
            <NuxtLink
              to="/about"
              tag="div"
              class="is-link is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="info-circle" />
              <span class="ml-1 is-size-6 has-text-weight-semibold">О нас</span>
            </NuxtLink>
          </b-navbar-item>
          <b-navbar-item tag="div">
            <NuxtLink
              to="/contactus"
              tag="div"
              class="is-link is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="envelope" />
              <span class="ml-1 is-size-6 has-text-weight-semibold"
                >Написать нам</span
              >
            </NuxtLink>
          </b-navbar-item>
        </template>
        <template slot="end">
          <b-navbar-dropdown
            v-if="auth.loggedIn"
            :boxed="true"
            :label="auth.user"
          >
            <b-navbar-item href="/mypage"> Моя страница </b-navbar-item>
            <b-navbar-item @click="logout"> Выход </b-navbar-item>
          </b-navbar-dropdown>
          <b-navbar-item v-else tag="div">
            <div class="buttons">
              <NuxtLink to="/login" class="button is-info"
                ><strong>Войти</strong></NuxtLink
              >
              <NuxtLink to="/register" class="button is-info is-light"
                >Зарегистрироваться</NuxtLink
              >
            </div>
          </b-navbar-item>
        </template>
      </b-navbar>
      <main class="is-full is-flex-grow-1 is-flex-shrink-1">
        <Nuxt />
      </main>
    </div>
    <footer class="footer mt-4 is-full">
      <div class="container">
        <div
          class="is-relative is-flex is-justify-content-space-between is-align-items-center"
        >
          <h4 class="title is-5">craft-rp.ru</h4>
          <div
            class="is-flex is-flex-direction-column is-justify-content-center is-align-items-flex-start"
          >
            <NuxtLink
              v-if="$route.path !== '/'"
              to="/"
              tag="div"
              class="is-link is-flex is-align-items-center"
            >
              <b-icon icon="home" />
              <span class="ml-1 is-size-6 has-text-weight-semibold"
                >Главная</span
              >
            </NuxtLink>
            <NuxtLink
              to="/about"
              tag="div"
              class="mt-2 mb-2 is-link is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="info-circle" />
              <span class="ml-1 is-size-6 has-text-weight-semibold">О нас</span>
            </NuxtLink>
            <NuxtLink
              to="/contactus"
              tag="div"
              class="is-link is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="envelope" />
              <span class="ml-1 is-size-6 has-text-weight-semibold"
                >Написать нам</span
              >
            </NuxtLink>
          </div>
        </div>
        <div
          class="footer-date is-size-7 has-text-weight-bold has-text-centered"
        >
          &#169;{{ new Date().getFullYear() }}
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
export default {
  computed: {
    auth() {
      return this.$store.getters.auth
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
    },
  },
}
</script>

<style>
.page {
  display: flex;
  flex-direction: column;
}
.nav {
  min-height: 90px;
  max-height: 90px;
  height: 100%;
}
.footer-date {
  position: absolute;
  bottom: 0;
}
.is-relative {
  position: relative;
}
div.nuxt-link-exact-active {
  text-decoration: underline;
}
footer {
  background-color: #d8e0e5 !important;
}
</style>

<template>
  <section class="page is-flex is-flex-direction-column is-align-items-center">
    <b-navbar centered class="container is-full nav py-4">
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
          <NuxtLink to="/" tag="div" class="is-flex is-align-items-center">
            <b-icon pack="fas" icon="home" />
            <div class="ml-1 is-link is-size-6 has-text-weight-semibold">
              Главная
            </div>
          </NuxtLink>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <NuxtLink to="/about" tag="div" class="is-flex is-align-items-center">
            <b-icon pack="fas" icon="info-circle" />
            <div class="ml-1 is-link is-size-6 has-text-weight-semibold">
              О нас
            </div>
          </NuxtLink>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <NuxtLink
            to="/contactus"
            tag="div"
            class="is-flex is-align-items-center"
          >
            <b-icon pack="fas" icon="envelope" />
            <div class="ml-1 is-link is-size-6 has-text-weight-semibold">
              Написать нам
            </div>
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
              ><div class="has-text-weight-bold">Войти</div></NuxtLink
            >
            <NuxtLink to="/register" class="button is-info is-light"
              >Зарегистрироваться</NuxtLink
            >
          </div>
        </b-navbar-item> </template
      >sss
    </b-navbar>
    <main class="is-full container is-flex-grow-1 is-flex-shrink-1">
      <Nuxt />
    </main>
    <footer class="footer mt-4 is-full">
      <div class="container">
        <div
          class="is-relative is-flex is-justify-content-space-between is-align-items-center"
        >
          <h3 class="title is-5">craft-rp.ru</h3>
          <div
            class="is-flex is-flex-direction-column is-justify-content-center is-align-items-flex-start"
          >
            <NuxtLink
              v-if="$route.path !== '/'"
              to="/"
              tag="div"
              class="is-flex is-align-items-center"
            >
              <b-icon icon="home" />
              <div class="ml-1 is-link is-size-6 has-text-weight-semibold">
                Главная
              </div>
            </NuxtLink>
            <NuxtLink
              to="/about"
              tag="div"
              class="mt-2 mb-2 is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="info-circle" />
              <div class="ml-1 is-link is-size-6 has-text-weight-semibold">
                О нас
              </div>
            </NuxtLink>
            <NuxtLink
              to="/contactus"
              tag="div"
              class="is-flex is-align-items-center"
            >
              <b-icon pack="fas" icon="envelope" />
              <div class="ml-1 is-link is-size-6 has-text-weight-semibold">
                Написать нам
              </div>
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
footer {
  background-color: #d8e0e5 !important;
}
.footer-date {
  position: absolute;
  bottom: 0;
}
.is-relative {
  position: relative;
}
</style>

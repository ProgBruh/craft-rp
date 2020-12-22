<template>
  <section
    v-if="loggedIn"
    class="page container pb-2 is-flex is-flex-direction-column is-justify-content-flex-start"
  >
    <b-navbar centered class="nav py-4">
      <template slot="brand">
        <b-navbar-item href="/">
          <img
            src="~assets/admin_logo.png"
            alt="Logo"
            width="181"
            height="48"
          />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item
          :class="{ active: current === 'posts' }"
          @click="current = 'posts'"
        >
          <div class="is-flex is-align-items-center">
            <b-icon pack="fas" icon="list-alt" />
            <span class="ml-2 is-size-5 has-text-weight-semibold">Посты</span>
          </div>
        </b-navbar-item>
        <b-navbar-item
          :class="{ active: current === 'users' }"
          @click="current = 'users'"
        >
          <div class="is-flex is-align-items-center">
            <b-icon pack="fas" icon="users" />
            <span class="ml-2 is-size-5 has-text-weight-semibold"
              >Пользователи</span
            >
          </div>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item>
          <b-button
            icon-left="exit-to-app"
            type="is-primary is-light"
            @click="logout"
            >Выход</b-button
          >
        </b-navbar-item>
      </template>
    </b-navbar>
    <component :is="currentComponent" />
  </section>
  <section
    v-else
    class="page is-flex is-justify-content-center is-align-items-center"
  >
    <div class="box form">
      <h4 class="title is-4 has-text-centered">Панель администратора</h4>
      <form @submit.prevent="login">
        <b-field
          label="Адрес электронной почты"
          :type="
            $v.loginData.email.$dirty
              ? $v.loginData.email.$error
                ? 'is-danger'
                : 'is-success'
              : ''
          "
          :message="
            $v.loginData.email.$dirty
              ? $v.loginData.email.$error
                ? 'Недопустимое значение'
                : ''
              : ''
          "
        >
          <b-input v-model="loginData.email" expanded />
        </b-field>
        <b-field
          label="Пароль"
          :type="
            $v.loginData.password.$dirty
              ? $v.loginData.password.$error
                ? 'is-danger'
                : 'is-success'
              : ''
          "
          :message="
            $v.loginData.password.$dirty
              ? $v.loginData.password.$error
                ? 'Недопустимое значение'
                : ''
              : ''
          "
        >
          <b-input
            v-model="loginData.password"
            type="password"
            expanded
            password-reveal
          />
        </b-field>
        <div class="is-flex is-justify-content-space-between">
          <b-field>
            <b-button type="is-info" native-type="submit">Войти</b-button>
          </b-field>
          <NuxtLink
            to="/"
            tag="div"
            class="is-link is-flex is-align-items-center"
          >
            <b-icon pack="fas" icon="home" size="is-small" />
            <span class="ml-1 has-text-weight-light is-size-6">На главную</span>
          </NuxtLink>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import PostsContainer from '~/components/admin/posts_container.vue'
import UsersContainer from '~/components/admin/users_container.vue'
const { required, email } = require('vuelidate/lib/validators')

export default {
  layout: 'empty',
  components: {
    PostsContainer,
    UsersContainer,
  },
  data() {
    return {
      current: 'posts',
      loginData: {
        email: null,
        password: null,
      },
    }
  },
  validations: {
    loginData: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  computed: {
    currentComponent() {
      if (this.current === 'posts') {
        return 'PostsContainer'
      } else {
        return 'UsersContainer'
      }
    },
    loggedIn() {
      return this.$store.getters.authAdmin.loggedIn
    },
  },
  methods: {
    async login() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          await this.$store.dispatch('loginAdmin', this.loginData)
          this.loginData = { email: null, password: null }
          this.$v.$reset()
        } catch (e) {
          this.$buefy.snackbar.open({
            message: e.response ? e.response.data : 'Authentication failed',
            type: 'is-danger',
            position: 'is-bottom-right',
          })
        }
      }
    },
    async logout() {
      await this.$store.dispatch('logoutAdmin')
    },
  },
}
</script>

<style lang="css" scoped>
.nav {
  min-height: 90px;
  max-height: 90px;
  height: 100%;
}
.active {
  color: #7957d5;
  text-decoration: underline;
}
</style>

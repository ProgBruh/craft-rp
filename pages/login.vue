<template>
  <section class="page is-flex is-justify-content-center is-align-items-center">
    <div class="is-flex is-flex-direction-column is-align-items-center">
      <div class="box form">
        <form @submit.prevent="login">
          <h4 class="title is-4 has-text-centered">Вход</h4>
          <b-field
            label="Адрес электронной почты"
            :type="
              $v.formData.email.$dirty
                ? $v.formData.email.$error
                  ? 'is-danger'
                  : 'is-success'
                : ''
            "
            :message="
              $v.formData.email.$dirty
                ? $v.formData.email.$error
                  ? 'Недопустимое значение'
                  : ''
                : ''
            "
          >
            <b-input v-model="formData.email" type="text" />
          </b-field>
          <b-field
            label="Пароль"
            :type="
              $v.formData.password.$dirty
                ? $v.formData.password.$error
                  ? 'is-danger'
                  : 'is-success'
                : ''
            "
            :message="
              $v.formData.password.$dirty
                ? $v.formData.password.$error
                  ? 'Недопустимое значение'
                  : ''
                : ''
            "
          >
            <b-input
              v-model="formData.password"
              type="password"
              password-reveal
            />
          </b-field>
          <b-field expanded>
            <div class="is-flex is-justify-content-flex-end">
              <b-button native-type="submit" type="is-info">Готово</b-button>
            </div>
          </b-field>
        </form>
      </div>
      <div class="is-flex is-justify-content-space-around is-full">
        <NuxtLink
          to="/register"
          tag="div"
          class="is-link is-flex is-align-items-center"
        >
          <b-icon pack="fas" icon="user-plus"></b-icon>
          <span class="ml-2 has-text-weight-normal is-size-5">Регистрация</span>
        </NuxtLink>
        <NuxtLink
          to="/"
          tag="div"
          class="is-link is-flex is-align-items-center"
        >
          <b-icon pack="fas" icon="home"></b-icon>
          <span class="ml-2 has-text-weight-normal is-size-5">На главную</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
const { required, email } = require('vuelidate/lib/validators')

export default {
  layout: 'empty',
  asyncData({ store, redirect }) {
    if (store.getters.auth.loggedIn) {
      return redirect('/')
    }
    return {
      formData: {
        email: null,
        password: null,
      },
    }
  },
  validations: {
    formData: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    async login() {
      if (!this.$v.$invalid) {
        try {
          const userData = new FormData()
          userData.append('email', this.formData.email)
          userData.append('password', this.formData.password)
          await this.$store.dispatch('login', userData)
          this.$router.push({ path: '/' })
        } catch (e) {
          this.$buefy.snackbar.open({
            message: e.response ? e.response.data : 'Ошибка входа',
            type: 'is-danger',
            position: 'is-bottom-right',
          })
        }
      } else {
        this.$v.$touch()
      }
    },
  },
}
</script>

<style lang="css" scoped>
.login-form {
  min-width: 470px;
}
</style>

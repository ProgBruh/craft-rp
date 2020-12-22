<template>
  <section class="page is-flex is-justify-content-center is-align-items-center">
    <div class="is-flex is-flex-direction-column is-align-items-center">
      <div class="box form">
        <form @submit.prevent="register">
          <h4 class="title is-4 has-text-centered">Регистрация</h4>
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
            label="Имя пользователя"
            :type="
              $v.formData.username.$dirty
                ? $v.formData.username.$error
                  ? 'is-danger'
                  : 'is-success'
                : ''
            "
            :message="
              $v.formData.username.$dirty
                ? $v.formData.username.$error
                  ? 'Недопустимое значение'
                  : ''
                : ''
            "
          >
            <b-input v-model="formData.username" type="text" />
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
              ref="password"
              v-model="formData.password"
              type="password"
              icon-pack="fas"
              icon="plus-circle"
              icon-clickable
              password-reveal
              @icon-click="generatePassword"
            />
          </b-field>
          <b-field
            label="Повторите пароль"
            :type="
              $v.formData.passwordConfirm.$dirty
                ? $v.formData.passwordConfirm.$error
                  ? 'is-danger'
                  : 'is-success'
                : ''
            "
            :message="
              $v.formData.passwordConfirm.$dirty
                ? $v.formData.passwordConfirm.$error
                  ? 'Недопустимое значение'
                  : ''
                : ''
            "
          >
            <b-input
              ref="passwordConfirm"
              v-model="formData.passwordConfirm"
              type="password"
              icon-pack="fas"
              icon="plus-circle"
              icon-clickable
              password-reveal
              @icon-click="generatePassword"
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
          to="/login"
          tag="div"
          class="is-link is-flex is-align-items-center"
        >
          <b-icon pack="fas" icon="sign-in-alt" />
          <span class="ml-2 has-text-weight-normal is-size-5">Войти</span>
        </NuxtLink>
        <NuxtLink
          to="/"
          tag="div"
          class="is-link is-flex is-align-items-center"
        >
          <b-icon pack="fas" icon="home" />
          <span class="ml-2 has-text-weight-normal is-size-5">На главную</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
const {
  required,
  email,
  minLength,
  helpers,
  sameAs,
} = require('vuelidate/lib/validators')
const RandExp = require('randexp')

export default {
  layout: 'empty',
  asyncData({ store, redirect }) {
    if (store.getters.auth.loggedIn) {
      return redirect('/')
    }
    return {
      formData: {
        email: null,
        username: null,
        password: null,
        passwordConfirm: null,
      },
    }
  },
  validations: {
    formData: {
      email: {
        required,
        email,
      },
      username: {
        required,
        minLength: minLength(4),
      },
      password: {
        required,
        valid: helpers.regex(
          'alpha',
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+№;:?=]).{8,}$/
        ),
      },
      passwordConfirm: {
        required,
        valid: sameAs('password'),
      },
    },
  },
  methods: {
    async register() {
      if (!this.$v.$invalid) {
        try {
          const userData = new FormData()
          userData.append('email', this.formData.email)
          userData.append('username', this.formData.username)
          userData.append('password', this.formData.password)
          await this.$axios.$post('/api/register', userData)
          this.$router.push({ path: '/login' })
        } catch (e) {
          this.$buefy.snackbar.open({
            message: e.response ? e.response.data : 'Ошибка регистрации',
            type: 'is-danger',
            position: 'is-bottom-right',
          })
        }
      } else {
        this.$v.$touch()
      }
    },
    generatePassword() {
      const password = new RandExp(
        '^[a-z][A-Z][0-9][!@#$%^&*()_+№;:?=][a-zA-Z0-9!@#$%^&*()_+№;:?=]{4}$'
      ).gen()
      this.formData.password = password
      this.formData.passwordConfirm = password
      this.$refs.password.isPasswordVisible = true
      this.$refs.password.newType = 'text'
      this.$refs.passwordConfirm.isPasswordVisible = true
      this.$refs.passwordConfirm.newType = 'text'
    },
  },
}
</script>

<style lang="css" scoped>
.register-form {
  min-width: 470px;
}
</style>

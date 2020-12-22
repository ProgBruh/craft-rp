<template>
  <div class="is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1">
    <div
      class="mb-2 is-flex is-justify-content-space-between is-align-items-center"
    >
      <h3 class="title is-3 my-4">Список пользователей</h3>
      <b-field>
        <b-input
          v-model.trim="userData"
          icon-pack="fas"
          icon="search"
          placeholder="Имя или email пользователя"
          class="search"
          @keyup.native="searchUsers"
        />
      </b-field>
    </div>
    <div
      class="box is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1"
    >
      <div v-if="loading" class="is-full is-fullheight loading-container">
        <b-loading v-model="loading" :is-full-page="false" />
      </div>
      <div v-else>
        <b-table
          v-if="usersData && usersData.length"
          :data="usersData"
          :paginated="true"
          :backend-pagination="true"
          :current-page="parseInt(currentPage)"
          :total="parseInt(totalPages)"
          :hoverable="true"
          :striped="true"
          pagination-size="is-small"
          aria-next-label="Следующая страница"
          aria-previous-label="Предыдущая страница"
          aria-page-label="Страница"
          aria-current-label="Текущая страница"
          @page-change="getUsers"
        >
          <b-table-column v-slot="props" field="id" label="ID" :centered="true">
            <span class="has-text-weight-semibold is-size-6">{{
              props.row.id
            }}</span>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="email"
            label="Электронная почта"
            :centered="true"
          >
            <span class="has-text-weight-normal is-size-6">{{
              props.row.email
            }}</span>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="username"
            label="Имя"
            :centered="true"
          >
            <span class="has-text-weight-normal is-size-6">{{
              props.row.username
            }}</span>
          </b-table-column>
          <b-table-column v-slot="props" label="Аватар" :centered="true">
            <div class="is-flex is-justify-content-center">
              <img
                :src="`https://avatars.dicebear.com/api/gridy/${props.row.username}.svg`"
                alt="User image"
                class="image is-64x64"
              />
            </div>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="created_at"
            label="Дата регистрации"
            :centered="true"
          >
            <span class="has-text-weight-normal is-size-6">{{
              new Date(props.row.created_at).toLocaleDateString()
            }}</span>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="is_banned"
            label="Состояние блокировки"
            :centered="true"
          >
            <b-checkbox
              :value="props.row.is_blocked"
              type="is-danger"
              @input="blockUser(props.row.id)"
            >
              {{ props.row.is_blocked ? 'Заблокирован' : 'Не заблокирован' }}
            </b-checkbox>
          </b-table-column>
        </b-table>
        <div
          v-else
          class="is-size-4 has-text-weight-semibold has-text-centered"
        >
          Нет данных
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersContainer',
  data() {
    return {
      currentPage: 1,
      totalPages: null,
      loading: true,
      userData: '',
      usersData: null,
      changedFilter: false,
      timer: null,
    }
  },
  watch: {
    userData(value) {
      if (!value.length) {
        this.changedFilter = true
        this.getUsers()
      }
    },
  },
  async mounted() {
    try {
      this.changedFilter = true
      this.getUsers()
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await this.$store.dispatch('logoutAdmin')
      } else {
        this.$buefy.snackbar.open({
          message: 'Возникла ошибка',
          type: 'is-danger',
          position: 'is-bottom-right',
        })
      }
    }
  },
  methods: {
    async getUsers(page = 1) {
      try {
        this.loading = true
        let usersData
        if (this.userData.length) {
          usersData = await this.$axios.$get(
            `/api/admin/search_users/${this.userData}/${page}`,
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
        } else {
          usersData = await this.$axios.$get(`/api/admin/get_users/${page}`, {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          })
        }
        this.usersData = usersData.data
        this.currentPage = usersData.pagination.currentPage
        if (this.changedFilter) {
          this.totalPages = usersData.pagination.lastPage || 1
          this.changedFilter = false
        }
        this.loading = false
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
        } else {
          this.$buefy.snackbar.open({
            message: 'Возникла ошибка',
            type: 'is-danger',
            position: 'is-bottom-right',
          })
        }
      }
    },
    searchUsers() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.userData.length) {
          this.changedFilter = true
          this.getUsers()
        }
      }, 800)
    },
    async blockUser(id) {
      try {
        await this.$axios.$post(
          '/api/admin/block_user',
          { id },
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        const index = this.usersData.indexOf(
          this.usersData.filter((el) => el.id === id)[0]
        )
        this.usersData[index].is_blocked = !this.usersData[index].is_blocked
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
        } else {
          this.$buefy.snackbar.open({
            message: 'Возникла ошибка',
            type: 'is-danger',
            position: 'is-bottom-right',
          })
        }
      }
    },
  },
}
</script>

<style lang="css" scoped>
.search {
  min-width: 400px;
}
</style>

<template>
  <div class="is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1">
    <div
      class="mb-2 is-flex is-justify-content-space-between is-align-items-center"
    >
      <h3 class="title is-3 my-4">Список пользователей</h3>
      <b-field>
        <b-input
          v-model.trim="userData"
          icon="magnify"
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
          v-if="usersTableData && usersTableData.length"
          :data="usersTableData"
          :paginated="true"
          :per-page="15"
          :current-page.sync="currentPage"
          :hoverable="true"
          :striped="true"
          pagination-size="is-small"
          aria-next-label="Следующая страница"
          aria-previous-label="Предыдущая страница"
          aria-page-label="Страница"
          aria-current-label="Текущая страница"
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
      loading: true,
      userData: null,
      searchUsersData: null,
      usersData: null,
      timer: null,
    }
  },
  computed: {
    usersTableData() {
      return this.searchUsersData && this.searchUsersData.length
        ? this.searchUsersData
        : this.usersData
    },
  },
  async mounted() {
    try {
      this.usersData = await this.$axios.$get(
        `/api/admin/get_users/${this.currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
          },
        }
      )
      this.loading = false
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await this.$store.dispatch('logoutAdmin')
      }
    }
  },
  methods: {
    searchUsers() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.userData.length) {
          try {
            this.searchUsersData = await this.$axios.$get(
              `/api/admin/search_users/${this.userData}`,
              {
                headers: {
                  Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
                },
              }
            )
          } catch (e) {
            if (e.response && e.response.status === 401) {
              await this.$store.dispatch('logoutAdmin')
            }
          }
        }
      }, 800)
    },
    async blockUser(id) {
      try {
        const blockUser = await this.$axios.$post(
          '/api/admin/block_user',
          { id },
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        this.usersData[
          this.usersData.indexOf(this.usersData.filter((el) => el.id === id)[0])
        ].is_blocked = blockUser
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
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

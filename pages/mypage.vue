<template>
  <div class="mt-5">
    <div v-if="loading" class="is-full is-fullheight loading-container">
      <b-loading v-model="loading" :is-full-page="false" />
    </div>
    <div v-else class="columns">
      <div class="column is-4">
        <h4 class="title is-4">Информация о пользователе</h4>
        <div v-if="userInfo" class="content">
          <div class="is-size-5 has-text-weight-semibold">
            Адрес электронной почты:
          </div>
          <div class="is-size-5 has-text-weight-light">
            {{ userInfo.email }}
          </div>
          <br />
          <div class="is-size-5 has-text-weight-semibold">Имя:</div>
          <div class="is-size-5 has-text-weight-light">
            {{ userInfo.username }}
          </div>
          <br />
          <div class="is-size-5 has-text-weight-semibold">
            Дата регистрации:
          </div>
          <div class="is-size-5 has-text-weight-light">
            {{ new Date(userInfo.created_at).toLocaleDateString() }}
          </div>
          <br />
          <div class="is-size-5 has-text-weight-semibold">
            Состояние блокировки:
          </div>
          <div
            class="is-size-5 has-text-weight-light"
            :class="{
              'has-text-danger': userInfo.is_blocked,
              'has-text-success': !userInfo.is_blocked,
            }"
          >
            {{ userInfo.is_blocked ? 'Заблокирован' : 'Не заблокирован' }}
          </div>
          <br />
          <div class="is-size-5 has-text-weight-semibold">Аватар:</div>
          <img
            :src="`https://avatars.dicebear.com/api/gridy/${userInfo.username}.svg`"
            alt="User avatar"
            class="image is-96x96"
          />
        </div>
        <div v-else class="is-size-4 has-text-centered has-text-weight-bold">
          Нет данных
        </div>
      </div>
      <div class="column is-8">
        <h4 class="title is-4">Избранные посты</h4>
        <div v-if="votedPosts && votedPosts.length">
          <div class="columns is-multiline">
            <Post
              v-for="(post, index) of votedPosts"
              :id="post.id"
              :key="index"
              :is-popular="true"
              :src="post.preview_image"
              :title="post.title"
              :description="post.description"
              :votes="parseInt(post.votes)"
              :commentaries="parseInt(post.commentaries)"
              :created-at="new Date(post.created_at).toLocaleDateString()"
            />
          </div>
          <b-pagination
            v-if="totalPages && totalPages > 1"
            :current="parseInt(currentPage)"
            :total="parseInt(totalPages)"
            order="is-right"
            aria-next-label="Следующая страница"
            aria-previous-label="Предыдущая страница"
            aria-page-label="Страница"
            aria-current-label="Текущая страница"
            class="is-full"
            @change="getPosts"
          />
        </div>
        <div v-else class="is-size-4 has-text-centered has-text-weight-bold">
          Посты не найдены
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  async asyncData({ $axios, $cookiz, redirect }) {
    if ($cookiz.get('auth') && $cookiz.get('auth').loggedIn) {
      let userInfo, votedPosts
      try {
        userInfo = await $axios.$get('/api/get_user_info', {
          headers: {
            Authorization: `Bearer ${$cookiz.get('auth').token}`,
          },
        })
        votedPosts = await $axios.$get(`/api/get_user_voted_posts`, {
          headers: {
            Authorization: `Bearer ${$cookiz.get('auth').token}`,
          },
        })
      } catch {}
      return {
        userInfo: userInfo || null,
        votedPosts: votedPosts && votedPosts.data ? votedPosts.data : null,
        currentPage:
          votedPosts && votedPosts.pagination
            ? votedPosts.pagination.currentPage
            : 1,
        totalPages:
          votedPosts && votedPosts.pagination
            ? votedPosts.pagination.lastPage
            : 1,
        loading: false,
      }
    } else {
      return redirect('/login')
    }
  },
  methods: {
    async getPosts(page = 1) {
      try {
        this.loading = true
        const votedPosts = await this.$axios.$get(`/api/get_user_voted_posts`, {
          headers: {
            Authorization: `Bearer ${this.$cookiz.get('auth').token}`,
          },
        })
        this.votedPosts = votedPosts.data
        this.currentPage = votedPosts.pagination.currentPage
        this.totalPages = votedPosts.pagination.lastPage || this.totalPages
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
  },
}
</script>

<style lang="css" scoped></style>

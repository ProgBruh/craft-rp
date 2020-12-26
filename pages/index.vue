<template>
  <div>
    <div class="hero is-medium is-dark">
      <div class="hero-body hero-image image is-3by1">
        <div class="container">
          <h1 class="title">Лучшие ресурспаки</h1>
          <h2 class="subtitle">На каждый день</h2>
        </div>
      </div>
    </div>
    <div v-if="recommendedPosts && recommendedPosts.length">
      <h3 class="title is-4 mt-4">Выбор администрации</h3>
      <div class="columns">
        <Post
          v-for="(post, index) of recommendedPosts"
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
    </div>
    <hr />
    <div class="columns is-centered is-multiline">
      <div class="column is-4">
        <div class="panel settings">
          <p class="panel-heading">Параметры постов</p>
          <div class="p-4">
            <div class="block">
              <b-field expanded>
                <b-input
                  v-model="filterData.title"
                  placeholder="Название"
                  @keyup.native="searchPosts"
                />
              </b-field>
            </div>
            <div class="block">
              <b-field expanded>
                <b-select
                  v-model="filterData.resolution"
                  placeholder="Разрешение"
                  :disabled="!resolutions || !resolutions.length"
                  expanded
                >
                  <option :value="null">Не выбрано</option>
                  <option
                    v-for="(resolution, index) of resolutions"
                    :key="index"
                    :value="resolution.id"
                  >
                    {{ resolution.value }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="block">
              <b-field expanded>
                <b-select
                  v-model="filterData.version"
                  placeholder="Версия"
                  :disabled="!versions || !versions.length"
                  expanded
                >
                  <option :value="null">Не выбрано</option>
                  <option
                    v-for="(version, index) of versions"
                    :key="index"
                    :value="version.id"
                  >
                    {{ version.value }}
                  </option>
                </b-select>
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-6">
        <div
          v-if="postsData && postsData.length"
          ref="posts"
          class="columns is-multiline"
        >
          <Post
            v-for="(post, index) in postsData"
            :id="post.id"
            :key="index"
            :src="post.preview_image"
            :title="post.title"
            :description="post.description"
            :votes="parseInt(post.votes)"
            :commentaries="parseInt(post.commentaries)"
            :created-at="new Date(post.created_at).toLocaleDateString()"
          />
        </div>
        <div v-else class="is-size-4 has-text-centered has-text-weight-bold">
          Посты не найдены
        </div>
      </div>
      <div class="column is-10">
        <b-pagination
          v-if="totalPages && totalPages > 1"
          :current="parseInt(currentPage)"
          :total="6 * parseInt(totalPages)"
          :per-page="6"
          order="is-right"
          aria-next-label="Следующая страница"
          aria-previous-label="Предыдущая страница"
          aria-page-label="Страница"
          aria-current-label="Текущая страница"
          class="is-full"
          @change="getPosts"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Post from '~/components/post.vue'

export default {
  layout: 'default',
  components: {
    Post,
  },
  async asyncData({ $axios }) {
    let postsData, recommendedPosts, resolutions, versions
    try {
      postsData = await $axios.$get('/api/get_posts')
      recommendedPosts = await $axios.$get('/api/get_recommended_posts')
      const postParamsData = await $axios.$get('/api/get_posts_params')
      resolutions = postParamsData.resolutions
      versions = postParamsData.versions
    } catch {}
    return {
      filterData: {
        title: null,
        resolution: null,
        version: null,
      },
      timer: null,
      postsData: postsData && postsData.data ? postsData.data : null,
      recommendedPosts:
        recommendedPosts && recommendedPosts.data
          ? recommendedPosts.data
          : null,
      resolutions: resolutions || null,
      versions: versions || null,
      loading: false,
      changedFilter: false,
      currentPage:
        postsData && postsData.pagination
          ? postsData.pagination.currentPage
          : 1,
      totalPages:
        postsData && postsData.pagination
          ? postsData.pagination.lastPage || 1
          : 1,
    }
  },
  computed: {
    removedFilters() {
      return (
        (!this.filterData.title || !this.filterData.title.length) &&
        !this.filterData.resolution &&
        !this.filterData.version
      )
    },
  },
  watch: {
    'filterData.resolution'(value) {
      if (value) {
        this.changedFilter = true
        this.getPosts()
      }
    },
    'filterData.version'(value) {
      if (value) {
        this.changedFilter = true
        this.getPosts()
      }
    },
    removedFilters(value) {
      if (value) {
        this.changedFilter = true
        this.getPosts()
      }
    },
  },
  methods: {
    async getPosts(page = 1) {
      try {
        this.loading = true
        let postsData
        if (this.removedFilters) {
          postsData = await this.$axios.$get(`/api/get_posts/${page}`)
        } else {
          const filterData = new FormData()
          if (this.filterData.title) {
            filterData.append('title', this.filterData.title)
          }
          if (this.filterData.resolution) {
            filterData.append('resolution', this.filterData.resolution)
          }
          if (this.filterData.version) {
            filterData.append('version', this.filterData.version)
          }
          postsData = await this.$axios.$post(
            `/api/get_filtered_posts/${page}`,
            filterData
          )
        }
        this.postsData = postsData.data
        this.currentPage = postsData.pagination.currentPage
        if (this.changedFilter) {
          this.totalPages = postsData.pagination.lastPage || 1
          this.changedFilter = false
        }
        this.loading = false
        this.$scrollTo(this.$refs.posts, 300)
      } catch (e) {
        this.$buefy.snackbar.open({
          message: 'Возникла ошибка',
          type: 'is-danger',
          position: 'is-bottom-right',
        })
      }
    },
    searchPosts() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.filterData.title) {
          this.changedFilter = true
          this.getPosts()
        }
      }, 800)
    },
  },
}
</script>

<style lang="css" scoped>
.hero-image {
  background: no-repeat url('~assets/art.png') right center;
  background-size: cover;
}
.settings {
  position: sticky;
  top: 1.5rem;
}
</style>

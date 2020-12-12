<template>
  <div
    class="is-fullheight is-flex is-flex-direction-column is-justify-content-flex-start"
  >
    <h3 class="title is-3 my-4">Список постов</h3>
    <div
      class="box is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1"
    >
      <div v-if="loading" class="is-full is-fullheight loading-container">
        <b-loading v-model="loading" :is-full-page="false" />
      </div>
      <div v-else>
        <b-field grouped>
          <b-field expanded>
            <b-input
              v-model.trim="postTitle"
              placeholder="Название поста"
              icon="magnify"
              class="is-full"
              @keyup.native="searchPosts"
            />
          </b-field>
          <b-field>
            <b-button
              type="is-info"
              icon-left="plus"
              @click="openAside('create')"
              >Создать пост</b-button
            >
          </b-field>
        </b-field>
        <b-table
          v-if="postsTableData && postsTableData.length"
          :data="postsTableData"
          :paginated="true"
          :per-page="12"
          :current-page.sync="currentPage"
          :hoverable="true"
          :narrowed="true"
          :striped="true"
          :detailed="true"
          :detail-key="postsData.id"
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
            field="title"
            label="Заголовок"
            :centered="true"
          >
            <span class="has-text-weight-medium is-size-6">{{
              props.row.title
            }}</span>
          </b-table-column>
          <b-table-column v-slot="props" label="Дата создания" :centered="true">
            <span class="has-text-weight-medium is-size-6">{{
              new Date(props.row.created_at).toLocaleDateString()
            }}</span>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="link"
            label="Ссылка на скачивание"
            :centered="true"
          >
            <a :href="props.row.link">Перейти</a>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="resolution"
            label="Разрешение"
            :centered="true"
          >
            <span class="has-text-weight-medium is-size-6">{{
              props.row.resolution
                ? resolutions
                  ? resolutions[
                      resolutions.indexOf(
                        resolutions.filter(
                          (el) => el.id === props.row.resolution
                        )[0]
                      )
                    ].value
                  : 'Загрузка'
                : 'Нет данных'
            }}</span>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="version"
            label="Версия"
            :centered="true"
          >
            <span class="has-text-weight-medium is-size-6">{{
              props.row.version
                ? versions
                  ? versions[
                      versions.indexOf(
                        versions.filter((el) => el.id === props.row.version)[0]
                      )
                    ].value
                  : 'Загрузка'
                : 'Нет данных'
            }}</span>
          </b-table-column>
          <b-table-column v-slot="props" label="Действия" :centered="true">
            <div
              class="is-flex is-justify-content-center is-align-items-center"
            >
              <b-tooltip
                label="Открыть"
                :animated="false"
                position="is-top"
                type="is-info"
              >
                <b-button type="is-info" @click="openPost(props.row.id)">
                  <b-icon icon="eye" />
                </b-button>
              </b-tooltip>
              <b-tooltip
                label="Редактировать"
                :animated="false"
                position="is-top"
                type="is-warning"
              >
                <b-button
                  type="is-warning"
                  class="my-2 mx-2"
                  @click="editPost(props.row.id)"
                >
                  <b-icon icon="pencil" />
                </b-button>
              </b-tooltip>
              <b-tooltip
                label="Удалить"
                :animated="false"
                position="is-top"
                type="is-danger"
              >
                <b-button
                  type="is-danger"
                  @click="deletePost(props.row.id, props.row.title)"
                >
                  <b-icon icon="delete" />
                </b-button>
              </b-tooltip>
            </div>
          </b-table-column>
          <template slot="detail" slot-scope="props">
            <article class="media">
              <div class="media-left">
                <figure class="image is-128x128">
                  <img
                    :src="`/public/images/${props.row.preview_image}`"
                    alt="Изображение поста"
                    class="admin-post-image"
                  />
                </figure>
              </div>
              <div class="media-content">
                <span class="post-desc has-text-weight-normal is-size-6">{{
                  props.row.description
                }}</span>
              </div>
            </article>
          </template>
        </b-table>
        <div
          v-else
          class="is-size-4 has-text-weight-semibold has-text-centered"
        >
          Нет данных
        </div>
      </div>
    </div>
    <PostsSidebar
      ref="postsSidebar"
      :loaded="!loading"
      @addPost="addPost"
      @updatePost="updatePost"
      @updatePostParameter="updatePostParameter"
      @deletePost="deletePost"
    />
  </div>
</template>

<script>
import PostsSidebar from '~/components/admin/posts_sidebar.vue'

export default {
  name: 'Posts',
  components: {
    PostsSidebar,
  },
  data() {
    return {
      currentPage: 1,
      loading: true,
      postsData: null,
      searchPostsData: null,
      timer: null,
      postTitle: null,
    }
  },
  computed: {
    postsTableData() {
      return this.searchPostsData && this.searchPostsData.length
        ? this.searchPostsData
        : this.postsData
    },
  },
  async mounted() {
    try {
      this.postsData = await this.$axios.$get(
        `/api/admin/get_posts/${this.currentPage}`,
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
    openPost(id) {
      this.$router.push({ path: `/post/${id}` })
    },
    async editPost(id) {
      try {
        const editPostData = await this.$axios.$get(
          `/api/admin/get_post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        this.openAside('edit')
        this.$refs.postsSidebar.postData = editPostData[0]
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
        }
      }
    },
    openAside(type) {
      this.$refs.postsSidebar.asideType = type
      this.$refs.postsSidebar.showAside = true
    },
    addPost(post) {
      this.postsData.push(post)
    },
    updatePost(postData) {
      this.postsData[
        this.postsData.indexOf(
          this.postsData.filter((el) => el.id === postData.id)[0]
        )
      ] = postData.post
      this.$forceUpdate()
    },
    updatePostParameter(id, key, value) {
      this.postsData.filter((el) => el.id === id)[0][key] = value
    },
    deletePost(id, title) {
      this.$buefy.dialog.confirm({
        title: 'Удалить пост',
        message: `Вы действительно хотите удалить: '${title}'`,
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await this.$axios.$delete(`/api/admin/delete_post/${id}`, {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            })
            this.postsData = this.postsData.filter((el) => el.id !== id)
            this.$buefy.toast.open({
              message: 'Пост успешно удален',
              position: 'is-bottom-right',
              type: 'is-success',
            })
          } catch (e) {
            if (e.response && e.response.status === 401) {
              await this.$store.dispatch('logoutAdmin')
            }
          }
        },
      })
    },
    searchPosts() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.postTitle.length) {
          try {
            this.searchPostsData = await this.$axios.$get(
              `/api/admin/search_posts/${this.postTitle}`,
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
        } else {
          this.searchPostsData = null
        }
      }, 800)
    },
    setPostParams(postParams) {
      this.$refs.postsSidebar.resolutions = postParams.resolutions
      this.$refs.postsSidebar.versions = postParams.versions
    },
  },
}
</script>

<style lang="css" scoped>
.post-desc {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

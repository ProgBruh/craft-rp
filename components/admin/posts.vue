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
              :disabled="Boolean(recommended.length)"
              placeholder="Название поста"
              icon-pack="fas"
              icon="search"
              class="is-full"
              @keyup.native="searchPosts"
            />
          </b-field>
          <b-field>
            <b-checkbox-button
              v-model="recommended"
              native-value="Рекомендованные"
              type="is-success"
            >
              <span>Рекомендованные</span>
            </b-checkbox-button>
          </b-field>
          <b-field>
            <b-button
              type="is-info"
              icon-left="plus"
              @click="openSidebar('create')"
              >Создать пост</b-button
            >
          </b-field>
        </b-field>
        <b-table
          v-if="showTable && postsTableData && postsTableData.length"
          :data="postsTableData"
          :paginated="true"
          :backend-pagination="true"
          :per-page="12"
          :current-page="parseInt(currentPage)"
          :total="12 * parseInt(totalPages)"
          :hoverable="true"
          :narrowed="true"
          :striped="true"
          :detailed="true"
          :detail-key="postsData.id"
          :custom-row-key="postsData.id"
          pagination-size="is-small"
          aria-next-label="Следующая страница"
          aria-previous-label="Предыдущая страница"
          aria-page-label="Страница"
          aria-current-label="Текущая страница"
          @page-change="getPosts"
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
            field="is_recommended"
            label="Рекомендованный пост"
            :centered="true"
          >
            <b-icon
              v-if="props.row.is_recommended"
              pack="fas"
              icon="check"
              type="is-success"
            />
            <b-icon v-else pack="fas" icon="times" type="is-danger" />
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
                  ? resolutions
                      .map((el) => (el = el.id))
                      .includes(props.row.resolution)
                    ? resolutions[
                        resolutions.indexOf(
                          resolutions.filter(
                            (el) => el.id === props.row.resolution
                          )[0]
                        )
                      ].value
                    : 'Несуществующее значение'
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
                  ? versions
                      .map((el) => (el = el.id))
                      .includes(props.row.version)
                    ? versions[
                        versions.indexOf(
                          versions.filter(
                            (el) => el.id === props.row.version
                          )[0]
                        )
                      ].value
                    : 'Несуществующее значение'
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
                  <b-icon pack="fas" icon="eye" />
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
                  <b-icon pack="fas" icon="edit" />
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
                  <b-icon pack="fas" icon="trash-alt" />
                </b-button>
              </b-tooltip>
            </div>
          </b-table-column>
          <template slot="detail" slot-scope="props">
            <article class="media mb-2">
              <div class="media-left">
                <figure class="post-image">
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
            <span class="is-size-6 has-text-weight-semibold">
              Ссылка на скачивание:
            </span>
            <a
              :href="props.row.link"
              class="is-link has-text-dark is-size-5 has-text-weight-light"
              >{{ props.row.link }}</a
            >
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
      totalPages: null,
      loading: true,
      postsData: null,
      timer: null,
      postTitle: '',
      showTable: true,
      recommended: [],
      versions: null,
      resolutions: null,
      changedFilter: false,
    }
  },
  computed: {
    notFiltered() {
      return (
        (!this.postTitle || !this.postTitle.length) && !this.recommended.length
      )
    },
    postsTableData() {
      if (this.recommended.length) {
        return this.postsData.filter((el) => el.is_recommended === true)
      } else {
        return this.postsData
      }
    },
  },
  watch: {
    recommended(value) {
      if (value.length) {
        this.postTitle = ''
        this.changedFilter = true
        this.getPosts()
      }
    },
    notFiltered(value) {
      if (value && !this.loading) {
        this.changedFilter = true
        this.getPosts()
      }
    },
  },
  async mounted() {
    try {
      this.changedFilter = true
      this.getPosts()
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
    openPost(id) {
      this.$router.push({ path: `/post/${id}` })
    },
    async getPosts(page = 1) {
      try {
        this.loading = true
        let postsData
        if (this.recommended.length) {
          postsData = await this.$axios.$get(
            `/api/admin/get_recommended_posts/${page}`,
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
        } else if (this.postTitle.length) {
          postsData = await this.$axios.$get(
            `/api/admin/search_posts/${this.postTitle}/${page}`,
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
        } else {
          postsData = await this.$axios.$get(`/api/admin/get_posts/${page}`, {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          })
        }
        this.postsData = postsData.data
        this.currentPage = postsData.pagination.currentPage
        if (this.changedFilter) {
          this.totalPages = postsData.pagination.lastPage || 1
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
        this.openSidebar('edit')
        this.$refs.postsSidebar.postData = editPostData[0]
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
    openSidebar(type) {
      this.$refs.postsSidebar.asideType = type
      this.$refs.postsSidebar.showAside = true
    },
    addPost(post) {
      this.postsData.push(post)
    },
    updatePost(postData) {
      const index = this.postsData.indexOf(
        this.postsData.filter((el) => el.id === postData.id)[0]
      )
      for (const [key, value] of Object.entries(postData)) {
        this.postsData[index][key] = value
      }
      this.reloadTable()
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
            } else {
              this.$buefy.snackbar.open({
                message: 'Возникла ошибка',
                type: 'is-danger',
                position: 'is-bottom-right',
              })
            }
          }
        },
      })
    },
    searchPosts() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.postTitle.length) {
          this.changedFilter = true
          this.getPosts()
        }
      }, 800)
    },
    setPostParams(postParams) {
      this.resolutions = postParams.resolutions
      this.versions = postParams.versions
      this.$refs.postsSidebar.resolutions = postParams.resolutions
      this.$refs.postsSidebar.versions = postParams.versions
    },
    reloadTable() {
      this.showTable = false
      this.$nextTick(() => {
        this.showTable = true
      })
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
.post-image {
  max-width: 128px;
  max-height: 64px;
  object-fit: cover;
}
</style>

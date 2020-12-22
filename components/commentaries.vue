<template>
  <div>
    <form
      v-if="loggedIn"
      @submit.prevent="
        currentComment.type === 'create' ? createComment() : updateComment()
      "
    >
      <b-field expanded grouped>
        <b-field expanded>
          <b-input
            v-model.trim="currentComment.text"
            :placeholder="
              currentComment.type === 'create'
                ? 'Ваш комментарий'
                : 'Изменить комментарий'
            "
          />
        </b-field>
        <b-field>
          <b-button native-type="submit">ОК</b-button>
        </b-field>
      </b-field>
      <div v-if="currentComment.type === 'edit'" class="level">
        <div class="level-left">Редактировать комментарий</div>
        <div class="level-right">
          <b-button size="is-small" @click="removeEdit"
            ><b-icon pack="fas" icon="times" size="is-small"
          /></b-button>
        </div>
      </div>
    </form>
    <div v-if="commentaries && commentaries.length" class="mt-5">
      <article
        v-for="(comment, index) of commentaries"
        :key="index"
        class="media box"
      >
        <figure class="media-left">
          <p class="image is-64x64">
            <img
              :src="`https://avatars.dicebear.com/api/gridy/${comment.username}.svg`"
            />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <div>
              <span class="is-size-6 has-text-weight-bold">
                {{ comment.username }}
              </span>
              <span class="is-size-7 has-text-weight-light">
                {{ new Date(comment.created_at).toLocaleDateString() }}
              </span>
              <span
                v-if="comment.is_updated"
                class="is-size-7 has-text-weight-light"
              >
                Изменено
              </span>
              <br />
              {{ comment.text }}
            </div>
          </div>
        </div>
        <div class="media-right">
          <div class="b-tooltips">
            <!-- block users -->
            <b-tooltip
              v-if="
                $store.getters.auth &&
                $store.getters.auth.is_super &&
                $store.getters.auth.user !== comment.username
              "
              label="Заблокировать"
              position="is-top"
              type="is-white"
              :animated="false"
            >
              <b-button size="is-small" @click="blockUser(comment.user_id)"
                ><b-icon pack="fas" icon="ban" size="is-small"
              /></b-button>
            </b-tooltip>
            <!-- edit comment -->
            <b-tooltip
              v-if="isUserComment(comment.username)"
              label="Редактировать"
              position="is-top"
              type="is-white"
              :animated="false"
            >
              <b-button
                size="is-small"
                @click="editComment(comment.text, comment.id)"
                ><b-icon pack="fas" icon="edit" size="is-small"
              /></b-button>
            </b-tooltip>
            <!-- delete comment (user, admin) -->
            <b-tooltip
              v-if="
                isUserComment(comment.username) || $store.getters.auth.is_super
              "
              label="Удалить"
              position="is-top"
              type="is-white"
              :animated="false"
            >
              <b-button size="is-small" @click="deleteComment(comment.id)"
                ><b-icon pack="fas" icon="times" size="is-small"
              /></b-button>
            </b-tooltip>
          </div>
        </div>
      </article>
      <div
        v-if="totalPages && totalPages > currentPage"
        class="is-flex is-justify-content-center"
      >
        <b-button type="is-info" @click="loadCommentaries">
          Загрузить еще
        </b-button>
      </div>
    </div>
    <div
      v-else
      class="mt-4 is-size-5 has-text-centered has-text-weight-semibold"
    >
      Комментарии не найдены
    </div>
  </div>
</template>

<script>
export default {
  name: 'Commentaries',
  props: {
    commentaries: {
      type: Array,
      required: true,
      default: () => [],
    },
    totalPages: {
      type: Number,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      currentComment: {
        type: 'create',
        id: null,
        text: null,
      },
      currentPage: 1,
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.auth.loggedIn
    },
  },
  methods: {
    async loadCommentaries() {
      if (this.currentPage <= this.totalPages) {
        try {
          ++this.currentPage
          const commentariesData = await this.$axios.$get(
            `/api/get_commentaries/${this.$route.params.id}/${this.currentPage}`
          )
          commentariesData.data.forEach((el) => {
            this.commentaries.push(el)
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
      }
    },
    isUserComment(username) {
      return (
        this.$store.getters.auth.loggedIn &&
        this.$store.getters.auth.user === username
      )
    },
    async updateComment(id) {
      if (this.currentComment.text && this.currentComment.text.length) {
        try {
          await this.$axios.$put(
            `/api/update_comment/${this.currentComment.id}`,
            {
              text: this.currentComment.text,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.auth.token}`,
              },
            }
          )
          const index = this.commentaries.indexOf(
            this.commentaries.filter(
              (el) => el.id === this.currentComment.id
            )[0]
          )
          this.commentaries[index].text = this.currentComment.text
          this.commentaries[index].is_updated = true
          this.currentComment = {
            type: 'create',
            id: null,
            text: null,
          }
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
      }
    },
    async createComment() {
      if (this.currentComment.text && this.currentComment.text.length) {
        try {
          const comment = await this.$axios.$post(
            `/api/create_comment/${this.$route.params.id}`,
            {
              text: this.currentComment.text,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.auth.token}`,
              },
            }
          )
          this.commentaries.push(comment[0])
          this.currentComment.text = ''
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
      }
    },
    editComment(text, id) {
      this.currentComment.text = text
      this.currentComment.id = id
      this.currentComment.type = 'edit'
    },
    removeEdit() {
      this.currentComment.type = 'create'
      this.currentComment.text = ''
    },
    async deleteComment(id) {
      try {
        if (this.$store.getters.auth.is_super) {
          await this.$axios.$delete(`/api/admin/delete_comment/${id}`, {
            headers: {
              Authorization: `Bearer ${this.$store.getters.auth.token}`,
            },
          })
        } else {
          await this.$axios.$delete(`/api/delete_comment/${id}`, {
            headers: {
              Authorization: `Bearer ${this.$store.getters.auth.token}`,
            },
          })
        }
        this.commentaries.splice(
          this.commentaries.indexOf(
            this.commentaries.filter((el) => el.id === id)[0]
          ),
          1
        )
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
    async blockUser(id) {
      try {
        await this.$axios.$post(
          '/api/admin/block_user',
          { id },
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.auth.token}`,
            },
          }
        )
        this.commentaries = this.commentaries.filter((el) => el.user_id !== id)
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

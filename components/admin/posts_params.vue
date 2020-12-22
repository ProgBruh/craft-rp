<template>
  <div
    class="is-flex is-flex-direction-column is-justify-content-flex-start is-fullheight"
  >
    <h3 class="title is-3 my-4">Параметры поста</h3>
    <div class="box is-flex-grow-1 is-flex-shrink-1">
      <div v-if="loading" class="is-full is-fullheight loading-container">
        <b-loading v-model="loading" :is-full-page="false" />
      </div>
      <div v-else>
        <div class="mb-5">
          <h4 class="is-size-5 has-text-weight-normal mb-2">Разрешение</h4>
          <b-field
            class="is-full"
            :type="
              newResolution || newResolution === 0
                ? !$v.newResolution.$invalid
                  ? 'is-success'
                  : 'is-danger'
                : ''
            "
            :message="
              newResolution || newResolution === 0
                ? $v.newResolution.$invalid
                  ? 'Недопустимое значение'
                  : ''
                : ''
            "
          >
            <b-numberinput
              v-model="newResolution"
              controls-alignment="left"
              :controls="false"
              :min="0"
              :max="2048"
              class="is-full"
            />
            <p class="control">
              <span class="button is-static">&nbsp;X {{ newResolution }}</span>
            </p>
          </b-field>
          <div class="is-flex is-justify-content-space-between">
            <b-taglist>
              <b-tag
                v-for="(resolution, index) of resolutions"
                :key="index"
                type="is-primary is-light"
                aria-close-label="Close tag"
                closable
                @close="deleteResolution(resolution.id)"
              >
                {{ resolution.value }}
              </b-tag>
            </b-taglist>
            <b-button
              icon-left="plus"
              type="is-info"
              size="is-small"
              class="ml-2"
              @click="createResolution"
              >Добавить</b-button
            >
          </div>
        </div>
        <div>
          <h4 class="is-size-5 has-text-weight-normal mb-2">Версия</h4>
          <b-field
            expanded
            :type="
              newVersion
                ? !$v.newVersion.$invalid
                  ? 'is-success'
                  : 'is-danger'
                : ''
            "
            :message="
              newVersion
                ? $v.newVersion.$invalid
                  ? 'Недопустимое значение'
                  : ''
                : ''
            "
          >
            <b-input v-model="newVersion" expanded />
          </b-field>
          <div class="is-flex is-justify-content-space-between">
            <b-taglist>
              <b-tag
                v-for="(version, index) of versions"
                :key="index"
                type="is-primary is-light"
                aria-close-label="Close tag"
                closable
                @close="deleteVersion(version.id)"
              >
                {{ version.value }}
              </b-tag>
            </b-taglist>
            <b-button
              icon-left="plus"
              type="is-info"
              size="is-small"
              class="ml-2"
              @click="createVersion"
              >Добавить</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { between } = require('vuelidate/lib/validators')

export default {
  name: 'PostsParams',
  data() {
    return {
      newResolution: null,
      newVersion: null,
      loading: true,
      versions: [],
      resolutions: [],
    }
  },
  validations: {
    newResolution: {
      between: between(2, 2048),
      unique(value) {
        return !this.resolutions
          .map((el) => (el = el.value.slice(el.value.indexOf('x') + 1)))
          .includes(String(value))
      },
    },
    newVersion: {
      unique(value) {
        return !this.versions
          .map((el) => (el = el.value))
          .includes(value ? value.trim() : value)
      },
    },
  },
  watch: {
    versions() {
      this.$emit('setPostParams', {
        versions: this.versions,
        resolutions: this.resolutions,
      })
    },
    resolutions() {
      this.$emit('setPostParams', {
        versions: this.versions,
        resolutions: this.resolutions,
      })
    },
  },
  async mounted() {
    try {
      const PostsParamsData = await this.$axios.get(
        '/api/admin/get_posts_params',
        {
          headers: {
            Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
          },
        }
      )
      this.versions = PostsParamsData.data.versions
      this.resolutions = PostsParamsData.data.resolutions
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
  methods: {
    async createResolution() {
      if (this.newResolution && !this.$v.newResolution.$invalid) {
        try {
          const newPostParam = await this.$axios.$post(
            '/api/admin/create_post_param',
            {
              value: `${this.newResolution}x${this.newResolution}`,
              type: 'resolution',
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
          this.resolutions.push(newPostParam[0])
          this.newResolution = null
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
    async createVersion() {
      if (this.newVersion && !this.$v.newVersion.$invalid) {
        try {
          const newPostParam = await this.$axios.$post(
            '/api/admin/create_post_param',
            {
              value: this.newVersion,
              type: 'version',
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
          this.versions.push(newPostParam[0])
          this.newVersion = null
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
    async deleteResolution(id) {
      try {
        await this.$axios.$post(
          '/api/admin/delete_post_param',
          {
            id,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        this.resolutions = this.resolutions.filter((el) => el.id !== id)
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
    async deleteVersion(id) {
      try {
        await this.$axios.$post(
          '/api/admin/delete_post_param',
          {
            id,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        this.versions = this.versions.filter((el) => el.id !== id)
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

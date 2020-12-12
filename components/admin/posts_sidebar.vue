<template>
  <b-sidebar
    v-model="showAside"
    type="is-light"
    :fullheight="true"
    :overlay="true"
    :right="true"
    :can-cancel="['escape']"
    open
    @close="closeSidebar"
  >
    <div class="p-2">
      <h5 class="title is-5">
        {{ `${asideType === 'create' ? 'Создать' : 'Редактировать'} пост` }}
      </h5>
      <!-- title -->
      <b-field
        label="Название"
        :type="
          loaded
            ? $v.postData.title.$invalid
              ? 'is-danger'
              : 'is-success'
            : ''
        "
        :message="
          loaded
            ? $v.postData.title.$invalid
              ? 'Недопустимое значение'
              : ''
            : ''
        "
      >
        <b-input v-model="postData.title" />
      </b-field>
      <!-- description -->
      <b-field
        label="Описание"
        :type="
          loaded
            ? $v.postData.description.$invalid
              ? 'is-danger'
              : 'is-success'
            : ''
        "
        :message="
          loaded
            ? $v.postData.description.$invalid
              ? 'Недопустимое значение'
              : ''
            : ''
        "
      >
        <b-input v-model="postData.description" type="textarea" />
      </b-field>
      <!-- link -->
      <b-field
        label="Ссылка на скачивание"
        :type="
          loaded ? ($v.postData.link.$invalid ? 'is-danger' : 'is-success') : ''
        "
        :message="
          loaded
            ? $v.postData.link.$invalid
              ? 'Недопустимое значение'
              : ''
            : ''
        "
      >
        <b-input v-model="postData.link" />
      </b-field>
      <b-field
        label="Разрешение"
        :type="postData.resolution ? 'is-success' : ''"
      >
        <b-select
          v-model="postData.resolution"
          :placeholder="
            !resolutions || !resolutions.length ? 'Нет данных' : 'Не выбрано'
          "
          expanded
          :disabled="!resolutions || !resolutions.length"
        >
          <option
            v-for="(resolution, index) of resolutions"
            :key="index"
            :value="resolution.id"
          >
            {{ resolution.value }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Версия" :type="postData.version ? 'is-success' : ''">
        <b-select
          v-model="postData.version"
          :placeholder="
            !versions || !versions.length ? 'Нет данных' : 'Не выбрана'
          "
          expanded
          :disabled="!versions || !versions.length"
        >
          <option
            v-for="(version, index) of versions"
            :key="index"
            :value="version.id"
          >
            {{ version.value }}
          </option>
        </b-select>
      </b-field>
      <!-- preview image -->
      <b-field
        v-if="asideType === 'create'"
        label="Изображение предпросмотра"
        :type="
          loaded
            ? $v.postData.previewImage.$invalid
              ? 'is-danger'
              : 'is-success'
            : ''
        "
        :message="
          loaded
            ? $v.postData.previewImage.$invalid
              ? 'Недопустимое значение'
              : ''
            : ''
        "
      >
        <b-field>
          <b-upload
            v-model="postData.previewImage"
            accept="image/*"
            :type="
              loaded
                ? $v.postData.previewImage.$invalid
                  ? 'is-danger'
                  : 'is-success'
                : ''
            "
            drag-drop
          >
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
              </div>
            </section>
          </b-upload>
        </b-field>
        <b-field
          v-if="
            loaded &&
            postData.previewImage &&
            !$v.postData.previewImage.$invalid
          "
          class="mt-2"
        >
          <b-tag type="is-success">
            {{ postData.previewImage.name }}
          </b-tag>
        </b-field>
      </b-field>
      <b-field v-else label="Изображение предпросмотра">
        <div class="is-flex is-full is-justify-content-start">
          <div class="image-container">
            <img
              :src="
                asideType === 'edit'
                  ? `/public/images/${postData.preview_image}`
                  : ''
              "
              alt="Post preview image"
              class="admin-post-image"
            />
            <div
              class="image-button-container"
              @click="$refs.setPreviewImage.click()"
            >
              <b-icon icon="upload" size="is-medium" />
            </div>
          </div>
          <input
            ref="setPreviewImage"
            type="file"
            accept="image/*"
            style="display: none"
            @change="setPreviewImage"
          />
        </div>
      </b-field>
      <!-- images -->
      <b-field
        v-if="asideType === 'create'"
        label="Изображения поста"
        :type="
          loaded
            ? $v.postData.images.$invalid
              ? 'is-danger'
              : 'is-success'
            : ''
        "
        :message="
          loaded
            ? $v.postData.images.$invalid
              ? 'Недопустимое значение'
              : ''
            : ''
        "
      >
        <b-field>
          <b-upload
            v-model="postData.images"
            accept="image/*"
            :type="
              loaded
                ? $v.postData.images.$invalid
                  ? 'is-danger'
                  : 'is-success'
                : ''
            "
            multiple
            drag-drop
          >
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
              </div>
            </section>
          </b-upload>
        </b-field>
        <b-field>
          <b-taglist v-if="loaded && postData.images" class="mt-2">
            <b-tag
              v-for="(image, index) of postData.images"
              :key="index"
              :type="$v.postData.images.$invalid ? 'is-danger' : 'is-success'"
              closable
              @close="removePostImage(image)"
              >{{ image.name }}</b-tag
            >
          </b-taglist>
        </b-field>
      </b-field>
      <b-field v-else label="Изображения поста">
        <div class="columns is-multiline">
          <div
            v-for="(image, index) of postData.images"
            :key="index"
            class="column is-4"
          >
            <div class="image-container">
              <img
                :src="asideType === 'edit' ? `/public/images/${image}` : ''"
                class="admin-post-image"
              />
              <div
                class="image-button-container"
                @click="deletePostImage(postData.id, image)"
              >
                <b-icon icon="trash-can" size="is-medium" />
              </div>
            </div>
          </div>
          <div
            v-if="
              (postData.images && postData.images.length < 5) ||
              !postData.images
            "
            class="column is-4 is-centered"
          >
            <b-button
              type="is-info"
              size="is-small"
              @click="$refs.addImageInput.click()"
              ><b-icon icon="plus" size="is-small"
            /></b-button>
          </div>
          <input
            ref="addImageInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="addPostImage"
          />
        </div>
      </b-field>
      <b-field>
        <b-button
          v-if="asideType === 'create'"
          :type="loaded && !$v.$invalid ? 'is-success' : 'is-danger'"
          expanded
          @click="createPost"
          >Создать</b-button
        >
        <b-button
          v-else
          :type="loaded && !$v.$invalid ? 'is-success' : 'is-danger'"
          expanded
          @click="updatePost(postData.id)"
          >Изменить</b-button
        >
      </b-field>
    </div>
  </b-sidebar>
</template>

<script>
const { required, helpers } = require('vuelidate/lib/validators')

export default {
  name: 'PostSidebar',
  props: {
    loaded: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      showAside: false,
      resolutions: null,
      versions: null,
      asideType: null,
      postData: {
        title: null,
        description: null,
        link: null,
        previewImage: null,
        images: null,
        resolution: null,
        version: null,
      },
    }
  },
  validations: {
    postData: {
      title: {
        required,
      },
      description: {
        required,
      },
      link: {
        required,
        correctLink: helpers.regex('alpha', /https:\/\/oxy.st\/d\/\S+/),
      },
      previewImage: {
        required(value) {
          if (this.asideType === 'create') {
            return helpers.req(value)
          } else {
            return true
          }
        },
        correctSize(value) {
          if (this.asideType === 'create') {
            return (
              helpers.req(value) && (value.size / (1024 * 1024)).toFixed(2) <= 5
            )
          } else {
            return true
          }
        },
      },
      images: {
        correctSize(value) {
          if (this.asideType === 'create') {
            return (
              !value ||
              !value
                .map((el) => (el.size / (1024 * 1024)).toFixed(2) > 5)
                .includes(true)
            )
          } else {
            return true
          }
        },
      },
    },
  },
  methods: {
    closeSidebar() {
      this.showAside = false
      this.postData = {
        title: null,
        description: null,
        link: null,
        previewImage: null,
        images: null,
      }
    },
    async createPost() {
      if (this.loaded && !this.$v.$invalid) {
        const postData = new FormData()
        postData.append('title', this.postData.title)
        postData.append('description', this.postData.description)
        postData.append('link', this.postData.link)
        postData.append('previewImage', this.postData.previewImage)
        if (this.postData.images) {
          this.postData.images.forEach((el) => {
            postData.append('images', el)
          })
        }
        if (this.postData.resolution)
          postData.append('resolution', this.postData.resolution)
        if (this.postData.version)
          postData.append('version', this.postData.version)
        try {
          const newPost = await this.$axios.$post(
            '/api/admin/create_post',
            postData,
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
          this.$emit('addPost', newPost)
          this.closeSidebar()
          this.$buefy.toast.open({
            message: 'Пост успешно создан',
            position: 'is-bottom-right',
            type: 'is-success',
          })
        } catch (e) {
          if (e.response && e.response.status === 401) {
            await this.$store.dispatch('logoutAdmin')
          }
        }
      }
    },
    async updatePost(id) {
      if (this.loaded && !this.$v.$invalid) {
        const postData = new FormData()
        postData.append('id', id)
        postData.append('title', this.postData.title)
        postData.append('description', this.postData.description)
        postData.append('link', this.postData.link)
        if (this.postData.resolution)
          postData.append('resolution', this.postData.resolution)
        if (this.postData.version)
          postData.append('version', this.postData.version)
        try {
          const updatedPost = await this.$axios.$put(
            '/api/admin/update_post',
            postData,
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
              },
            }
          )
          this.$emit('updatePost', { id, post: updatedPost[0] })
          this.closeSidebar()
          this.$buefy.toast.open({
            message: 'Пост успешно обновлен',
            position: 'is-bottom-right',
            type: 'is-success',
          })
        } catch (e) {
          if (e.response && e.response.status === 401) {
            await this.$store.dispatch('logoutAdmin')
          }
        }
      }
    },
    async setPreviewImage(event) {
      const image = event.target.files[0]
      event.target.value = null
      if (
        !['png', 'jpg', 'JPEG'].includes(
          image.name.slice(image.name.lastIndexOf('.') + 1)
        ) ||
        (image.size / (1024 * 1024)).toFixed(2) > 5
      ) {
        this.$buefy.toast.open({
          message: 'Не удалось обновить изображение предпросмотра',
          position: 'is-bottom',
          type: 'is-danger',
        })
        return
      }
      const postData = new FormData()
      postData.append('id', this.postData.id)
      postData.append('image', image)
      try {
        const newPreviewImage = await this.$axios.$post(
          '/api/admin/set_preview_image',
          postData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        this.$emit(
          'updatePostParameter',
          this.postData.id,
          'preview_image',
          newPreviewImage
        )
        this.postData.preview_image = newPreviewImage
        this.$buefy.toast.open({
          message: 'Изображение предпросмотра успешно обновлено',
          position: 'is-bottom',
          type: 'is-success',
        })
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
        }
      }
    },
    async addPostImage(event) {
      const image = event.target.files[0]
      event.target.value = null
      if (
        !['png', 'jpg', 'JPEG'].includes(
          image.name.slice(image.name.lastIndexOf('.') + 1)
        ) ||
        (image.size / (1024 * 1024)).toFixed(2) > 5
      ) {
        this.$buefy.toast.open({
          message: 'Не удалось добавить изображение',
          position: 'is-bottom',
          type: 'is-danger',
        })
        return
      }
      const postData = new FormData()
      postData.append('id', this.postData.id)
      postData.append('image', image)
      try {
        const newPostImage = await this.$axios.$post(
          '/api/admin/add_post_image',
          postData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
            },
          }
        )
        if (!this.postData.images) this.postData.images = []
        this.postData.images.push(newPostImage)
        this.$buefy.toast.open({
          message: 'Изображение успешно добавлено',
          position: 'is-bottom',
          type: 'is-success',
        })
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
        }
      }
    },
    async deletePostImage(id, filename) {
      const postData = new FormData()
      postData.append('id', id)
      postData.append('filename', filename)
      try {
        await this.$axios.$post('/api/admin/delete_post_image', postData, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
          },
        })
        this.postData.images = this.postData.images.filter(
          (el) => el !== filename
        )
        this.$buefy.toast.open({
          message: 'Изображение успешно удалено',
          position: 'is-bottom',
          type: 'is-success',
        })
      } catch (e) {
        if (e.response && e.response.status === 401) {
          await this.$store.dispatch('logoutAdmin')
        }
      }
    },
    removePostImage(file) {
      this.postData.images.splice(this.postData.images.indexOf(file), 1)
    },
  },
}
</script>

<style lang="css" scoped>
.image-container {
  position: relative;
}
.image-button-container {
  border-radius: 4px;
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f14668;
  opacity: 80%;
  cursor: pointer;
}
</style>

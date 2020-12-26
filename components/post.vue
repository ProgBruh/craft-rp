<template>
  <div class="column" :class="{ 'is-full': !isPopular, 'is-4': isPopular }">
    <div class="card">
      <div class="card-image">
        <figure class="image is-16by9">
          <img
            :src="
              src ? `/public/images/${src}` : 'https://picsum.photos/1920/1080'
            "
            alt="Post image"
          />
        </figure>
      </div>
      <div class="card-content">
        <h4 class="title is-4 is-link" @click="openPost">
          {{ title }}
        </h4>
        <p class="post-description has-text-weight-light is-size-6">
          {{ description }}
        </p>
        <div
          class="mt-5 is-flex is-align-items-center"
          :class="{
            'is-justify-content-space-around': isPopular,
            'is-justify-content-flex-end': !isPopular,
          }"
        >
          <div
            v-if="votes"
            class="is-flex is-justify-content-center is-align-items-center has-text-danger"
          >
            <b-icon pack="fas" icon="heart" />
            <span class="ml-1 has-text-weight-semibold is-size-7">{{
              votes
            }}</span>
          </div>
          <div
            v-if="commentaries"
            class="is-flex is-justify-content-center is-align-items-center has-text-success"
            :class="{ 'ml-4': !isPopular }"
          >
            <b-icon pack="fas" icon="comment-alt" />
            <span class="ml-1 has-text-weight-semibold is-size-7">{{
              commentaries
            }}</span>
          </div>
        </div>
        <hr />
        <div class="is-flex is-justify-content-flex-end">
          <div class="is-flex is-align-items-center">
            <b-icon pack="fas" icon="calendar-alt" />
            <div class="is-size-7 has-text-weight-light">
              {{ createdAt }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Post',
  props: {
    isPopular: {
      type: Boolean,
      required: false,
      default: false,
    },
    id: {
      type: Number,
      required: true,
      default: null,
    },
    src: {
      type: String,
      required: true,
      default: null,
    },
    title: {
      type: String,
      required: true,
      default: null,
    },
    description: {
      type: String,
      required: true,
      default: null,
    },
    votes: {
      type: Number,
      required: true,
      default: null,
    },
    commentaries: {
      type: Number,
      required: true,
      default: null,
    },
    createdAt: {
      type: String,
      required: true,
      default: null,
    },
  },
  methods: {
    openPost() {
      this.$router.push({ path: `/post/${this.id}` })
    },
  },
}
</script>

<style lang="css" scoped></style>

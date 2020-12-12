<template>
  <div class="is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1">
    <div class="columns is-multiline is-flex-grow-1 is-flex-shrink-1">
      <div class="column is-12 is-8-widescreen">
        <Posts ref="postsComponent" />
      </div>
      <div class="column is-12 is-4-widescreen">
        <div
          class="is-fullheight is-flex is-flex-direction-column is-justify-content-space-between"
        >
          <PostsParams @setPostParams="setPostParams" />
          <PostsStatistic />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Posts from '~/components/admin/posts.vue'
import PostsParams from '~/components/admin/posts_params.vue'
import PostsStatistic from '~/components/admin/posts_statistic.vue'

export default {
  name: 'PostsContainer',
  components: {
    Posts,
    PostsParams,
    PostsStatistic,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    setPostParams(postParams) {
      this.$refs.postsComponent.setPostParams(postParams)
    },
  },
}
</script>

<style lang="css" scoped></style>

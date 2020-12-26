<template>
  <div v-if="post" class="mt-5">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <NuxtLink to="/" tag="div" class="is-link mr-2">Главная</NuxtLink>
        </li>
        <li class="is-active">
          <div aria-current="page" class="ml-2">{{ post.title }}</div>
        </li>
      </ul>
    </nav>
    <h4 class="title is-4">
      {{ post.title }}
    </h4>
    <h5 class="subtitle is-6 is-flex is-align-items-center">
      <b-icon pack="fas" icon="calendar-alt" />
      <span class="ml-1">{{
        new Date(post.created_at).toLocaleDateString()
      }}</span>
    </h5>
    <client-only placeholder="Загрузка...">
      <b-carousel-list
        v-if="post.images"
        :data="post.images"
        :arrow="true"
        :arrow-hover="false"
        :items-to-show="3"
        :items-to-list="1"
        :has-drag="true"
      >
        <template slot="item" slot-scope="props">
          <figure
            class="image post-image is-16by9"
            @click="openImage(props.image)"
          >
            <img
              :src="`/public/images/${props.image}`"
              :alt="`Post ${props.index} image`"
            />
          </figure>
        </template>
      </b-carousel-list>
    </client-only>
    <div class="content mt-2">
      {{ post.description }}
    </div>
    <div class="mb-4 is-flex is-justify-content-flex-end">
      <div class="buttons">
        <b-button v-if="isNotBanned" @click="setVote">
          <div class="is-flex is-align-items-center">
            <b-icon pack="fas" icon="heart" :type="voted ? 'is-danger' : ''" />
            <span class="ml-1 is-size-6 has-text-weight-light">{{
              post.votes
            }}</span>
          </div>
        </b-button>
        <b-button type="is-info" icon-left="download" tag="a" :href="post.link"
          >Загрузить</b-button
        >
      </div>
    </div>
    <hr />
    <Commentaries
      :commentaries="commentariesData || []"
      :total-pages="parseInt(commentariesTotalPages)"
    />
    <modal
      name="image"
      :width="800"
      height="auto"
      :max-height="500"
      :adaptive="true"
    >
      <figure class="image is-16by9">
        <img :src="`/public/images/${modalImage}`" alt="Post image" />
      </figure>
    </modal>
  </div>
  <div v-else class="is-size-4 has-text-centered has-text-weight-bold">
    Не удалось загрузить
  </div>
</template>

<script>
import Commentaries from '~/components/commentaries.vue'

export default {
  layout: 'default',
  components: {
    Commentaries,
  },
  async asyncData({ $axios, params, $cookiz }) {
    let post, voted, commentaries
    try {
      post = await $axios.$get(`/api/get_post/${params.id}`)
      if (post.images)
        post.images = post.images.map(
          (el, index) => (el = { title: ++index, image: el })
        )
      if (
        $cookiz.get('auth') &&
        $cookiz.get('auth').loggedIn &&
        !$cookiz.get('auth').is_blocked
      ) {
        voted = await $axios.$get(`/api/check_vote/${params.id}`, {
          headers: {
            Authorization: `Bearer ${$cookiz.get('auth').token}`,
          },
        })
      }
      commentaries = await $axios.$get(`/api/get_commentaries/${params.id}`)
    } catch {}
    return {
      post: post || null,
      voted: voted || false,
      commentariesData:
        commentaries && commentaries.data ? commentaries.data : null,
      commentariesTotalPages:
        commentaries && commentaries.pagination
          ? commentaries.pagination.lastPage
          : 1,
      modalImage: null,
      currentComment: {
        type: 'create',
        id: null,
        text: null,
      },
    }
  },
  computed: {
    isNotBanned() {
      if (this.$store.getters.auth.loggedIn) {
        return !this.$store.getters.auth.is_blocked
      } else {
        return true
      }
    },
  },
  methods: {
    openImage(image) {
      this.modalImage = image
      this.$modal.show('image')
    },
    async setVote() {
      if (this.$store.getters.auth.loggedIn) {
        await this.$axios.$post(
          '/api/set_vote',
          {
            postId: this.$route.params.id,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.auth.token}`,
            },
          }
        )
        if (this.voted) {
          --this.post.votes
        } else {
          ++this.post.votes
        }
        this.voted = !this.voted
      } else {
        this.$router.push({ path: '/login' })
      }
    },
  },
  head() {
    return {
      title: this.post
        ? `${this.post.title} ресурспак - craft-rp.ru`
        : `Не найдено - craft-rp.ru`,
    }
  },
}
</script>

<style lang="css" scoped>
.post-image {
  cursor: pointer;
  object-fit: cover;
}
</style>

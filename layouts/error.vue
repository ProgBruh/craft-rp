<template>
  <div
    class="is-fullheight is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
  >
    <div class="content">
      <h2 v-if="notFound" class="title is-2 has-text-centered">
        Страница не найдена
      </h2>
      <h2 v-else class="title is-2 has-text-centered">Возникла ошибка</h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
      default: null,
    },
  },
  layout: 'default',
  computed: {
    notFound() {
      return this.error.statusCode === 404
    },
  },
}
</script>

<style lang="css" scoped></style>

<template>
  <div
    class="is-flex is-flex-direction-column is-justify-content-flex-start is-fullheight"
  >
    <h3 class="title is-3 my-4">Статистика постов</h3>
    <div class="box is-flex-grow-1 is-flex-shrink-1">
      <div v-if="loading" class="is-full is-fullheight loading-container">
        <b-loading v-model="loading" :is-full-page="false" />
      </div>
      <div v-else>
        <div v-if="statisticData && statisticData.length">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center"
          >
            <h4 class="is-size-6 has-text-weight-normal mb-2">
              {{
                `Самые ${
                  type === 'views' ? 'просматриваемые' : 'популярные'
                } посты`
              }}
            </h4>
            <b-field>
              <b-radio-button
                v-model="type"
                native-value="views"
                type="is-info is-light"
                size="is-small"
                class="type"
              >
                <div class="is-flex is-justify-content-center">
                  <b-icon icon="eye" size="is-small" />
                </div>
              </b-radio-button>

              <b-radio-button
                v-model="type"
                native-value="votes"
                type="is-info is-light"
                size="is-small"
                class="type"
              >
                <div class="is-flex is-justify-content-center">
                  <b-icon icon="thumb-up" size="is-small" />
                </div>
              </b-radio-button>
            </b-field>
          </div>
          <canvas ref="statistic" width="350" height="350" />
        </div>
        <div
          v-else
          class="is-size-4 has-text-weight-semibold has-text-centered"
        >
          Нет данных
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Chart from 'chart.js'

export default {
  name: 'PostsStatistic',
  data() {
    return {
      type: 'views',
      loading: false,
      statisticData: [],
    }
  },
}
</script>

<style lang="css" scoped>
.type > .button {
  border: 0px !important;
  border-width: 0px;
}
</style>

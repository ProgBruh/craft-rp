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
        <div v-if="statisticValue">
          <h4 class="is-size-5 has-text-weight-semibold has-text-centered mb-2">
            Самые популярные посты
          </h4>
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
import Chart from 'chart.js'

export default {
  name: 'PostsStatistic',
  data() {
    return {
      type: 'views',
      loading: true,
      statisticData: [],
    }
  },
  computed: {
    statisticValue() {
      return (
        !!this.statisticData &&
        !!this.statisticData.length &&
        this.statisticData.map((el) => parseInt(el.votes) > 0).includes(true)
      )
    },
  },
  async mounted() {
    try {
      this.statisticData = await this.$axios.$get('/api/admin/get_statistic', {
        headers: {
          Authorization: `Bearer ${this.$store.getters.authAdmin.token}`,
        },
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
    this.loading = false
    if (this.statisticValue) {
      this.$nextTick(() => {
        ;(() =>
          new Chart(this.$refs.statistic, {
            type: 'bar',
            data: {
              labels: this.statisticData.map((el) => (el = el.title)),
              datasets: [
                {
                  label: 'votes',
                  data: this.statisticData.map((el) => (el = el.votes)),
                },
              ],
            },
            options: {
              legend: {
                display: false,
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      stepSize: 1,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Количество лайков',
                    },
                  },
                ],
              },
            },
          }))()
      })
    }
  },
}
</script>

<style lang="css" scoped></style>

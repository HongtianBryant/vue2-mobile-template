<template>
  <div ref="dom" class="charts" :style="{ height: height + 'px' }"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { on, off } from '@/utils/tools'

export default {
  name: 'ScoreLevelChart',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    height: {
      type: Number,
      default: 350
    }
  },
  data () {
    return {
      dom: null,
      cHeight: 0
    }
  },
  watch: {
    data (newData) {
      this.init()
    },
    cHeight () {

    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })

  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    init () {
      const { yName, allSubNameArr, examNameList, serData, shortNameList } = this.data
      const option = {
        color: ['#f87468', '#f6cb40', '#63b4e9', '#757fdf', '#adce66', '#85dfd2', '#f8ac68'],
        legend: {
          data: allSubNameArr
        },
        grid: {
          top: '40%',
          left: 40,
          right: 10,
          bottom: 30
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#6cd6f9'
            }
          },
          data: shortNameList
        },
        yAxis: {
          name: yName,
          nameTextStyle: {
            color: '#858d9d',
            fontSize: 12
          },
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#d4dae6']
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#858d9d'
            }
          }
        },
        series: serData
      }
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  }
}
</script>

<style scoped lang="scss">
.charts {
  height: 200px;
}
</style>

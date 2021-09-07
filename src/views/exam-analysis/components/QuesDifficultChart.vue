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
      default: 240
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
      console.log(this.data)
      const { data, seriesData, wrongNumArr } = this.data

      const option = {
        grid: {
          right: '24%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            name: '难度分布',
            type: 'pie',
            center: ['50%', '60%'],
            radius: ['0%', '40%'],
            color: data.color,
            data: wrongNumArr,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'inner',
                  formatter: function (obj) {
                    if (obj.value > 0) {
                      return obj.value + '道'
                    } else {
                      return ''
                    }
                  }
                },
                labelLine: {
                  show: true
                }
              }
            }
          },
          {
            name: '难度分布',
            type: 'pie',
            center: ['50%', '60%'],
            radius: ['60%', '80%'],
            color: data.color,
            data: seriesData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (obj) {
                    return obj.name + ':' + obj.percent.toFixed(1) + '%'
                  }
                },
                labelLine: {
                  show: true
                }
              }
            }
          }
        ]
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

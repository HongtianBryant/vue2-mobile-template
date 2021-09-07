<template>
  <div ref="dom" class="charts" :style="{height: height+'px'}"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { on, off } from '@/utils/tools'

export default {
  name: 'KnowScoreCompare',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    chartTitle: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 280
    }
  },
  data() {
    return {
      dom: null
    }
  },
  watch: {
    data() {
      this.init()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    init() {
      const { knowNameArr, knowAvgScore, myKnowRate } = this.data
      const option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['最好成绩', '平均成绩', '我的成绩']
        },
        grid: {
          top: 70,
          bottom: '30%'
        },
        dataZoom: [
          {
            type: 'inside',
            throttle: '50',
            minValueSpan: 4,
            start: 0,
            end: 30
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#6cd6f9'
              }
            },
            axisLabel: {
              interval: 'auto',
              formatter: function(value) {
                return value.split('').join('\n')
              }
            },
            data: knowNameArr
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#6cd6f9'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '平均成绩',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#6dd5fa',
                lineStyle: {
                  color: '#6dd5fa'
                }
              }
            },
            label: {
              normal: {
                show: true,
                color: '#6dd5fa',
                position: 'top'
              }
            },
            data: knowAvgScore
          },
          {
            name: '我的成绩',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#ff7f6a',
                lineStyle: {
                  color: '#ff7f6a'
                }
              }
            },
            label: {
              normal: {
                show: true,
                color: '#ff7f6a',
                position: 'top'
              }
            },
            data: myKnowRate
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
  .charts{
    height: 200px
  }
</style>

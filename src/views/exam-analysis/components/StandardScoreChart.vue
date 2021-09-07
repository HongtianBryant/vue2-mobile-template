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
      default: 280
    }
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    data () {
      this.init()
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
      const { subList, dataValue } = this.data
      const maxData = 80
      const minData = 0
      const option = {
        xAxis: {
          max: maxData,
          min: minData,
          splitLine: { show: false },
          offset: 10,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            margin: 10
          }
        },
        yAxis: {
          type: 'category',
          data: subList,
          inverse: true,
          axisTick: { show: false },
          axisLine: {
            show: false
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              color: '#999',
              fontSize: 12
            }
          }
        },
        grid: {
          top: 20,
          left: 40,
          right: 10,
          bottom: 30
        },
        color: ['#6dd5fa'],
        series: [{
          // current data
          type: 'pictorialBar',
          symbol: '',
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolClip: true,
          symbolSize: 20,
          symbolBoundingData: maxData,
          data: dataValue,
          markLine: {
            symbol: 'none',
            label: {
              normal: {
                formatter: '{c}分',
                position: 'start'
              }
            },
            lineStyle: {
              normal: {
                color: '#ff7f6a',
                type: 'dotted',
                opacity: 0.8,
                width: 2
              }
            },
            data: [{
              xAxis: '35',
              name: '分界线',
              itemStyle: {
                normal: {
                  color: '#6dd5fa'
                }
              }
            }, {
              xAxis: '50',
              name: '分界线',
              itemStyle: {
                normal: {
                  color: '#6dd5fa'
                }
              }
            }, {
              xAxis: '65',
              name: '分界线',
              itemStyle: {
                normal: {
                  color: '#6dd5fa'
                }
              }
            }]
          },
          z: 10
        }, {
          // full data
          type: 'pictorialBar',
          itemStyle: {
            normal: {
              opacity: 0.2
            }
          },
          label: {
            normal: {
              show: false,
              formatter: function (params) {
                return (params.value / maxData * 100).toFixed(1) + ' %'
              },
              position: 'right',
              offset: [10, 0],
              textStyle: {
                color: 'green',
                fontSize: 18
              }
            }
          },
          animationDuration: 0,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbol: '',
          symbolSize: 20,
          symbolBoundingData: maxData,
          data: dataValue,
          z: 5
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
  width: 100vw;
  height: 200px;
}
</style>

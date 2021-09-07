<template>
  <div ref="dom" class="charts" :style="{height: height+'px'}"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { on, off } from '@/utils/tools'

export default {
  name: 'SubAbilityChart',
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
      const { typeNameArr, mySubScore } = this.data
      const option = {
        color: ['#6dd5fa', '#F8C848', '#fe846e'],
        grid: {
          top: '0'
        },
        radar: {
          indicator: typeNameArr,
          center: ['50%', '55%'],
          radius: '70%',
          startAngle: 90,
          splitNumber: 4,
          shape: 'circle',
          splitArea: {
            areaStyle: {
              color: ['transparent']
            }
          },
          axisLabel: {
            show: false,
            fontSize: 12,
            color: '#656d7d',
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#656d7d'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#656d7d'
            }
          }
        },
        series: [{
          name: '',
          type: 'radar',
          data: [
            {
              type: 'radar',
              areaStyle: {
                normal: {
                  color: 'rgba(109,213,250, 0.4)'
                }
              },
              itemStyle: {
                color: 'rgba(109,213,250, 1)',
                borderColor: 'rgba(109,213,250, 0.3)',
                borderWidth: 10
              },
              lineStyle: {
                normal: {
                  color: 'rgba(109,213,250, 1)',
                  width: 2
                }
              },
              value: mySubScore,
              name: '我的得分',
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return params.value
                  }
                }
              }
            }
          ]
        }]
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

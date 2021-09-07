<template>
  <div ref="dom" class="charts" :style="{height: height+'px'}"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { on, off } from '@/utils/tools'

export default {
  name: 'ScoreLevelChart',
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
      const { subNameArr, unionMaxSubScore, unionAvgSubScore, mySubScore } = this.data
      console.log(this.data)
      const option = {
        color: ['#6dd5fa', '#F8C848', '#fe846e'],
        grid: {
          top: '0'
        },
        legend: {
          data: ['联校最高分', '联校平均分', '我的得分']
        },
        radar: {
          indicator: subNameArr,
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
            fontSize: 20,
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
          name: '联校最高分 vs 联校平均分 vs 我的得分',
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
              value: unionMaxSubScore,
              name: '联校最高分'
            },
            {
              type: 'radar',
              areaStyle: {
                normal: {
                  color: 'rgba(248,200,72, 0.4)'
                }
              },
              itemStyle: {
                color: 'rgba(248,200,72, 1)',
                borderColor: 'rgba(248,200,72, 0.3)',
                borderWidth: 10
              },
              lineStyle: {
                normal: {
                  color: 'rgba(248,200,72, 1)',
                  width: 2
                }
              },
              value: unionAvgSubScore,
              name: '联校平均分'
            },
            {
              type: 'radar',
              itemStyle: {
                normal: {
                  color: 'rgba(254,132,110, 1)',
                  borderColor: 'rgba(254,132,110, 0.4)',
                  borderWidth: 0
                }
              },
              areaStyle: {
                normal: {
                  'color': 'rgba(254,132,110, 1)'
                }
              },
              lineStyle: {
                normal: {
                  color: 'rgba(254,132,110, 1)',
                  width: 2
                }
              },
              value: mySubScore,
              name: '我的得分'
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

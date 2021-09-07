<template>
  <div ref="dom" class="charts" :style="{height: height+'px'}"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { on, off } from '@/utils/tools'

export default {
  name: 'PerQuesScore',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    height: {
      type: Number,
      default: 250
    }
  },
  data() {
    return {
      dom: null,
      cHeight: 0
    }
  },
  watch: {
    data(newData) {
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
      const { quesNoArr, unionMakeScoreRate, schoolMakeScoreRate, myMakeScoreRate } = this.data
      const option = {
        legend: {
          data: ['联校得分率', '年级得分率', '我的得分率']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 30
          },
          {
            show: true,
            type: 'slider',
            y: '90%',
            start: 30,
            end: 100
          }
        ],
        grid: {
          top: '24%',
          left: '9%',
          right: '8%',
          bottom: '13%'
        },
        xAxis: [
          {
            name: '题号',
            nameGap: 4,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#6cd6f9'
              }
            },
            data: quesNoArr
          }
        ],
        yAxis: [
          {
            name: '得分率',
            nameGap: 24,
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
            name: '联校得分率',
            type: 'line',
            smooth: true,
            lineStyle: {
              normal: {
                width: 0
              }
            },
            areaStyle: {
              normal: {
                color: '#d3f2fd'
              }
            },
            itemStyle: {
              normal: {
                color: '#d3f2fd'
              }
            },
            data: unionMakeScoreRate
          },
          {
            name: '年级得分率',
            smooth: true,
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: '#6dd5fa'
              }
            },
            data: schoolMakeScoreRate
          },
          {
            name: '我的得分率',
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
            data: myMakeScoreRate
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

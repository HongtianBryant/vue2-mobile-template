<template>
  <div ref="dom" class="charts" :style="{height: height+'px'}"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { on, off } from '@/utils/tools'

export default {
  name: 'ScoreDistributeChart',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    height: {
      type: Number,
      default: 240
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
      const { arrMin, arrMax, arrFull, arrRealMax, examScore } = this.data
      const myColor = ['#039afc', '#ffc300', '#42dfc8']
      const myBgColor = ['#f2f3f5', '#f2f3f5', '#f2f3f5']
      const option = {
        grid: {
          left: '20%',
          top: '10%',
          right: '8%',
          bottom: '20%'
        },
        yAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(160,160,160,0.3)'
            }
          },
          axisLabel: {
            textStyle: {
              color: function(param, index) {
                return myColor[index]
              },
              fontSize: 14
            }
          },
          data: ['班级成绩', '年级成绩', '联校成绩']
        }, {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#000',
              fontSize: 14
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: []
        }],
        xAxis: [{
          type: 'value',
          nameGap: 35,
          nameTextStyle: {
            color: '#000',
            fontSize: 14
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(160,160,160,0.8)'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(160,160,160,0.3)'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#858d9d',
              fontSize: 14
            }
          }
        }, {
          name: '最高分',
          nameLocation: 'start',
          nameGap: -20,
          type: 'value',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#000',
              fontSize: 14
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        {
          name: '最低分',
          nameLocation: 'end',
          nameGap: -20,
          type: 'value',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#000',
              fontSize: 14
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        }],
        series: [
          {
            type: 'bar',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                show: false,
                color: function(params) {
                  var num = myBgColor.length
                  return myBgColor[params.dataIndex % num]
                }
              }
            },
            label: {
              normal: {
                show: false,
                formatter: function(params) {
                  var stuNum = 0
                  // data.forEach(function(value, index, array) {
                  //   if (params.dataIndex == index) {
                  //     stuNum = value
                  //   }
                  // })
                  return stuNum
                },
                position: 'top'
              }
            },
            barWidth: 20,
            data: arrFull
          },
          {
            type: 'bar',
            stack: 'value',
            itemStyle: {
              normal: {
                show: true,
                color: function(params) {
                  var num = myBgColor.length
                  return myBgColor[params.dataIndex % num]
                },
                opacity: 1
              }
            },
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.value
                },
                position: 'insideRight',
                textStyle: {
                  color: '#656d7d',
                  fontSize: 12
                }
              }
            },
            barWidth: 20,
            data: arrMin
          },
          {
            type: 'bar',
            stack: 'value',
            itemStyle: {
              normal: {
                show: true,
                color: function(params) {
                  var num = myColor.length
                  return myColor[params.dataIndex % num]
                }
              }
            },
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  var stuNum = 0
                  arrRealMax.forEach((value, index, array) => {
                    if (params.dataIndex === index) {
                      stuNum = value
                    }
                  })
                  return stuNum
                },
                position: 'right',
                textStyle: {
                  color: '#656d7d',
                  fontSize: 12
                }
              }
            },
            barWidth: 20,
            data: arrMax,
            markLine: {
              symbol: 'none',
              label: {
                normal: {
                  formatter: '我的得分{c}分',
                  position: 'end'
                }
              },
              lineStyle: {
                normal: {
                  color: '#f00',
                  type: 'solid',
                  opacity: 0.8,
                  width: 2
                }
              },
              data: [{
                xAxis: examScore,
                itemStyle: {
                  normal: {
                    color: '#00a4ff'
                  }
                }
              }]
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
</style>

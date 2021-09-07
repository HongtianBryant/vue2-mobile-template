<template>
  <div class="audio-wrapper">
    <div v-if="currentAudio" class="progress-wrapper">
      <span class="time time-l">{{ format(currentTime) }}</span>
      <div class="progress-bar-wrapper">
        <progress-bar
          ref="progressBar"
          :no-touch="true"
          :percent="percent"
          @percentChange="onProgressBarChange"
          @percentChanging="onProgressBarChanging"
        ></progress-bar>
      </div>
      <span class="time time-r">{{ format(audioObject.duration) }}</span>
    </div>
    <audio
      ref="audio"
      @canplay="canPlay"
      @playing="ready"
      @error="error"
      @timeupdate="updateTime"
      @play="audioPlay"
      @pause="paused"
      @ended="audioEnd"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProgressBar from '@/components/ProgressBar'

export default {
  name: 'AudioPlayer',
  components: {
    ProgressBar
  },
  props: {
    audioUrl: {
      type: String,
      default: ''
    },
    paperId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: null,
      songReady: false,
      currentTime: 0,
      audioObject: {}
    }
  },
  computed: {
    ...mapState('exam', [
      'playingState',
      'currentAudio'
    ]),
    percent() {
      return this.currentTime / this.audioObject.duration
    }
  },
  watch: {
    playingState(newPlaying) {
      // if (!this.songReady) {
      //   return
      // }
      const audio = this.$refs.audio
      if (this.currentAudio && this.currentAudio.url && this.currentAudio.currentTime) {
        if (this.currentAudio.paperId === this.paperId) {
          audio.src = this.currentAudio.url
          this.currentTime = this.currentAudio.currentTime
          audio.currentTime = this.currentTime
        }
      }

      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.currentAudio && this.currentAudio.url && this.currentAudio.currentTime) {
        if (this.currentAudio.paperId === this.paperId) {
          this.$refs.audio.src = this.currentAudio.url
          this.currentTime = this.currentAudio.currentTime
          this.$refs.audio.currentTime = this.currentTime
          this.audioObject = this.currentAudio
        }
      } else {
        this.$refs.audio.src = this.audioUrl
      }
    })
  },
  methods: {
    ...mapActions('exam', [
      'setPlayingState',
      'saveCurrentAudio'
    ]),
    ready() {
      clearTimeout(this.timer)
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true
      this.saveCurrentAudio(this.currentAudio)
    },
    canPlay(e) {
      const duration = e.target.duration
      this.audioObject = {
        url: this.audioUrl,
        duration: duration,
        paperId: this.paperId
      }
    },
    audioPlay(e) {
    },
    paused() {
      this.setPlayingState(false)
    },
    audioEnd() {
      this.audioObject.canPlay = false
      this.saveCurrentAudio(this.audioObject)
    },
    error() {
      clearTimeout(this.timer)
      this.songReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
      this.audioObject.currentTime = this.currentTime
      this.saveCurrentAudio(this.audioObject)
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onProgressBarChanging(percent) {
      this.currentTime = this.audioObject.duration * percent
    },
    onProgressBarChange(percent) {
      const currentTime = this.audioObject.duration * percent
      this.currentTime = this.$refs.audio.currentTime = currentTime
    }
  }
}
</script>
<style lang='scss' scoped>
.progress-wrapper{
  display: flex;
  align-items: center;
  width: 180px;
  margin: 0px auto;
  padding: 5px 0;
  .time{
    color: #4e565f;
    font-size: 12px;
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
    &.time-l{
      text-align: left;
    }
    &.time-r{
      text-align: right;
    }
  }
  .progress-bar-wrapper{
    flex: 1
  }
}
</style>

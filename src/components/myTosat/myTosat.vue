<template>
  <div class="toast" v-if="show">
    <div class="mask" v-if="showMask"></div>
    <div class="message">{{ message }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showMask: true,
      message: "",
      t: null,
      show: false,
    };
  },
  methods: {
    showToast({ message = "", showMask = true, length = 800 }) {
      this.message = message;
      this.showMask = showMask;
      this.show = true;
      this.t && clearTimeout(this.t);
      this.t = setTimeout(() => {
        this.show = false;
      }, length);
    },
    hideToast() {
      this.show = false;
    },
    destory() {
      this.$destroy();
    },
  },
};
</script>
<style scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 100;
}
.toast{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}
.message {
  display: inline-block;
  max-width: 90%;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  padding: 0.1rem 0.2rem;
  font-size: 0.26rem;
  position: relative;
  z-index: 100;
}
</style>

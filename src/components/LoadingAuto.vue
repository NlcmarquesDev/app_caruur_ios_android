<template>
  <div class="car-wrapper" :class="direction" @animationend="toggleDirection">
    <i class="fa-solid fa-car-side"></i>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const direction = ref('right')

function toggleDirection() {
  direction.value = direction.value === 'right' ? 'left' : 'right'
}
</script>

<style scoped>
.car-wrapper {
  display: inline-block;
  transform-origin: center;
  animation-fill-mode: forwards;
}

.car-wrapper.right {
  animation: moveRight 2s linear forwards;
}

.car-wrapper.left {
  animation: moveLeft 2s linear forwards;
}

@keyframes moveRight {
  0% {
    transform: translateX(-100px) scaleX(1);
  }
  100% {
    transform: translateX(100px) scaleX(1);
  }
}

@keyframes moveLeft {
  0% {
    transform: translateX(100px) scaleX(-1);
  }
  100% {
    transform: translateX(-100px) scaleX(-1);
  }
}
.car-wrapper i {
  animation: bumpy 1s ease-in-out infinite;
  transform-origin: center;
}
@keyframes bumpy {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(2px);
  }
}
</style>

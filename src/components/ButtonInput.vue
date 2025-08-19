<template>
  <div :class="props.classes"><slot></slot></div>
</template>

<script setup>
const props = defineProps({
  classes: {
    type: String,
    // default: 'save',-btn
  },
})
</script>

<style scoped>
.cancel-btn {
  background-color: transparent;
  border: 1px solid #444;
  color: #ccc;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  width: 100%;
  /* Full width on mobile */
  order: 2;
  text-align: center;
  /* Moves cancel below save on mobile */
}

.save-btn {
  background-color: #f99d1a;
  border: none;
  color: #000;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  width: 100%;
  /* Full width on mobile */
  order: 1;
  text-align: center;
  /* Ensures save is on top */
}

.cancel-btn:active {
  background-color: rgba(255, 255, 255, 0.05);
}

.save-tbn:active {
  background-color: #e08c15;
}
</style>

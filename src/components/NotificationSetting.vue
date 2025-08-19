<template>
  <div class="settings-item">
    <div class="item-left">
      <div class="item-title">{{ notification.title }}</div>
      <div class="item-description">{{ notification.description }}</div>
    </div>
    <label class="toggle-switch">
      <input type="checkbox" v-model="notificationCheckbox" @change="showSuccessMessage" />
      <span class="slider"></span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  notification: Object,
})
const notificationCheckbox = ref(props.notification.enabled)
</script>

<style scoped>
/* --------------------------------------
 * Settings List Items
 * -------------------------------------- */
.settings-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #222;
  flex-wrap: wrap;
}

.settings-item:last-child {
  border-bottom: none;
}

/* Special handling for items with theme options - mobile first approach */
.settings-item:has(.theme-options) {
  flex-direction: column;
  align-items: flex-start;
}

.item-left {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 10px;
  min-width: 0; /* Allow text to truncate if needed */
  margin-bottom: 10px; /* Space between description and theme options on mobile */
}

.item-title {
  font-size: 1em;
  margin-bottom: 4px;
}

.item-description {
  font-size: 0.85em;
  color: #aaa;
  white-space: normal;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  min-width: 50px; /* Prevent shrinking */
  flex-shrink: 0; /* Prevent shrinking */
  margin-left: 15px; /* Add space between text and toggle */
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #444;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #f99d1a;
}

input:checked + .slider:before {
  transform: translateX(24px);
}
</style>

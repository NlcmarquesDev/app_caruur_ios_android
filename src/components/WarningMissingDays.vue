<template>
  <div>
    <p>
      Nog <strong>{{ days }}</strong> dagen tot de volgende {{ text }}
    </p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const { text, days } = defineProps({
  text: String,
  days: String,
})
</script>

<style scoped>
strong {
  color: var(--primary-color);
}
p {
  text-align: center;
}
</style>

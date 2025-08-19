<template>
  <p
    class="error-message"
    :class="{
      'alert-success': type === 'success',
      'alert-error': type === 'error',
    }"
  >
    <i :class="icon"></i>
    {{ errorMessage }}
  </p>
</template>

<script setup>
const props = defineProps({
  errorMessage: String,
  type: {
    type: String,
    default: 'error',
  },
  icon: String,
})

const icon =
  props.icon || (props.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle')
</script>

<style scoped>
/* --------------------------------------
* Error message styling
* -------------------------------------- */
.error-message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 0.9em;
}
.alert-success {
  color: #155724;
  background-color: rgba(53, 194, 100, 0.1);
  border-left: 4px solid #0c3716;
}

.alert-error {
  color: #ff6b6b;
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 4px solid #ff6b6b;
}
</style>

<template>
  <div class="glass-button"><slot></slot></div>
</template>

<script setup></script>

<style scoped>
.glass-button {
  padding: 40px 50px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  color: #f29201;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
  border-left: 6px solid #f29201;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}
</style>

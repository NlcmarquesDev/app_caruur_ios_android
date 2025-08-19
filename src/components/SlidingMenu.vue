<script setup>
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListSlideMenu from '@/components/ListSlideMenu.vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

function closeMenu() {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : ''
  },
)
const route = useRoute()
watch(route, () => {
  closeMenu()
})

onMounted(() => {
  closeMenu()
})

const menuItems = [
  { id: 1, icon: 'fa-user', text: 'Mijn profiel', link: '/profiel' },
  { id: 2, icon: 'fa-gear', text: 'Instellingen', link: '/instellingen' },
  { id: 3, icon: 'fa-car', text: 'Kies auto', link: '', expandable: true },
  { id: 4, icon: 'fa-right-from-bracket', text: 'Afmelden', isLogout: true },
]
</script>

<template>
  <div :class="['menu-overlay', { active: modelValue }]" @click="closeMenu">
    <div :class="['sliding-menu', { open: modelValue }]" @click.stop>
      <div class="menu-header">
        <h2>Menu</h2>
        <i class="fa-solid fa-xmark menu-close" @click="closeMenu"></i>
      </div>
      <div class="menu-items">
        <ListSlideMenu
          v-for="menuItem in menuItems"
          :menuItem="menuItem"
          :expandable="menuItem.expandable"
          :key="menuItem.id"
        ></ListSlideMenu>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;

}

.menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sliding-menu {
  position: fixed;
  top: 0;
  right: -100%; /* Start off-screen */
  left: auto;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  z-index: 999;
  transition: right 0.3s ease;
  overflow-y: auto;
  margin-top:50px;
}

.sliding-menu.open {
  right: 0; /* Slide in */
}

.sliding-menu .menu-items a {
  text-decoration: none;
  color: var(--text-color);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10%;
  border-bottom: 2px solid #f99d1a;
  margin-bottom: 30px;
}

.menu-close {
  font-size: 1.5em;
  color: var(--text-color);
}

.menu-items {
  padding: 0 10%;
}
</style>

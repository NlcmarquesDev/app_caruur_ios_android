<template>
  <div class="menu-item" :class="{ expandable: menuItem.expandable }" @click="handleClick">
    <i class="fa-solid" :class="menuItem.icon"></i>
    <span v-if="!menuItem.isLogout">
      <router-link :to="menuItem.link">{{ menuItem.text }}</router-link>
    </span>
    <span v-else @click="logoutUser">{{ menuItem.text }}</span>

    <i v-if="expandable" class="fa-solid fa-chevron-down expand-icon"></i>
  </div>
  <div v-if="menuItem.expandable" class="submenu" :class="{ active: isExpanded }">
    <div
      v-for="(plate, index) in submenuItems.vehicles"
      :key="index"
      class="submenu-item"
      :class="{ selected: selectedPlate === plate.Numberplate }"
      @click.stop="selectPlate(plate.Numberplate)"
    >
      <i class="fa-solid fa-id-card"></i>
      <router-link
        :to="{ name: 'auto', params: { id: plate.ID }, query: { numberplate: plate.Numberplate } }"
        :key="$route.fullPath"
      >
        {{ plate.Numberplate }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useLogout } from '@/composables/useLogout'
import vehicles from './../assets/JS/getVehicles.js'
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  menuItem: {
    type: Object,
    required: true,
  },
  expandable: {
    type: Boolean,
    default: false,
  },
})
const isExpanded = ref(false)
const selectedPlate = ref(null)
const { logoutUser } = useLogout()
// const submenuItems = JSON.parse(sessionStorage.getItem('vehicles'))
const submenuItems = ref({ vehicles: [] })

async function loadVehicles() {
  await vehicles()
  submenuItems.value = JSON.parse(sessionStorage.getItem('vehicles')) || { vehicles: [] }
}

function handleClick() {
  if (props.menuItem.expandable) {
    isExpanded.value = !isExpanded.value
  } else if (props.menuItem.action && typeof props.menuItem.action === 'function') {
    props.menuItem.action()
  }
}

function selectPlate(plate) {
  selectedPlate.value = plate
  isExpanded.value = false
}
watch(
  () => props.userId,
  async () => {
    await loadVehicles()
  },
)

onMounted(async () => {
  // vehicles()
  await loadVehicles()
})
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #333;
}

.menu-item i {
  margin-right: 15px;
  color: #f99d1a;
  width: 25px;
}

.menu-item span {
  font-size: 1.2em;
}
.menu-items a {
  text-decoration: none;
  color: var(--text-color);
}

/* Expandable menu styling */
.menu-item.expandable {
  cursor: pointer;
  position: relative;
}

.expand-icon {
  position: absolute;
  right: 0;
  color: #f99d1a;
  transition: transform 0.3s ease;
}

.menu-item.expandable.active .expand-icon {
  transform: rotate(180deg);
}

/* Submenu styling */
.submenu {
  display: none;
  padding-left: 40px;
  background-color: var(--bg-color); /* Slightly darker than the main menu */
}

.submenu.active {
  display: block;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #222;
  cursor: pointer;
  color: var(--text-color);
}

.submenu-item i {
  margin-right: 15px;
  color: #f99d1a;
  width: 25px;
}

.submenu-item span {
  font-size: 1.1em;
}

/* Style for selected plate */
.submenu-item.selected {
  background-color: var(--bg-input);
}

.submenu-item.selected::after {
  content: '\f00c'; /* FontAwesome checkmark icon */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  right: 10%;
  color: #f99d1a;
}
</style>

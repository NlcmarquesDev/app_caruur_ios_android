<template>
  <header>
    <div class="header-container">
      <router-link to="/">
        <img id="caruur-logo-no-text" src="./../assets/images/caruur.png" alt="caruur logo" />
      </router-link>
      <div style="display: flex; justify-content: center; align-items: center">
        <!-- <span class="license" v-if="plates.length === 0">00-000-00</span> -->
        <template v-if="plates.length !== 0">
          <span
            class="license"
            v-if="plates.length === 1"
            v-for="v in plates"
            :key="v.ID"
            :value="v.ID"
            >{{ v.Numberplate }}</span
          >
          <select
            class="license"
            name="numberplates"
            id="numberplates"
            @change="onSelectChange"
            v-model="selectedVehicleId"
            v-else
          >
            <option v-for="v in plates" :key="v.ID" :value="v.ID">
              {{ v.Numberplate }}
            </option>
          </select>
        </template>
      </div>
      <span @click="openMenu">
        <i class="fa-solid fa-bars fa-2xl" id="menu-toggle"></i>
      </span>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import vehicles from '@/assets/JS/getVehicles'
import { isAuthenticated } from '@/assets/JS/isAuth'
const props = defineProps({
  showMenu: Boolean,
})

const emit = defineEmits(['update:showMenu'])

function openMenu() {
  emit('update:showMenu', true)
}
function onSelectChange() {
  router.push({ name: 'home' })
}

const plates = ref([])
const selectedVehicle = inject('selectedVehicleId')
const selectedVehicleId = selectedVehicle

onMounted(async () => {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return
    }
    const result = await vehicles()
    plates.value = result.vehicles

    const storedVehicleId = sessionStorage.getItem('selectedVehicle')

    if (storedVehicleId && plates.value.some((p) => p.ID === storedVehicleId)) {
      selectedVehicleId.value = storedVehicleId
    } else if (plates.value.length > 0) {
      selectedVehicleId.value = plates.value[0].ID
      sessionStorage.setItem('selectedVehicle', plates.value[0].ID)
    }
  } catch (error) {
    console.error('Error loading the vehicles:', error)
  }
})

watch(selectedVehicleId, () => {
  sessionStorage.setItem('selectedVehicle', selectedVehicleId.value)
})
</script>

<style>
header {
  margin-top: 50px;
}
.license {
  display: inline-block;
  position: relative;
  background: #fff;
  color: #a30923;
  border-radius: 4px;
  height: 30px;
  font-size: 18px;
  line-height: 26px;
  padding: 0px 9px;
  text-align: right;
  letter-spacing: 2px;
  font-weight: bold;
  border: 2px solid #a30923;
  white-space: nowrap;
  min-width: 144px;
  text-align: center;
}
</style>

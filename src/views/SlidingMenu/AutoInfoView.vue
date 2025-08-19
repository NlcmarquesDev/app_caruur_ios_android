<template>
  <AutoInfo :id="Number(plateId)" :number="numberplate" :contract-id="Number(contractId)" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AutoInfo from '@/components/AutoInfo.vue'
const route = useRoute()
const plateId = ref(route.params.id)
const numberplate = ref(route.query.numberplate)
const contractId = ref('')

watch(
  () => route.params.id,
  (newId) => {
    plateId.value = newId
    updateContractId()
  },
  { immediate: true },
)

watch(
  () => route.query.numberplate,
  (newPlate) => {
    numberplate.value = newPlate
  },
  { immediate: true },
)

function updateContractId() {
  const vehiclesData = JSON.parse(sessionStorage.getItem('vehicles') || '{}')

  if (vehiclesData && Array.isArray(vehiclesData.vehicles)) {
    const selectedVehicle = vehiclesData.vehicles.find((v) => v.ID == plateId.value)
    if (selectedVehicle) {
      contractId.value = selectedVehicle.ContractId || ''
    } else {
      contractId.value = ''
    }
  }
}
</script>

<style scoped></style>

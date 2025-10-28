<template>
  <div class="card card-active" v-show="showCard">
    <div class="card-header">
      <h4>{{ title }}</h4>
      <div>
        <span class="badge" v-show="newNews">New</span>
        <i class="fa-solid fa-star" v-show="favorite"></i>
      </div>
    </div>
    <div class="card-title">
      {{ description }}
    </div>
    <div class="card-link" v-show="ShowLink">
      <a :href="urlLink" target="_blank" noopener noreferrer>🔗 Link</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  card: Object,
})

const showCard = ref(false)
const ShowLink = ref(false)
const favorite = ref(false)
const newNews = ref(false)
const title = ref('')
const description = ref('')
const urlLink = ref('')

if (props.card.active == 1) {
  newNews.value = props.card.new
  showCard.value = true
  // props.card.Active = 'Actief'
  title.value = props.card.Title
  description.value = props.card.description

  if (props.card.favoriete == 1) {
    favorite.value = true
  }

  if (props.card.link && props.card.link.length !== 0) {
    ShowLink.value = true
    urlLink.value = props.card.Link || '#'
  }
}
</script>

<style scoped>
.card {
  background-color: #1e1e1e;
  /* border-left: 5px solid #00bcd4; */
  border-left: 5px solid var(--primary-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  margin: 20px 0;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.card-header h4 {
  font-size: 1.1rem;
  margin: 0;
  color: #ffffff;
}

.card-title {
  margin-bottom: 1rem;
  line-height: 1.5;
  color: #ccc;
}

.card-link a {
  color: #00bcd4;
  font-weight: 600;
  text-decoration: none;
}

.card-link a:hover {
  text-decoration: underline;
}

.fa-star {
  color: #fbc02d;
}

a {
  word-break: break-word;
}
</style>

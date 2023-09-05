<script lang="ts" setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/store/app.store'

  const appStore = useAppStore()
  const songList = computed(() => {
    // @ts-ignore
    const { params = {} } = appStore.currentRoute
    const { albumId } = params
    const { songs } = appStore.albums[albumId]
    return songs.map((songId: string) => appStore.songs[songId])
  })
</script>

<template>
  <div class="songs">
    <div class="songs__title">Песни:</div>

    <q-list class="songs__list">
      <q-item
        v-for="(song, index) in songList"
        :key="song.id"
        dense
        class="songs__item"
      >
        <q-item-section>
          {{ index + 1 }}. {{ song.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
  .songs {
    position: relative;
    height: 100%;

    &__title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &__list {
      position: relative;
      width: 400px;
      height: calc(100% - 50px);
      overflow-y: auto;
    }

    &__item {
      font-weight: 500;
    }
  }
</style>

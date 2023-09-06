<script lang="ts" setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/store/app.store'
  import { getSongsWord } from '@/tools/helpers'

  const appStore = useAppStore()
  const singerId = computed(() => {
    // @ts-ignore
    const { params = {} } = appStore.currentRoute
    return params.singerId
  })
  const albums = computed(() => Object.values(appStore.albumsBySinger)
    .sort((a, b) => a.year - b.year ))

</script>

<template>
  <div class="albums">
    <div class="albums__title">Альбомы:</div>

    <q-list class="albums__list">
      <q-item
        v-for="(album, index) in albums"
        :key="album.id"
        clickable
        v-ripple
        :to="`/singers/${singerId}/${album.id}`"
        exact
        :class="[
          'albums__item',
          { 'albums__item--odd': !(index % 2) },
        ]"
      >
        <q-item-section>
          <q-item-label>{{  album.name }}</q-item-label>
          <q-item-label caption>{{ album.year }}</q-item-label>
          <q-item-label caption>({{ album.songs.length }} {{ getSongsWord(album.songs.length) }})</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
  .albums {
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

      &--odd {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
</style>

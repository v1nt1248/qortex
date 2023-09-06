<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useAppStore } from '@/store/app.store'

  const appStore = useAppStore()
  const albumId = computed(() => {
    // @ts-ignore
    const { params = {} } = appStore.currentRoute
    return params.albumId
  })
  const songList = computed(() => {
    const { songs = [] } = appStore.albums[albumId.value] || {}
    return songs.map((songId: string) => appStore.songs[songId])
  })
  const dragging = ref(-1)

  const dragStart = (which: number, ev: DragEventInit & { target: any }) => {
    ev.dataTransfer!.setData('Text', ev.target.id);
    ev.dataTransfer!.dropEffect = 'move'
    dragging.value = which
  }
  const dragEnter = (ev: DragEvent & { target: any }) => {
    if (ev.clientY > ev.target.height / 2) {
      ev.target.style.marginBottom = '5px'
    } else {
      ev.target.style.marginTop = '5px'
    }
  }
  const dragLeave = (ev: DragEvent & { target: any }) => {
    ev.target.style.marginTop = '2px'
    ev.target.style.marginBottom = '2px'
  }
  const dragEnd = () => {
    dragging.value = -1
  }
  const dragFinish = (to: number, ev: DragEvent & { target: any }) => {
    const { songs } = appStore.albums[albumId.value]
    songs.splice(to, 0, songs.splice(dragging.value, 1)[0])
    appStore.updateAlbum({
      id: albumId.value,
      field: 'songs',
      value: songs,
    })

    ev.target.style.marginTop = '2px'
    ev.target.style.marginBottom = '2px'
  }
</script>

<template>
  <div class="songs">
    <div class="songs__title">Песни:</div>

    <q-list separator class="songs__list">
      <q-item
        v-for="(song, index) in songList"
        :key="song.id"
        :id="song.id"
        dense
        :class="[
          'songs__item',
          { 'songs__item--dragging': index === dragging }
        ]"
        draggable="true"
        @dragstart="dragStart(index, $event)"
        @dragend="dragEnd"
        @dragover.prevent
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="dragFinish(index, $event)"
      >
        <q-item-section class="songs__item-content">
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
      margin: 2px 0;
      cursor: move;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color: #fff;

      &-content {
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
      }

      &--dragging {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>

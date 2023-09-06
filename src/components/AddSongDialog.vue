<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { Dialog, useDialogPluginComponent } from 'quasar'
  import { useAppStore } from '@/store/app.store'
  import DialogActions from './DialogActions.vue'
  import NewSingerDialog from './NewSingerDialog.vue'
  import NewAlbumDialog from './NewAlbumDialog.vue'
  import NewSongDialog from './NewSongDialog.vue'
  import { getRandomId, entitiesSortFn } from '@/tools/helpers'

  // @ts-ignore
  const emits = defineEmits({
    ...useDialogPluginComponent.emitsObject,
  })
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const appStore = useAppStore()

  const formDisable = ref(true)

  const selectedSinger = ref()
  const selectedAlbum = ref()
  const selectedSong = ref()
  
  const searchSingerText = ref('')
  const searchAlbumText = ref('')
  const searchSongText = ref('')


  const singers = computed(() => Object.values(appStore.singers)
    .filter(s => s.name.toLowerCase().includes(searchSingerText.value.toLowerCase()))
    .sort((a, b) => entitiesSortFn(a, b)))
  const albums = computed(() => {
    if (!selectedSinger.value || !selectedSinger.value.id) {
      return []
    }
    return Object.values(appStore.albums)
      .filter(album => album.singerId === selectedSinger.value.id && album.name.toLowerCase().includes(searchAlbumText.value.toLowerCase()))
      .sort((a, b) => entitiesSortFn(a, b, 'year'))
  })
  // const songs = computed(() => {
  //   const songsIds: string[] = albums.value
  //     .reduce((res, album) => {
  //       const { songs } = album
  //       res = [...res, ...songs]
  //       return res
  //     }, [] as string[])
  //   const uniqueSongsIds = Array.from(new Set(songsIds.concat(appStore.allUndistributedSongs)))
  //   return uniqueSongsIds.map(id => appStore.songs[id]).sort((a, b) => entitiesSortFn(a, b))
  // })
  const songs = computed(() => Object.values(appStore.songs)
    .filter(s => s.name.toLowerCase().includes(searchSongText.value.toLowerCase()))
    .sort((a, b) => entitiesSortFn(a, b)))

  onMounted(() => {
    // @ts-ignore
    const { params = {} } = appStore.currentRoute
    const { singerId, albumId } = params
    if (singerId) {
      selectedSinger.value = singers.value.find(s => s.id === singerId)
    }
    if (albumId) {
      selectedAlbum.value = albums.value.find(a => a.id === albumId)
    }
  })

  const isSongSelectItemDisabled = (id: string): boolean => {
    const { songs = [] } = selectedAlbum.value || {}
    return songs.includes(id)
  }

  const onUpdate = (field?: string) => {
    if (field === 'singer') {
      selectedAlbum.value = undefined
      selectedSong.value = undefined
    }

    if (field === 'album') {
      selectedSong.value = undefined
    }

    formDisable.value = !(selectedAlbum.value && selectedSinger.value.id && selectedAlbum.value && selectedAlbum.value.id && selectedSong.value && selectedSong.value.id)
  }

  const addNewSinger = () => {
    Dialog.create({
      component: NewSingerDialog,
    }).onOk((name: string) => {
      const newSinger = { id: getRandomId(5), name }
      appStore.addSinger(newSinger)
      nextTick(() => {
        selectedSinger.value = newSinger
        selectedAlbum.value = undefined
        selectedSong.value =undefined
        onUpdate()
      })
    }).onCancel(() => {
      onUpdate()
    })
  }

  const addNewAlbum = () => {
    Dialog.create({
      component: NewAlbumDialog,
    }).onOk((value: { name: string, year: number }) => {
      const newAlbum = {
        id: getRandomId(5),
        singerId: selectedSinger.value.id,
        name: value.name,
        year: value.year,
        songs: [],
      }
      appStore.addAlbum(newAlbum)
      nextTick(() => {
        selectedAlbum.value = newAlbum
        selectedSong.value = undefined
        onUpdate()
      })
    }).onCancel(() => {
      onUpdate()
    })
  }

  const addNewSong = () => {
    Dialog.create({
      component: NewSongDialog,
    }).onOk((name: string) => {
      const newSong = {
        id: getRandomId(5),
        name: name,
      }
      appStore.addSong(newSong)
      nextTick(() => {
        selectedSong.value = newSong
        onUpdate()
      })
    }).onCancel(() => {
      onUpdate()
    })
  }

  const filterSingers = (val: string, update: Function) => {
    update(() => searchSingerText.value = val)
  }
  const filterAlbums = (val: string, update: Function) => {
    update(() => searchAlbumText.value = val)
  }
  const filterSongs = (val: string, update: Function) => {
    update(() => searchSongText.value = val)
  }

  const onConfirmClick = () => {
    onDialogOK({ song: selectedSong.value, albumId: selectedAlbum.value.id })
  }
</script>

<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    class="add-song-dialog"
  >
    <q-card style="max-height: 50vh; width: 500px;">
      <q-card-section>
        <div class="text-h6">Добавление песни</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pr-xl">
        <q-select
          v-model="selectedSinger"
          label="Исполнитель*"
          stack-label
          hint="Выберите исполнителя"
          :reactive-rules="true"
          :rules="[val => !!val || 'Не может быть пустым!']"
          option-label="name"
          :options="singers"
          use-input
          @filter="filterSingers"
          @update:model-value="onUpdate('singer')"
        />
        <q-btn
          style="position: absolute; right: 8px; top: 40px;"
          size="sm"
          round
          outline
          icon="add"
          color="primary"
          @click="addNewSinger"
        >
          <q-tooltip class="bg-indigo-9 text-center" max-width="120px" anchor="top middle" self="bottom middle">
            Добавить нового исполнителя
          </q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="q-pr-xl">
        <q-select
          v-model="selectedAlbum"
          label="Альбом*"
          stack-label
          hint="Выберите альбом"
          :reactive-rules="true"
          :rules="[val => !!val || 'Не может быть пустым!']"
          option-label="name"
          :options="albums"
          :disable="!selectedSinger"
          use-input
          @filter="filterAlbums"
          @update:model-value="onUpdate('album')"
        />
        <q-btn
          style="position: absolute; right: 8px; top: 40px;"
          size="sm"
          round
          outline
          icon="add"
          color="primary"
          :disable="!selectedSinger"
          @click="addNewAlbum"
        >
          <q-tooltip v-if="selectedSinger" class="bg-indigo-9 text-center" max-width="120px" anchor="top middle" self="bottom middle">
            Добавить новый альбом
          </q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="q-pr-xl">
        <q-select
          v-model="selectedSong"
          label="Песня*"
          stack-label
          hint="Выберите песню"
          :reactive-rules="true"
          :rules="[val => !!val || 'Не может быть пустым!']"
          :options="songs"
          option-label="name"
          :disable="!selectedSinger || !selectedAlbum"
          use-input
          @filter="filterSongs"
          @update:model-value="onUpdate"
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps" :class="{ 'song-select-item--disabled': isSongSelectItemDisabled(scope.opt.id) }">
              <q-item-section>
                {{ scope.opt.name }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          style="position: absolute; right: 8px; top: 40px;"
          size="sm"
          round
          outline
          icon="add"
          color="primary"
          :disable="!selectedSinger || !selectedAlbum"
          @click="addNewSong"
        >
          <q-tooltip v-if="selectedSinger && selectedAlbum" class="bg-indigo-9 text-center" max-width="120px" anchor="top middle" self="bottom middle">
            Добавить новую песню
          </q-tooltip>
        </q-btn>
      </q-card-section>
      
      <p>{{ selectedSong }}</p>

      <q-separator />

      <dialog-actions
        :disabled="formDisable"
        @cancel="onDialogCancel"
        @confirm="onConfirmClick"
      />
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
  .song-select-item {
    &--disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
</style>

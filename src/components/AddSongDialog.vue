<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { Dialog, useDialogPluginComponent } from 'quasar'
  import { useAppStore } from '@/store/app.store'
  import NewSingerDialog from './NewSingerDialog.vue'
  import { getRandomId, entitiesSortFn } from '@/tools/helpers'

  // @ts-ignore
  const emits = defineEmits({
    ...useDialogPluginComponent.emitsObject,
  })
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const appStore = useAppStore()

  const formDisable = ref(true)
  const songName = ref('')
  const selectedSong = ref()
  const selectedSinger = ref()
  const selectedAlbum = ref()

  const singers = computed(() => Object.values(appStore.singers).sort((a, b) => entitiesSortFn(a, b)))
  const albums = computed(() => {
    if (!selectedSinger.value || !selectedSinger.value.id) {
      return []
    }
    return Object.values(appStore.albums)
      .filter(album => album.singerId === selectedSinger.value.id)
      .sort((a, b) => entitiesSortFn(a, b, 'year'))
  })
  const songs = computed(() => {
    const songsIds: string[] = albums.value
      .reduce((res, album) => {
        const { songs } = album
        res = [...res, ...songs]
        return res
      }, [] as string[])
      const uniqueSongsIds = Array.from(new Set(songsIds))
      return uniqueSongsIds.map(id => appStore.songs[id]).sort((a, b) => entitiesSortFn(a, b))
  })

  const onUpdate = (field?: string) => {
    console.log('onUpdate!')
    if (field === 'singer') {
      selectedAlbum.value = undefined
      selectedSong.value = undefined
    }

    formDisable.value = !(selectedSinger.value.id && selectedAlbum.value && selectedSong.value.id)
  }

  const addNewSinger = () => {
    Dialog.create({
      component: NewSingerDialog,
    }).onOk((name: string) => {
      const newSinger = { id: getRandomId(5), name }
      appStore.addSinger(newSinger)
      nextTick(() => {
        selectedSinger.value = newSinger
      })
    }).onCancel(() => {
      selectedSinger.value = undefined
    })
  }

  const addNewAlbum = () => {
    console.log('addNewAlbum!')
  }

  const addNewSong = () => {
    console.log('addNewSong!')
  }

  const onConfirmClick = () => {
    // TODO
    onDialogOK()
  }

  onMounted(() => {
    // @ts-ignore
    const { params = {} } = appStore.currentRoute
    const { singerId, albumId } = params
    console.log('onBeforeMount! ', singerId, albumId)
    if (singerId) {
      selectedSinger.value = singers.value.find(s => s.id === singerId)
    }
    if (albumId) {
      selectedAlbum.value = albums.value.find(a => a.id === albumId)
    }
  })
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
          @update:model-value="onUpdate"
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
          option-label="name"
          :options="songs"
          :disable="!selectedSinger"
          @update:model-value="onUpdate"
        />
        <q-btn
          style="position: absolute; right: 8px; top: 40px;"
          size="sm"
          round
          outline
          icon="add"
          color="primary"
          :disable="!selectedSinger"
          @click="addNewSong"
        >
          <q-tooltip v-if="selectedSinger" class="bg-indigo-9 text-center" max-width="120px" anchor="top middle" self="bottom middle">
            Добавить новую песню
          </q-tooltip>
        </q-btn>
      </q-card-section>

      <!-- <q-input
        v-model="songName"
        label="Название песни*"
        stack-label
        placeholder="Введите название песни"
        :reactive-rules="true"
        :rules="[val => !!val || 'Не может быть пустым!']"
        @update:model-value="onUpdate"
      /> -->

      <p>{{ selectedSinger }}</p>
      <p>{{ singers }}</p>

      <p>{{ selectedAlbum }}</p>
      <p>{{ albums }}</p>

      <p>{{ songs }}</p>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          size="sm"
          color="primary"
          label="Отменить"
          @click="onDialogCancel"
        />

        <q-btn
          size="sm"
          color="primary"
          label="Добавить"
          :disable="formDisable"
          @click="onConfirmClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
  .add-song-dialog {
    // TODO
  }
</style>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDialogPluginComponent } from 'quasar'

  // @ts-ignore
  const emits = defineEmits({
    ...useDialogPluginComponent.emitsObject,
  })
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const album = ref({
    name: '',
    year: 2000,
  })

  const onConfirmClick = () => {
    onDialogOK(album.value)
  }
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
    class="new-album-dialog"
  >
    <q-card style="max-height: 50vh; width: 500px;">
      <q-card-section>
        <div class="text-h6">Новый альбом</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          class="q-mb-lg"
          v-model="album.name"
          label="Название альбома*"
          stack-label
          placeholder="Введите название альбома"
        />

        <q-input
          class="q-mb-lg"
          v-model="album.year"
          type="number"
          label="Год выпуска альбома*"
          stack-label
          placeholder="Введите год выпуска альбома"
        />
      </q-card-section>

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
          :disable="!(album.name.length && album.year)"
          @click="onConfirmClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
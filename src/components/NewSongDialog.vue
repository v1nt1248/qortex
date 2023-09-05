<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDialogPluginComponent } from 'quasar'

  // @ts-ignore
  const emits = defineEmits({
    ...useDialogPluginComponent.emitsObject,
  })
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const name = ref('')

  const onConfirmClick = () => {
    onDialogOK(name.value)
  }
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
    class="new-song-dialog"
  >
    <q-card style="max-height: 50vh; width: 500px;">
      <q-card-section>
        <div class="text-h6">Новая песня</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          class="q-mb-lg"
          v-model="name"
          label="Название песни*"
          stack-label
          placeholder="Введите название песни"
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
          :disable="!name.length"
          @click="onConfirmClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDialogPluginComponent } from 'quasar'
  import DialogActions from './DialogActions.vue'

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

      <dialog-actions
        :disabled="!name.length"
        @cancel="onDialogCancel"
        @confirm="onConfirmClick"
      />
    </q-card>
  </q-dialog>
</template>
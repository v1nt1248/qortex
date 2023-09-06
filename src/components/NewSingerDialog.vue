<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDialogPluginComponent } from 'quasar'
  import DialogActions from './DialogActions.vue'

  // @ts-ignore
  const emits = defineEmits({
    ...useDialogPluginComponent.emitsObject,
  })
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const singer = ref('')

  const onConfirmClick = () => {
    onDialogOK(singer.value)
  }
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
    class="new-singer-dialog"
  >
    <q-card style="max-height: 50vh; width: 500px;">
      <q-card-section>
        <div class="text-h6">Новый исполнитель</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          class="q-mb-lg"
          v-model="singer"
          label="Имя исполнителя*"
          stack-label
          placeholder="Введите имя исполнителя"
        />
      </q-card-section>

      <q-separator />

      <dialog-actions
        :disabled="!singer.length"
        @cancel="onDialogCancel"
        @confirm="onConfirmClick"
      />
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDialogPluginComponent } from 'quasar'

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
          v-model="singer"
          label="имя исполнителя*"
          stack-label
          placeholder="Введите имя исполнителя"
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
          :disable="!singer.length"
          @click="onConfirmClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
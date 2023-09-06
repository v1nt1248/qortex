<script lang="ts" setup>
  const props = defineProps<{
    cancelButtonText?: string;
    confirmButtonText?: string;
    disabled?: boolean;
  }>()

  defineEmits(['cancel', 'confirm'])
</script>

<template>
  <q-card-actions align="right">
    <q-btn
      flat
      size="sm"
      color="primary"
      :label="props.cancelButtonText || 'Отменить'"
      @click="$emit('cancel')"
    />

    <q-btn
      size="sm"
      color="primary"
      :label="props.confirmButtonText || 'Добавить'"
      :disable="props.disabled"
      @click="$emit('confirm')"
    />
  </q-card-actions>
</template>
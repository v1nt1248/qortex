<script lang="ts" setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/store/app.store'

  const appStore = useAppStore()
  const singers = computed(() => Object.values(appStore.singers))
</script>

<template>
  <div class="singers">
    <div class="singers__title">Исполнители:</div>

    <q-list class="singers__list">
      <q-item
        v-for="(singer, index) in singers"
        :key="singer.id"
        clickable
        v-ripple
        :to="`/singers/${singer.id}`"
        exact
        :class="[
          'singers__item',
          { 'singers__item--odd': !(index % 2) },
        ]"
      >
        <q-item-section>{{  singer.name }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
  .singers {
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

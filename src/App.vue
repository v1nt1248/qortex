<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { Dialog } from 'quasar'
  import { useAppStore } from '@/store/app.store'
  import AddSongDilog from '@/components/AddSongDialog.vue'

  const appStore = useAppStore()

  const breadcrumbs = computed(() => appStore.breadcrumbs)
  // @ts-ignore
  const currentRoutePath = computed(() => appStore.currentRoute.fullPath)
 
  const selectBreadcrumb = (index: number) => {
    if (index < (breadcrumbs.value.length - 1)) {
      const newBreadcrumbs = breadcrumbs.value.slice(0, index + 1)
      appStore.setBreadcrumbs(newBreadcrumbs)
    }
  }

  const addSong = () => {
    console.log('ADD SONG')

    Dialog.create({
      component: AddSongDilog,
    })
  }

  watch(
    () => currentRoutePath.value,
    (val, oldValue = '') => {
      if (val !== oldValue && val.length > oldValue.length) {
        // @ts-ignore
        const { params = {} } = appStore.currentRoute
        const { singerId, albumId } = params
        if (!singerId && !albumId) {
          return
        }

        const { name } = singerId && albumId
          ? appStore.albums[albumId]
          : appStore.singers[singerId]
        const path = singerId && albumId
          ? `/singers/${singerId}/${albumId}`
          : `/singers/${singerId}`

        const currentBreadcrumbs = appStore.breadcrumbs
        const newBreadcrumbs = [...currentBreadcrumbs, { name, path }]
        appStore.setBreadcrumbs(newBreadcrumbs)
      }
    },
    { immediate: true },
  )
</script>

<template>
  <div class="app">
    <div class="app__toolbar">
      <q-breadcrumbs>
        <q-breadcrumbs-el
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          :label="breadcrumb.name"
          :to="breadcrumb.path"
          :class="[
            'app__breadcrumb',
            { 'app__breadcrumb--disabled': index === breadcrumbs.length - 1 },
          ]"
          @click="selectBreadcrumb(index)"
        />
      </q-breadcrumbs>

      <q-btn
        size="sm"
        color="primary"
        label="Добавить песню"
        @click="addSong"
      />
    </div>
    
    <div class="app__content">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  
  </div>
</template>

<style lang="scss" scoped>
  .app {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;

    &__toolbar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    &__breadcrumb {
      font-size: 16px;
      font-weight: 500;
      font-style: italic;

      &--disabled {
        pointer-events: none;
        cursor: default;
      }

      &:hover {
        color: #0090ec;
      }
    }

    &__content {
      position: relative;
      height: calc(100% - 60px);
    }
  }
</style>

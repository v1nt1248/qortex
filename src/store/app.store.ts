import { defineStore } from 'pinia'
import singers from '@/data/singers-initial.json'
import albums from '@/data/albums-initial.json'
import songs from '@/data/songs-initial.json'

export const useAppStore = defineStore(
  'app',
  {
    state: (): {
      singers: Record<string, Singer>;
      albums: Record<string, Album>;
      songs: Record<string, Song>;
      breadcrumbs: BreadcrumbValue[];
    } => ({
      singers,
      albums,
      songs,
      breadcrumbs: [{
        name: 'Начальная страница',
        path: '/',
      }]
    }),

    getters: {
      albumsBySinger(state): Record<string, Album> {
        // @ts-ignore
        const { params = {} } = state.currentRoute
        const { singerId } = params

        return Object.values(state.albums)
          .reduce((res, item) => {
            if (item.singerId === singerId) {
              res[item.id] = item
            }
            return res
          }, {} as Record<string, Album>)
      },
    },

    actions: {
      setBreadcrumbs(value: BreadcrumbValue[]) {
        this.breadcrumbs = value
      },
      addSinger(singer: Singer) {
        console.log('addSinger: ', singer)
        this.singers[singer.id] = singer
      },
      addAlbum(album: Album) {
        console.log('addAlbum: ', album)
        this.albums[album.id] = album
      },
      updateAlbum<T extends keyof Album>({ id, field, value }: { id: string, field: T, value: Album[T] }) {
        if (this.albums[id]) {
          this.albums[id][field] = value
        }
      },
      addSong(song: Song) {
        console.log('addSong: ', song)
        this.songs[song.id] = song
      },
    },
  }
)

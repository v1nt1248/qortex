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
      allUndistributedSongs(state): string[] {
        const songsIds = Object.values(state.albums).reduce((res, album) => {
          const { songs } = album
          res = [...res, ...songs]
          return res
        }, [] as string[])
        const distributedSongs = Array.from(new Set(songsIds))
        const allSongsIds = Object.keys(state.songs)
        return allSongsIds.reduce((res, id) => {
          if (!distributedSongs.includes(id)) {
            res.push(id)
          }
          return res
        }, [] as string[])
      }
    },

    actions: {
      setBreadcrumbs(value: BreadcrumbValue[]) {
        this.breadcrumbs = value
      },
      addSinger(singer: Singer) {
        this.singers[singer.id] = singer
      },
      addAlbum(album: Album) {
        this.albums[album.id] = album
      },
      updateAlbum<T extends keyof Album>({ id, field, value }: { id: string, field: T, value: Album[T] }) {
        if (this.albums[id]) {
          this.albums[id][field] = value
        }
      },
      addSong(song: Song) {
        this.songs[song.id] = song
      },
    },
  }
)

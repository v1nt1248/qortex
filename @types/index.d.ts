interface Singer {
  id: string;
  name: string;
}

interface Album {
  id: string;
  singerId: string;
  name: string;
  year: number;
  songs: string[];
}

interface Song {
  id: string;
  name: string;
}

interface BreadcrumbValue {
  name: string;
  path: string;
}

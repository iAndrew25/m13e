const tilesetimg = new Image();
tilesetimg.src = "../assets/m13e.png";
const tilesetimgbg = new Image();
tilesetimgbg.src = "../assets/m13e-bg.png";

const tilesetBg = { "columns":2,
    "image": tilesetimgbg,
    "imageheight":16,
    "imagewidth":32,
    "margin":0,
    "name":"m13e-bg",
    "spacing":0,
    "tilecount":2,
    "tiledversion":"1.11.0",
    "tileheight":16,
    "tilewidth":16,
    "type":"tileset",
    "version":"1.10"
   }

const tileset = { "columns":2,
    "image": tilesetimg,
    "imageheight":48,
    "imagewidth":32,
    "margin":0,
    "name":"m13e",
    "spacing":0,
    "tilecount":6,
    "tiledversion":"1.11.0",
    "tileheight":16,
    "tilewidth":16,
    "type":"tileset",
    "version":"1.10"
   }

export {
    tileset,
    tilesetBg
}
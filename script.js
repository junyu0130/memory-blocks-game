const iconSet = [
  "at",
  "apple",
  "archive",
  "box",
  "bug",
  "badge-vr",
  "bag-plus",
  "bootstrap",
  "bluetooth",
  "battery-full",
  "bookmark-check",
  "cpu",
  "cast",
  "camera",
  "code-slash",
  "cloud-slash",
  "camera-video",
  "calendar-heart",
  "clipboard-pulse",
  "chat-square-quote",
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(iconSet);

class Blocks {
  constructor(iconSet, mode) {
    this.imgData = iconSet.slice(0, 8).concat(iconSet.slice(0, 8));
    this.mode = mode;
  }

  setImg() {
    shuffle(this.imgData);
    this.imgData.forEach((d, i) => {
      $(".blocks." + this.mode + " .block" + i + " i").addClass("bi-" + d);
    });
  }

  flipImg(index) {
    $(".blocks." + this.mode + " .block" + index + " i").fadeToggle(
      100,
      () => {}
    );
  }
}

var b = new Blocks(iconSet, "x4");
b.setImg();

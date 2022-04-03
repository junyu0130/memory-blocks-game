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
    this.mode = mode;
    this.size = Math.pow(Number(this.mode[1]), 2);
    this.imgData = iconSet
      .slice(0, this.size / 2)
      .concat(iconSet.slice(0, this.size / 2));
  }

  setImg() {
    shuffle(this.imgData);
    this.imgData.forEach((d, i) => {
      $(".blocks." + this.mode + " .block" + i + " i").addClass("bi-" + d);
    });
  }

  flipImg(index) {
    $(".blocks." + this.mode + " .block" + index + " i").fadeToggle(100);
  }
}

class Game {
  constructor() {
    this.blocks = new Blocks(iconSet, "x4");
    this.setTiming(0, 30);
    this.ansSet = [];
    this.status = "waiting";
  }

  setTiming(min, sec) {
    this.timing = (min * 60 + sec) * 1000;
  }

  setAnsSet() {
    iconSet.slice(0, this.blocks.size / 2).forEach((icon) => {
      this.ansSet.push([
        this.blocks.imgData.indexOf(icon),
        this.blocks.imgData.lastIndexOf(icon),
      ]);
    });
  }

  hideAllImg() {
    for (let i = 0; i < this.blocks.size; i++) {
      if (
        $(".blocks." + this.blocks.mode + " .block" + i + " i").css(
          "display"
        ) != "none"
      ) {
        this.blocks.flipImg(i);
      }
    }
  }

  startUserInput() {
    this.userInput = [];
    this.status = "userInput";
  }

  sendInput(inputNum) {
    if (this.status == "userInput") {
      if (
        $(".blocks." + this.blocks.mode + " .block" + inputNum + " i").css(
          "display"
        ) == "none"
      ) {
        this.blocks.flipImg(inputNum);
        this.userInput.push(inputNum);
        this.userInput.sort((a, b) => a - b);
        console.log(this.userInput);
      }

      if (this.userInput.length == 2) {
        if (
          this.ansSet.findIndex(
            (ans) => ans[0] == this.userInput[0] && ans[1] == this.userInput[1]
          ) != -1
        ) {
          console.log("correct!");
          // correct sound
        } else {
          console.log("wrong");
        }
        this.userInput = [];
      }
    }
  }

  startGame() {
    // set image
    this.blocks.setImg();

    // setup answer set
    this.setAnsSet();

    // // start timer
    // setTimeout(() => {
    //   // hide all image
    //   this.hideAllImg();
    // }, this.timing);

    // start and check answer
    this.startUserInput();
  }
}

var g = new Game();
g.startGame();

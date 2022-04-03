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

var soundSet = [
  { name: "correct", set: [1, 3, 5, 8] },
  { name: "wrong", set: [2, 4, 5.5, 7] },
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
  constructor(setAssign) {
    this.blocks = new Blocks(iconSet, "x4");
    this.setTiming(0, 30);
    this.ansSet = [];
    this.status = "waiting";
    this.soundSet = setAssign.map((d, i) => ({
      name: d.name,
      // Convert digital arrays to Audio arrays
      set: d.set.map((pitch) => this.getAudio(pitch)),
    }));
  }

  playSet(type) {
    let set = this.soundSet.find((set) => set.name == type).set;
    set.forEach((obj) => {
      obj.currentTime = 0;
      obj.play();
    });
  }

  getAudio(pitch) {
    return new Audio(
      "https://awiclass.monoame.com/pianosound/set/" + pitch + ".wav"
    );
  }

  setTiming(min, sec) {
    this.timing = (min * 60 + sec) * 1000;
  }

  getNormalTime(ms) {
    let min = parseInt(ms / 60000);
    let sec = parseInt((ms % 60000) / 1000);
    return `${min}:${sec}`;
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

  setMessage(msg) {
    console.log(msg);
    $(".status").text(msg);
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
          this.playSet("correct");
        } else {
          console.log("wrong");
          // wrong sound
          this.playSet("wrong");
        }
        this.userInput = [];
      }
    }
  }

  startGame() {
    // hide start game btn
    $(".startBtn").addClass("hide");

    // set image
    this.blocks.setImg();

    // setup answer set
    this.setAnsSet();

    // start timer
    var timer = setInterval(() => {
      this.setMessage("Time left: " + this.getNormalTime(this.timing));
      if (this.timing == 0) {
        clearInterval(timer);

        // hide all image
        this.hideAllImg();

        // start and check answer
        this.startUserInput();
      }
      this.timing -= 1000;
    }, 1000);
  }
}

var g = new Game(soundSet);

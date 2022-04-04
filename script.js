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
  constructor(setAssign, level, mode, timeSec) {
    this.blocks = new Blocks(iconSet, mode);
    this.setTiming(0, timeSec);
    this.ansSet = [];
    this.ansCount = [0, 0];
    this.status = "waiting";
    this.level = level;
    this.soundSet = setAssign.map((d, i) => ({
      name: d.name,
      // Convert digital arrays to Audio arrays
      set: d.set.map((pitch) => this.getAudio(pitch)),
    }));
  }

  clsImg() {
    this.blocks.imgData.forEach((d, i) => {
      $(".blocks." + this.blocks.mode + " .block" + i + " i").removeClass(
        "bi-" + d
      );
    });
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
    $(".status").html(msg);
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
      }

      if (this.userInput.length == 2) {
        if (
          this.ansSet.findIndex(
            (ans) => ans[0] == this.userInput[0] && ans[1] == this.userInput[1]
          ) != -1
        ) {
          // correct sound
          this.playSet("correct");
          // calculate correct count
          this.ansCount[1] += 1;
        } else {
          // wrong sound
          this.playSet("wrong");
          this.ansCount[0] += 1;
        }
        this.setMessage(
          `Correct: ${this.ansCount[1]}<br/>Wrong: ${this.ansCount[0]}`
        );
        this.userInput = [];
      }

      // end game
      if (this.ansCount[0] + this.ansCount[1] == this.blocks.size / 2) {
        setTimeout(() => {
          var isReplay = window.confirm("Do you want to play the next game?");
          if (isReplay) {
            let timeLeft = 5000;
            var timer = setInterval(() => {
              $(".status").toggleClass("flash");
              this.setMessage(
                "OK, next game begin in: " + this.getNormalTime(timeLeft)
              );
              if (timeLeft == 0) {
                clearInterval(timer);
                startPlay("replay");
              }
              timeLeft -= 1000;
            }, 1000);
          }
        }, 500);
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

var g = undefined;
var nowLevel = 1;
var nowMode = "x4";
var nowTimeSec = 40;

function changeBlocksMode(newMode) {
  if (newMode != g.blocks.mode) {
    $(".blocks." + g.blocks.mode).addClass("hide");
    $(".blocks." + newMode).removeClass("hide");
  }
}

function startPlay(status) {
  if (status == "replay") {
    g.clsImg();
    nowLevel++;
    if (nowLevel % 3 == 0) {
      nowMode = "x6";
      changeBlocksMode(nowMode);
    } else {
      nowMode = "x4";
      changeBlocksMode(nowMode);
    }

    nowTimeSec -= 20;
    if (nowTimeSec == 0) {
      nowTimeSec = 60;
    }
  }
  $(".level").text("Level " + nowLevel);
  shuffle(iconSet);
  g = new Game(soundSet, nowLevel, nowMode, nowTimeSec);
  g.startGame();
}

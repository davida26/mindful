// Make sure this runs when the DOM has loaded
document.addEventListener("DOMContentLoaded", function() {
  // Is this running now? lets test it with console.log()
  console.log("This is running!");

  // Part I - lets setup our variables
  // get all the buttons, originally declared as var but since they dont change we can change to const
  const buttons = document.querySelectorAll(".btn");
  console.log(buttons);

  // the big play button, can be updated to css vs svg
  const play = document.querySelector(".play");

  // We want to be able to capture the entire div of time selections to hide/show based on step
  const timeSelection = document.querySelector(".time-selections");
  console.log(timeSelection); // returns the .time-selections div

  // And do the same thing with the timer area
  const timerArea = document.querySelector(".session");
  console.log(timerArea); // returns the .session div

  // And set the element we want to feed the time into
  const display = document.querySelector("#timer");

  // lastly, lets add the song selector
  const song = document.querySelector(".song");

  // Part 2 - move to timer screen after selecting a time without a reload, start countdown
  buttons.forEach(function(option) {
    option.addEventListener("click", function() {
      duration = this.getAttribute("data-time");
      timer = new CountDownTimer(duration);
      timeObj = new CountDownTimer(duration);
      format(timeObj.minutes, timeObj.seconds);
      timer.onTick(format);

      // hide the buttons
      timeSelection.style.display = "none";
      // swap button to pause
      // play.src = "./svg/pause.svg";
      // show the timer
      timerArea.style.display = "block";
      // start the timer
      timer.start();

      if (timer.expired != true) {
        song.play();
      }
    });
  });

  // Part 3 - Time Calculations and Sound Stop (needs refactoring)
  // Time is interesting this was more complex than I thought. Need to review this.
  // Source: https://stackoverflow.com/a/20618517/6143357
  function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
  }

  CountDownTimer.prototype.start = function() {
    if (this.running) {
      return;
    }
    this.running = true;
    var start = Date.now(),
      that = this,
      diff,
      obj;

    (function timer() {
      diff = that.duration - (((Date.now() - start) / 1000) | 0);

      if (diff > 0) {
        setTimeout(timer, that.granularity);
      } else {
        diff = 0;
        that.running = false;
        song.pause();
      }

      obj = CountDownTimer.parse(diff);
      that.tickFtns.forEach(function(ftn) {
        ftn.call(this, obj.minutes, obj.seconds);
      }, that);
    })();
  };

  CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === "function") {
      this.tickFtns.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.expired = function() {
    return !this.running;
  };

  CountDownTimer.parse = function(seconds) {
    return {
      minutes: (seconds / 60) | 0,
      seconds: seconds % 60 | 0
    };
  };

  // Timer Format
  function format(minutes, seconds) {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    document.title = `${minutes}:${seconds} | Mindful`;
  }
});

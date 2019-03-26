const headerOptions = {
  strings: ["<b>Minutes Made.</b>"],
  typeSpeed: 75,
  showCursor: false
};

const defaultTypedOpts = {
  typeSpeed: 75,
  startDelay: 2500,
  showCursor: false,
  backSpeed: 10,
  backDelay: 2000
};

const l1Options = {
  ...defaultTypedOpts,
  strings: ["<b>Meetings <i>Streamlined.</i></b>"]
};

const l2Options = {
  ...defaultTypedOpts,
  showCursor: true,
  loop: true,
  strings: [
    "<i>Automated Meeting Transcribing</i>",
    "<i>Automated Speaker Labeling</i>",
    "<i>Automated Action Item Detection</i>",
    "<i>Slack and Jira Integrations</i>",
    "<i>Encrypted Transcription Storage</i>",
    "<i>Organized Meeting History</i>",
    "<i>Automated Meeting Tagging</i>"
  ]
};

anime({
  targets: [".whiteLine"],
  width: "40%",
  easing: "easeInOutQuad",
  loop: "false",
  duration: "1000"
});

setTimeout(anime, 2000, {
  targets: [".whiteLineDelayed"],
  width: "100%",
  easing: "easeInOutQuad",
  loop: "false",
  duration: "1000"
});

var headerTyped = new Typed(".header", headerOptions);
var line1 = new Typed(".l1", l1Options);
var line2 = new Typed(".l2", l2Options);

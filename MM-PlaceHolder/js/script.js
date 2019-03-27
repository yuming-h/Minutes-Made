const descriptionStrings = [
  "<i>\u25CF Automated Meeting Transcribing</i>",
  "<i>\u25CF Automated Speaker Labeling</i>",
  "<i>\u25CF Automated Action Item Detection</i>",
  "<i>\u25CF Slack and Jira Integrations</i>",
  "<i>\u25CF Encrypted Transcription Storage</i>",
  "<i>\u25CF Organized Meeting History</i>",
  "<i>\u25CF Automated Meeting Tagging</i>"
];

const descriptionDelays = [5000, 6500, 8000, 9500, 11000, 12500, 14000];

const defaultTypedOpts = {
  typeSpeed: 25,
  startDelay: 3300,
  showCursor: false,
  backSpeed: 10,
  backDelay: 1500
};

const headerOptions = {
  strings: ["<b>Minutes Made.</b>"],
  typeSpeed: 75,
  showCursor: false,
  startDelay: 1400
};

const l1Options = {
  ...defaultTypedOpts,
  strings: ["<b>Meetings <i>Streamlined.</i></b>"]
};

const l2Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[0],
  strings: [descriptionStrings[0]]
};

const l3Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[1],
  strings: [descriptionStrings[1]]
};

const l4Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[2],
  strings: [descriptionStrings[2]]
};

const l5Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[3],
  strings: [descriptionStrings[3]]
};

const l6Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[4],
  strings: [descriptionStrings[4]]
};

const l7Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[5],
  strings: [descriptionStrings[5]]
};

const l8Options = {
  ...defaultTypedOpts,
  startDelay: descriptionDelays[6],
  strings: [descriptionStrings[6]]
};

const footerOptions = {
  strings: ["<b>Coming Soon!</b>"],
  typeSpeed: 75,
  showCursor: false,
  startDelay: 15500
};

//Page animation
anime({
  targets: [".page"],
  height: "650px",
  width: "500px",
  easing: "easeInOutQuad",
  loop: "false",
  duration: "1000"
});

//Header Line animation
setTimeout(anime, 1500, {
  targets: [".whiteLine"],
  width: "70%",
  easing: "easeInOutQuad",
  loop: "false",
  duration: "1000"
});

setTimeout(anime, 17000, {
  targets: [".underline"],
  width: "65%",
  easing: "easeInOutQuad",
  loop: "false",
  duration: "500"
});

//Body Lines animation
setTimeout(anime, 2200, {
  targets: [".whiteLineDelayed"],
  width: "90%",
  easing: "easeInOutQuad",
  loop: "false",
  duration: "1000",
  delay: anime.stagger(200)
});

var headerTyped = new Typed(".header", headerOptions);
var line1 = new Typed(".l1", l1Options);
var line2 = new Typed(".l2", l2Options);
var line3 = new Typed(".l3", l3Options);
var line4 = new Typed(".l4", l4Options);
var line5 = new Typed(".l5", l5Options);
var line6 = new Typed(".l6", l6Options);
var line7 = new Typed(".l7", l7Options);
var line8 = new Typed(".l8", l8Options);
var footerTyped = new Typed(".footer", footerOptions);

/*
setTimeout(() => {
  line2.stop()
  line2.showCursor = true;
  line2.startDelay = 0;
  line2.reset();
}, 5000);
*/

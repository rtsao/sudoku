var $ = require('jquery');

$.Velocity.RegisterUI("transition.cellInvalid", {
    defaultDuration: 500,
    calls: [ 
        [ { backgroundColorAlpha:255, backgroundColorBlue:"-=150", backgroundColorGreen:"-=150" }, .7],
        [ { rotateY: "180deg", opacity: 0 } ],
    ],
    reset: {
      opacity: 1,
      backgroundColorBlue: "+=150",
      backgroundColorGreen: "+=150",
      backgroundColorAlpha: 0,
      rotateY: 0
    }
});

$.Velocity.RegisterUI("callout.sectionInvalid", {
    defaultDuration: 500,
    calls: [ 
        [ { outlineColorAlpha: 1 } ],
        [ { outlineColorAlpha: 0 } ],
    ]
});

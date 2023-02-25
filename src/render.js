
window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let c_one = document.getElementById("c_one");
let c_two = document.getElementById("c_two");
var inittopPosition_one = 100;
var initleftPosition_one = 100;
var inittopPosition_two = 100;
var initleftPosition_two = 300;

function saveToJson(buttons) {
    // create an empty object to store the button data
    var buttonData = {};
  
    // loop through the buttons array and add each button to the object
    for (var i = 0; i < buttons.length; i++) {
      buttonData[i] = buttons[i].value;
    }
  
    // convert the object to a JSON string
    return buttonData;
  }
  

async function update() {
    var gamepads = navigator.getGamepads();
    for (var i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i];
        if (gamepad) {
            //console.log("Buttons: ", gamepad.buttons);
            //console.log("Axes: ", gamepad.axes);
            var buttons = saveToJson(gamepad.buttons);
            var axes = gamepad.axes;
            let to_send = {
                "buttons": buttons,
                "axes": axes
            }

            // Updating Squares
            var topPosition = inittopPosition_one + axes[1]*20;
            var leftPosition = initleftPosition_one + axes[0]*20;
            c_one.style.top = topPosition + "px";
            c_one.style.left = leftPosition + "px";

            topPosition = inittopPosition_two + axes[3]*20;
            leftPosition = initleftPosition_two + axes[2]*20;
            c_two.style.top = topPosition + "px";
            c_two.style.left = leftPosition + "px";

            fetch('http://localhost:3000/controller', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(to_send)
                })
               .then(response => response.json())
               .then(response => console.log(JSON.stringify(response)))
        }
    }
    await sleep(100);
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
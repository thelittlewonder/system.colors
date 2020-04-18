// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

function hex2rgb(hex: string): number[] {
  return [Number('0x' + hex[1] + hex[2]) | 0, Number('0x' + hex[3] + hex[4]) | 0, Number('0x' + hex[5] + hex[6])| 0];
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-palette') {
    const colorsFrame = figma.createFrame();
    const frameHeight = 148
    const frameWidth = (msg.colorsList.length * 124) + 24;
    colorsFrame.resizeWithoutConstraints(frameWidth, frameHeight);
    colorsFrame.name = msg.name + " Colors"
    for (let i = 0; i < msg.colorsList.length; i++) {
      const rect = figma.createRectangle();
      rect.y = 24;
      rect.x = 24 + (i * 124);
      let rgbColor = hex2rgb(msg.colorsList[i]);
      rect.name = msg.name + "-" + i
      rect.fills = [{type: 'SOLID', color: {r: rgbColor[0]/255, g: rgbColor[1]/255, b: rgbColor[2]/255}}];
      figma.currentPage.appendChild(rect);
      colorsFrame.appendChild(rect);
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

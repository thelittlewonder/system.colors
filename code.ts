// This shows the HTML page in "ui.html".
figma.showUI(__html__,{ width: 300, height: 300 });

//function to convert hex color code to RGB because figma takes fill input as RGB
function hex2rgb(hex: string): number[] {
  return [Number('0x' + hex[1] + hex[2]) | 0, Number('0x' + hex[3] + hex[4]) | 0, Number('0x' + hex[5] + hex[6])| 0];
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  if (msg.type === 'create-palette') {
    const nodes: SceneNode[] = [];
    //create frame
    const colorsFrame = figma.createFrame();
    //set height and width with 24px padding
    const frameHeight = 148
    const frameWidth = (msg.colorsList.length * 124) + 24;
    colorsFrame.resizeWithoutConstraints(frameWidth, frameHeight);
    //set frame name
    colorsFrame.name = msg.name + " Colors"
    colorsFrame.x = figma.viewport.center.x
    colorsFrame.y = figma.viewport.center.y
    //loop to create color rectangles
    for (let i = 0; i < msg.colorsList.length; i++) {
      const rect = figma.createRectangle();
      rect.y = 24;
      rect.x = 24 + (i * 124);
      let rgbColor = hex2rgb(msg.colorsList[i]);
      rect.name = msg.name + "-" + i
      rect.fills = [{type: 'SOLID', color: {r: rgbColor[0]/255, g: rgbColor[1]/255, b: rgbColor[2]/255}}];
      figma.currentPage.appendChild(rect);
      colorsFrame.appendChild(rect);
      nodes.push(rect);
    }
    colorsFrame.setRelaunchData({ rerun: 'Add another palette' });
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  figma.closePlugin();
};

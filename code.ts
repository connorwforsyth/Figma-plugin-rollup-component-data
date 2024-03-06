figma.showUI(__html__);

figma.ui.resize(400, 900);

figma.ui.onmessage = () => {
  let count = {};
  // Recursive function to identify each of the variants and children.
  function printChildNames(node: InstanceNode) {
    if ("children" in node) {
      for (let child of node.children) {
        if ("characters" in child) {
          let text;
          if (child.name === child.characters) {
            text = { [child.name]: true };
            if (text[child.name] === true) {
              if (child.name in count) {
                count[child.name]++;
              } else {
                count[child.name] = 1;
              }
            }
          } else {
            text = { [child.name]: child.characters };
          }
        }
        // Call printChildNames only for the current child
        printChildNames(child as InstanceNode);
      }
    }
  }

  const node = figma.currentPage.selection;
  let n = 0;

  //count the selected elements on the page.
  for (let i = 0; i < node.length; i++) {
    n++;
  }

  console.log(`There are ${n} items selected.`);

  // Check if the selection is a component variable.
  let totalInstances = 0;
  let nonInstance = 0;

  for (let i = 0; i < node.length; i++) {
    node[i];
    if (node[i].type === "INSTANCE") {
      totalInstances++;
      printChildNames(node[i]);
    } else {
      nonInstance++;
    }
  }

  // render text
  renderText(totalInstances, nonInstance, count);
};

// Text function
async function renderText(totalInstances: any, nonInstance: any, count: any) {
  await figma.loadFontAsync({
    family: "Inter",
    style: "Regular",
  });
  const nodes: SceneNode[] = [];
  let text = figma.createText();
  // Load the font in the text node before setting the characters
  text.characters = `The TOTAL component instances: ${totalInstances}. The COUNT OF variants is as follows: ${JSON.stringify(
    count
  )}`;
  text.fontSize = 256;
  text.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
  nodes.push(text);
  console.log(count);
  figma.viewport.scrollAndZoomIntoView(nodes);
  figma.closePlugin();
}

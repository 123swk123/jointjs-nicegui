export default {
  template: `
  <!-- some comment -->
  <div class="canvas" ref="canvas"></div>
`,

  setup() {
    console.log("JointJS setup");
    const canvas = Vue.ref(null);
    const graph = new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      },
    );
    const paper = new joint.dia.Paper({
      model: graph,
      background: {
        color: "#F8F9FA",
      },
      frozen: true,
      async: true,
      cellViewNamespace: joint.shapes,
    });
    const rect = new joint.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 50 },
      attrs: {
        label: {
          text: "Hello World",
        },
      },
    });
    graph.addCell(rect);
    return { canvas, graph, paper, rect };
  },
  mounted() {
    console.log("JointJS mounted");
    this.canvas = this.$refs.canvas;
    this.canvas.appendChild(this.paper.el);
    this.paper.unfreeze();
    let rect2 = this.rect.clone();
    rect2.translate(300, 300);
    rect2.attr("label/text", "My Connection");
    rect2.addTo(this.graph);
    new joint.shapes.standard.Link({
      source: { id: this.rect.id },
      target: { id: rect2.id },
      attrs: {
        line: {
          stroke: "blue",
          strokeWidth: 2,
        },
      },
    }).addTo(this.graph);
  },
};

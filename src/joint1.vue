<script lang="ts">
import "@joint/plus/joint-plus.css";

// import { ref, onMounted } from "vue";
// import { dia, ui, shapes } from "@joint/plus";

// required for development time testing
let Vue: typeof import('vue')
await import('vue').then(v => { Vue = v }).catch(console.error)
let joint: typeof import('@joint/plus')
await import('@joint/plus').then(j => { joint = j }).catch(console.error)
// required for development time testing

export default {
  setup() {
    console.log("JointJS Plus setup");
    const canvas = Vue.ref<Element | null>(null);

    const graph = new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      }
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

    // this is available only in JointJS plus
    const scroller = new joint.ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: "grab",
    });

    scroller.render();

    // Create a rectangle shape with a label in it
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

    return { canvas, graph, paper, scroller, rect };
    // return { canvas, graph, paper, rect };
  },

  mounted() {
    console.log("JointJS Plus mounted");
    this.canvas = this.$refs.canvas as Element;
    // for JointJS plus
    this.canvas.appendChild(this.scroller.el);
    this.scroller.center();
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
      }
    }).addTo(this.graph);
  },
};
</script>

<template>
  <!-- some comment -->
  <div class="canvas" ref="canvas"></div>
</template>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  zoom: 100%;
}

.canvas:deep(.joint-paper) {
  border: 1px solid #a0a0a0;
}
</style>
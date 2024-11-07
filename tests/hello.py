import os
from pathlib import Path
from nicegui import ui, events
from nicegui.element import Element

os.environ.update({"MATPLOTLIB": "false"})
USE_JOINT_PLUS = os.environ.get("USE_JOINT_PLUS", "false").lower() == "true"

JOINT_JS_VUE_PATH = Path(__file__).parent.joinpath(
    "joint1_vue.js" if USE_JOINT_PLUS else "joint2_vue.js"
)
JOINT_JS_MODULE_PATH = (
    Path("L:/jointjs-vue-2/node_modules/@joint/plus")
    if USE_JOINT_PLUS
    else Path("L:/joint/packages/joint-core/dist")
)
JOINT_JS_PATH = (
    JOINT_JS_MODULE_PATH.joinpath("joint-plus.js")
    if USE_JOINT_PLUS
    else JOINT_JS_MODULE_PATH.joinpath("joint.js")
)
JOINT_IMPORT_NAME = "joint-plus" if USE_JOINT_PLUS else "joint"


class CJoint(
    Element,
    component=JOINT_JS_VUE_PATH,
    dependencies=[JOINT_JS_PATH],
):
    """Initialize CJoint."""

    def __init__(self):
        super(CJoint, self).__init__()
        if USE_JOINT_PLUS:
            self.add_resource(JOINT_JS_MODULE_PATH)
            ui.add_head_html(
                f'<link href="{self._props['resource_path']}/joint-plus.css" rel="stylesheet" type="text/css"/>'
            )
        ui.add_body_html(
            f'<script type="module">import * as _ from "{JOINT_IMPORT_NAME}";</script>'
        )


ui.add_css(
    """
 
.canvas {
  width: 100%;
  height: 100%;
  zoom: 100%;
}

.canvas:deep(.joint-paper) {
  border: 1px solid #a0a0a0;
}

"""
)
objJoint = CJoint()

ui.run(
    host="127.0.0.1",
    viewport="width=device-width, initial-scale=1, user-scalable=no",
    dark=True,
    uvicorn_logging_level="info",
    show=False,
    reload=True,
    uvicorn_reload_includes="*.js,*.vue",
)

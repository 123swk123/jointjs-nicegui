import os
from pathlib import Path
from nicegui import ui, events
from nicegui.element import Element

os.environ.update({"MATPLOTLIB": "false"})
USE_JOINT_PLUS = os.environ.get("USE_JOINT_PLUS", "true").lower() == "true"

PARENT_PATH=Path(__file__).parents[1]
CWD_PATH=Path(__file__).parent

JOINT_JS_VUE_PATH = CWD_PATH.joinpath(
    "joint1_vue.js" if USE_JOINT_PLUS else "joint2_vue.js"
)
JOINT_JS_MODULE_PATH = (
    PARENT_PATH.joinpath("node_modules/@joint/plus")
    if USE_JOINT_PLUS
    else PARENT_PATH.joinpath("node_modules/@joint/core/dist")
)
JOINTJS_FILE_NAME = "joint-plus.js" if USE_JOINT_PLUS else "joint.js"
JOINT_JS_PATH = JOINT_JS_MODULE_PATH.joinpath(JOINTJS_FILE_NAME)
RESOURCE_PATH = CWD_PATH.joinpath("resources")

class CJoint(
    Element,
    component=JOINT_JS_VUE_PATH,
    default_classes="nicegui-jointjs",
    # default_style='position: fixed;',
    # dependencies=[JOINT_JS_PATH],
):
    """Initialize CJoint."""

    def __init__(self):
        super(CJoint, self).__init__()
        self.add_resource(RESOURCE_PATH)
        # if USE_JOINT_PLUS:
        #     ui.add_head_html(
        #         f'<link href="{self._props['resource_path']}/joint-plus.css" rel="stylesheet" type="text/css"/>'
        #     )
        ui.add_body_html(
            f'<script src="{self._props['resource_path']}/{JOINTJS_FILE_NAME}"/>'
        )
        print(self._style)


ui.add_css(RESOURCE_PATH.joinpath("joint-plus.css"))
ui.add_css(
    """
.nicegui-jointjs {
  position: fixed;
}
 
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
    host="0.0.0.0",
    viewport="width=device-width, initial-scale=1, user-scalable=no",
    dark=False,
    uvicorn_logging_level="info",
    show=False,
    reload=True,
    uvicorn_reload_includes="*.js,*.vue",
)

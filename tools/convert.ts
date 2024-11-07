import fs from "fs";
import { fileURLToPath, URL } from "url";
import { parse, compileScript, compileTemplate } from "@vue/compiler-sfc";
import {
  baseCompile,
  baseParse,
  ParserOptions,
  RootNode,
} from "@vue/compiler-core";
import ts from "typescript";
import { argv } from "process";
import path from "path";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// <template>, <script>, <script setup>, <style>, <style scoped>, <style module>, and <custom-block>

const convertVueTsToJs = (filePath: string) => {
  const COMPONENT_START = "export default {";
  const content = fs.readFileSync(filePath, "utf-8");
  const { descriptor } = parse(content);
  // const { descriptor } = parse(content, {
  //   templateParseOptions: {
  //     comments: false,
  //   },
  //   compiler: {
  //     compile(source, options) {
  //       options.comments = false;
  //       console.log("options", options);
  //       return baseCompile(source, options);
  //     },
  //     parse: function (template: string, options: ParserOptions): RootNode {
  //       options.comments = false;
  //       return baseParse(template, options);
  //     },
  //   },
  // });
  const compiled = compileScript(descriptor, { id: "xxx", isProd: true });
  const transpiled = ts.transpileModule(compiled.content, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      jsx: ts.JsxEmit.Preserve,
      removeComments: true,
    },
  });
  // if (descriptor.template) {
  //   // compiles the template html to render function code
  //   const templateCompiled = compileTemplate({
  //     filename: filePath,
  //     source: descriptor.template.content,
  //     id: "xxx",
  //     isProd: true,
  //     compilerOptions: { comments: false },
  //   });
  //   console.log("templateCompiled", templateCompiled);
  // }

  // console.log(descriptor);
  // console.log(`\nCompiled output:\n${compiled.content}`);
  // console.log(`\nTranspiled output:\n${transpiled.outputText}`);

  const template = `\ntemplate: \`${descriptor.template ? descriptor.template.content : ""}\`,\n`;
  const start_of = transpiled.outputText.indexOf(COMPONENT_START);
  const newContent =
    transpiled.outputText.slice(start_of, start_of + COMPONENT_START.length) +
    template +
    transpiled.outputText.slice(start_of + COMPONENT_START.length);
  // <style>
  //   ${descriptor.styles[0].content}
  // </style>`;

  //   if (descriptor.scriptSetup && descriptor.scriptSetup.lang === "ts") {
  //     const jsContent = compiled.content.replace('lang="ts"', 'lang="js"');
  //     newContent = content.replace(
  //       descriptor.scriptSetup.content,
  //       jsContent
  //     );
  //   }
  const outfile_path = path.join(
    __dirname,
    "../tests/",
    path.basename(filePath.replace(".vue", "_vue.js"))
  );

  console.info(`Saving to: ${outfile_path}`);
  fs.writeFileSync(outfile_path, newContent, "utf-8");
};

convertVueTsToJs(fileURLToPath(new URL(argv[2], import.meta.url)));

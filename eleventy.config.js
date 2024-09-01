import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import * as sass from 'sass';
import picture from "./src/utils/picture.js";
import lazypicture from "./src/utils/lazy-picture.js";

/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
export default function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/*');
  eleventyConfig.addPassthroughCopy('src/*.{css,js,jpg,ico}');
  
  // syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: "md"
  });
  
  // Sass pipeline
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function(contents, includePath) {
      let includePaths = [this.config.dir.includes];
      return () => {
        let ret = sass.renderSync({
          file: includePath,
          includePaths,
          data: contents,
          outputStyle: "compressed"
        });
        return ret.css.toString("utf8");
      }
    }
  });
  
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  
  // A responsive image helper using Netlify Large Media - image transformation
  eleventyConfig.addShortcode("picture", picture);
  // A lazy loading image helper using Netlify Large Media - image transformation
  eleventyConfig.addShortcode("lazypicture", lazypicture);
  
  // pass some assets right through
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/site/images");
  eleventyConfig.addPassthroughCopy("src/site/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy('src/*.{css,js,jpg,ico}');
  
  
  return {
    dir: {
      input: "src/site",
      output: 'dist',
      includes: "_includes",
      layouts: "_includes/layouts"
    },
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };
}
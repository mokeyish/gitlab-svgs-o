/**
 * @typedef { import('svgo').OptimizeOptions } OptimizeOptions
 */

/**
 * @type { OptimizeOptions } svgo options
 */
export default {
  plugins: [
    // {
    //   removeViewBox: false,
    //   addAttributesToSVGElement: true
    // },
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [
          {
            fill: "currentColor",
          },
        ],
      },
    },
    {
      name: "removeAttributesBySelector",
      params: {
        selectors: [
          {
            selector: 'svg>*[fill="#000"]',
            attributes: ["fill"],
          },
          {
            selector: 'svg>*[fill="#000000"]',
            attributes: ["fill"],
          }
        ],
      },
    },
  ],
};

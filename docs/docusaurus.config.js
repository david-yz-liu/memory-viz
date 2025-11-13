// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "MemoryViz",
    tagline: "Generator for Python memory model diagrams",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://www.cs.toronto.edu/",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/~david/memory-viz/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    // organizationName: 'facebook', // Usually your GitHub org/user name.
    // projectName: 'docusaurus', // Usually your repo name.

    onBrokenLinks: "ignore",

    markdown: {
        hooks: {
            onBrokenMarkdownLinks: "warn",
        },
    },

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: "./sidebars.js",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/david-yz-liu/memory-viz/tree/main/docs",
                },
                blog: false,
                // blog: {
                //   showReadingTime: true,
                //   // Please change this to your repo.
                //   // Remove this to remove the "edit this page" links.
                //   editUrl:
                //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                // },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: "img/docusaurus-social-card.jpg",
            navbar: {
                title: "MemoryViz",
                logo: {
                    alt: "MemoryViz Logo",
                    src: "img/logo.svg",
                },
                items: [
                    {
                        type: "docSidebar",
                        sidebarId: "tutorialSidebar",
                        position: "left",
                        label: "Docs",
                    },
                    {
                        href: "https://github.com/david-yz-liu/memory-viz",
                        label: "GitHub",
                        position: "right",
                    },
                ],
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Docs",
                                to: "/api",
                            },
                        ],
                    },
                    // {
                    //   title: 'Community',
                    //   items: [
                    //     {
                    //       label: 'Stack Overflow',
                    //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                    //     },
                    //     {
                    //       label: 'Discord',
                    //       href: 'https://discordapp.com/invite/docusaurus',
                    //     },
                    //     {
                    //       label: 'Twitter',
                    //       href: 'https://twitter.com/docusaurus',
                    //     },
                    //   ],
                    // },
                    {
                        title: "More",
                        items: [
                            // {
                            //   label: 'Blog',
                            //   to: '/blog',
                            // },
                            {
                                label: "GitHub",
                                href: "https://github.com/david-yz-liu/memory-viz",
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} David Liu. Built with Docusaurus.`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
            },
        }),
    plugins: [
        [
            "docusaurus-plugin-typedoc",

            // Plugin / TypeDoc options
            {
                entryPoints: ["../memory-viz/src/user_functions.ts"],
                readme: "none",
                tsconfig: "../tsconfig.json",
            },
        ],
    ],
};

export default config;

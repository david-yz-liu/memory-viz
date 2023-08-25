// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Memory Models Rough",
    tagline: "Generator for Python memory model diagrams",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://www.cs.toronto.edu/",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/~david/memory-models-rough/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    // organizationName: 'facebook', // Usually your GitHub org/user name.
    // projectName: 'docusaurus', // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
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
                    routeBasePath: "/",
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/david-yz-liu/memory-models-rough/tree/main/docs",
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
                    customCss: require.resolve("./src/css/custom.css"),
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
                title: "Memory Models Rough",
                logo: {
                    alt: "Memory Models Rough Logo",
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
                        href: "https://github.com/david-yz-liu/memory-models-rough",
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
                                href: "https://github.com/david-yz-liu/memory-models-rough",
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} David Liu. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
    plugins: [
        [
            "docusaurus-plugin-typedoc",

            // Plugin / TypeDoc options
            {
                entryPoints: ["../src/user_functions.js"],
                tsconfig: "../jsconfig.json",

                out: "99-api",
            },
        ],
    ],
};

module.exports = config;

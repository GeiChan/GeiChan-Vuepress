module.exports = {
    title: '给给给给',
    description: "给给给给's blog, powered by VuePress, themed by Gungnir.",
    theme: 'vuepress-theme-gungnir',
    head: [
        ["link", { rel: "icon", href: "/img/logo.png" }],
        [
            "meta",
            {
                name: "viewport",
                content: "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    dest: 'geichan',
    themeConfig: {
        base: '/GeiChan-Vuepress/',
        repo: 'GeiChan/GeiChan-Vuepress',
        docsBranch: 'master',
        docsDir: 'docs',
        // 作者信息
        personalInfo: {
            name: "艾 略", // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
            avatar: "/img/avatar.jpeg", // 必须：头像，将在首页和移动端侧边栏显示
            description: '「过去」这玩意儿却总是会不断的捆绑住一个人真正想追求的平静',  // 必须：个人简介，将在首页显示
            sns: {
                github: "GeiChan",
                email: "wml19970930@gmail.com"
            }
        },
        // 首页
        homeHeaderImages: {
            local: [
                {
                    "path": "/img/home-bg/bg_1.jpeg",
                    "mask": "rgba(40, 57, 101, .4)"
                }
            ]
        },
        pages: {
            // 链接页配置
            links: {
                // 可选：链接页副标题
                subtitle: '吼哇朋友们，这是链接页',

                // 可选：链接页封面图路径和蒙版
                bgImage: {
                    path: '/img/home-bg/bg_1.jpeg',
                    mask: 'rgba(64, 118, 190, 0.5)'
                }
            }
        },
        search: true,  // 可选：是否启用搜索，默认：true
        searchMaxSuggestions: 10,  // 可选：搜索的最大结果数，默认：10
        searchPlaceholder: "瞧一瞧，看一看啦，绝对没有空的",  // 可选：搜索栏占位文本，默认："$ grep ..."
        searchIcon: "ri-search-2-line",  // 可选：搜索图标
        footer: `
                  &copy; <a href="https://github.com/Renovamen" target="_blank">艾 略</a> 2022-2023
                  <br>
                  Powered by <a href="https://vuepress.vuejs.org" target="_blank">VuePress</a> &
                  <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
                `,
        sidebar: [],
        nav: [
            {
                text: 'Home',
                link: '/',
                icon: "fa-fort-awesome"
            },
            {
                text: "About",
                link: "/about/",
                icon: "fa-paw"
            }
        ],
        pages: {
            // 链接页配置
            // links: {
            //     title: "Links",
            //     // 可选：链接页副标题
            //     subtitle: '吼哇朋友们，这是链接页',
            //
            //     // 可选：链接页封面图路径和蒙版
            //     bgImage: {
            //         path: '/img/home-bg/bg_1.jpeg',
            //         mask: 'rgba(64, 118, 190, 0.5)'
            //     }
            // }
        },
        mdPlus: {
            all: true
        },
        // readingTime: {
        //     excludes: ["/about", "/links"]
        // }
    }
}
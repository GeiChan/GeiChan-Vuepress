const { gungnirTheme } = require("vuepress-theme-gungnir")
// const { PlayerPluginOptions } = require("vuepress-plugin-player")
const { giscusPlugin } = require("vuepress-plugin-giscus")
// @ts-ignore
import { defineUserConfig } from 'vuepress'
import { viteBundler } from "@vuepress/bundler-vite"

export default defineUserConfig({
    title: '艾 略',
    description: "一个被社会抛弃的人.",
    head: [
        // 引入 logo 图片
        ['link', { rel: 'icon', href: '/img/logo.png' }],
        // 引入 思源 字体
        ['link', { rel: 'stylesheet', href: '/fonts/font.scss' }],
        // 引入 Fira Code 字体
        // ['link', { rel: 'stylesheet', href: '/fonts/FiraCode-Regular.ttf' }]
    ],
    theme: gungnirTheme({
        // 左上角标题
        navbarTitle: "艾 略",
        repo: "GeiChan/geichan.github.io",
        docsBranch: "main",
        docsDir: 'docs',
        // 一言
        hitokoto: true,
        // 对所有博客文章页启用或禁用目录, 可选，默认：true
        catalog: true,

        // 作者信息
        personalInfo: {
            name: "艾 略", // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
            avatar: "/img/avatar.jpeg", // 必须：头像，将在首页和移动端侧边栏显示
            description: '他没有留下适合作遗像的照片，只有一个人形。', // 必须：个人简介，将在首页显示
            sns: {
                // github: "Renovamen",
                // linkedin: "xiaohan-zou",
                // facebook: "renovamen.zou",
                // twitter: "renovamen_zxh",
                // zhihu: "chao-neng-gui-su",
                // email: "renovamenzxh@gmail.com",
                // rss: "/rss.xml"
            }
        },

        // 首页
        homeHeaderImages: [
            {
                "path": "/img/home-bg/background.jpg",
                "mask": "rgba(40, 57, 101, .3)"
            }
        ],

        // 导航栏配置项
        navbar: [
            {
                text: "首页",
                link: "/",
                icon: "fa-fort-awesome"
            },
            {
                text: "时间轴",
                link: "/tags/",
                icon: "fa-tag"
            },
            {
                text: "链接库",
                link: "/links/",
                icon: "fa-satellite-dish"
            }
        ],

        pages: {
            tags: {
                title: 'Time Travel',
                subtitle: "希望和悲伤，都是一缕光。",
                bgImage: {
                    path: "/img/pages/tags_bgc.jpg",
                    mask: "rgba(64, 118, 190, 0.2)"
                }
            },
            links: {
                title: 'Links',
                // 可选：链接页副标题
                subtitle: '只不过是个人日常使用地址而已',

                // 可选：链接页封面图路径和蒙版
                bgImage: {
                    path: "/img/pages/links_bgc.png",
                    mask: "rgba(64, 118, 190, 0.5)"
                }
            }
        },

        // 每页文章容量
        blogNumPerPage: 10,

        bundler: viteBundler(),

        // 搜索设置
        searchText: "检索",

        themePlugins: {
            search: {
                locales: {
                    "/": {
                        placeholder: "瞧一瞧，看一看啦，绝对没有空的"
                    }
                },
                maxSuggestions: 10
            },
            container: {
                // 卡片链接中关闭域名显示
                link: {
                    siteDomain: false  // 可选，默认："true"
                }
            },
            // markdown 增强
            mdPlus: {
                all: true
            }
        },

        // 页脚
        footer: `
                  &copy; 艾 略 2021-2022
                  <br>
                  Powered by <a href="https://vuepress.vuejs.org" target="_blank">VuePress</a> &
                  <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
                `
    }),

    plugins: [
        giscusPlugin({
            repo: "GeiChan/geichan.github.io",  // 必须，string，格式：user_name/repo_name
            repoId: "R_kgDOH55h7Q",  // 必须，string，在 Giscus 官网上生成
            category: "Announcements",  // 必须，string
            categoryId: "DIC_kwDOH55h7c4CX4Yd",  // 必须，string，在 Giscus 官网上生成
            mapping: "title",  // 可选，string，default="title"
            reactionsEnabled: "true",  // 可选，boolean，default=true
            theme: "preferred_color_scheme", // 可选，string，default="light"
            lang: "auto",  // 可选，string，default="auto"（跟随网站语言，如果 Giscus 不支持你的网站的语言，则会使用 "en"）
            lazyLoad: true,  // 可选，boolean，default=false（如果设为 true，Giscus 的加载将延迟到用户滚动到评论容器附近）
            crossorigin: "anonymous"  // 可选，string，default="anonymous"
        }),

        // 歌单插件
        // https://github.com/blog-aurora/vuepress-theme-aurora/tree/master/Aurora-plugin/vuepress-plugin-player
        // playerPlugin({
        //     // 是否开启播放的歌曲来源于网易云歌单
        //     showPlaylist: false,
        //     //是否禁用网易云音乐，如果你选择禁用，那么就将使用本地的歌曲，请传入链接
        //     disabledNetEaseMusic: true,
        //     //网易云单个歌单id
        //     songIds: [],
        //     //网易云歌单id 只有开启播放歌单才有效 showPlaylist: true
        //     playlist: '',
        //     // 向网易云请求数据时的接口
        //     serverUrl: 'http://localhost:8000',
        //     //本地歌曲
        //     localSongs: {
        //         // 所有的歌曲封面，如果你使用本地歌曲
        //         // 对于一些歌曲或者你需要配置的本地歌曲很多
        //         // 你不想单独的为每一首歌曲指定封面图
        //         // 那么你可以配置此项
        //         // 当那首歌没有配置封面的时候
        //         // 就会使用该项配置的图片url作为封面图
        //         coverUrl: '',
        //         // 本地歌曲集合
        //         songs: [
        //             {
        //                 // 放在docs/.vuepress/public/bgm 目录里下的 mp3 文件
        //                 path: '/bgm/面会菜_林生祥_.mp3',
        //                 // 歌曲名称
        //                 songName: '面会菜',
        //                 // 单独为这首歌配置封面图
        //                 cover: '/img/bgm/面会菜.png'
        //             }
        //         ]
        //     }
        // })
    ]
})

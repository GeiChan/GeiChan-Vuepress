const { gungnirTheme } = require("vuepress-theme-gungnir")
import { defineUserConfig } from 'vuepress'
import { viteBundler } from "@vuepress/bundler-vite"
// const { giscusPlugin } = require("vuepress-plugin-giscus")

export default defineUserConfig({
    title: '肚财',
    description: "肚财，一个被社会抛弃的人.",
    head: [['link', { rel: 'icon', href: '/img/logo.png' }]],
    theme: gungnirTheme({
        // 左上角标题
        // navbarTitle: "肚财",
        repo: "GeiChan/gei.github.io",
        docsBranch: "main",
        docsDir: 'docs',
        // 一言
        hitokoto: true,
        // 对所有博客文章页启用或禁用目录, 可选，默认：true
        catalog: true,

        // 作者信息
        personalInfo: {
            name: "肚 财", // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
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
                "path": "/img/home-bg/background2.png",
                "mask": "rgba(40, 57, 101, .4)"
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
                subtitle: "Black Sheep Wall",
                bgImage: {
                    path: "/img/pages/tags.jpg",
                    mask: "rgba(211, 136, 37, .5)"
                }
            },
            links: {
                title: '友链',
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
        // dynamicTitlePlugin({
        //     showIcon: '', // The icon displayed when the document is in the current tab.
        //     showText: '(/≧▽≦/)咦！又好了！', // The title displayed when the document is in the current tab.
        //     hideIcon: '', // The icon displayed when the document is not in the current tab.
        //     hideText: '(●—●)喔哟, 崩溃啦！', // The title displayed when the document is not in the current tab.
        //     recoverTime: 2000, // The time to recover the title after the tab is changed.
        // }),
        // [
        //     // 歌单插件
        //     // https://github.com/blog-aurora/vuepress-theme-aurora/tree/master/Aurora-plugin/vuepress-plugin-player
        //     'player', {
        //         //是否禁用网易云音乐，如果你选择禁用，那么就将使用本地的歌曲，请传入链接
        //         disabledNetEaseMusic: true,
        //         //网易云单个歌单id
        //         songIds: [],
        //         //网易云歌单id 只有开启播放歌单才有效 showPlaylist: true
        //         playlist: '',
        //         // 是否开启播放的歌曲来源于网易云歌单
        //         showPlaylist: false,
        //         // 向网易云请求数据时的接口
        //         serverUrl: 'http://localhost:8000',
        //         //本地歌曲
        //         localSongs: {
        //             // 所有的歌曲封面，如果你使用本地歌曲
        //             // 对于一些歌曲或者你需要配置的本地歌曲很多
        //             // 你不想单独的为每一首歌曲指定封面图
        //             // 那么你可以配置此项
        //             // 当那首歌没有配置封面的时候
        //             // 就会使用该项配置的图片url作为封面图
        //             coverUrl: '',
        //             // 本地歌曲集合
        //             songs: [
        //                 {
        //                     // 放在docs/.vuepress/public/bgm 目录里下的 mp3 文件
        //                     path: '/bgm/面会菜_林生祥_.mp3',
        //                     // 歌曲名称
        //                     songName: '面会菜',
        //                     // 单独为这首歌配置封面图
        //                     cover: '/img/bgm/面会菜.png'
        //                 }
        //             ]
        //         }
        //     }
        // ]
    ]
})

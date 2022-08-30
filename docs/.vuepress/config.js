// const { gungnirTheme } = require("vuepress-theme-gungnir")

module.exports = {
    title: '肚财',
    description: "肚财，一个被社会抛弃的人.",
    head: [['link', { rel: 'icon', href: '/img/logo.png' }]],
    theme: "gungnir",
    themeConfig: {

        // 左上角标题
        // navbarTitle: "肚财",

        docsDir: 'docs',

        // 对所有博客文章页启用或禁用目录, 可选，默认：true
        catalog: false,

        // 作者信息
        personalInfo: {
            name: "肚 财", // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
            avatar: "/img/avatar2.png", // 必须：头像，将在首页和移动端侧边栏显示
            description: '他没有留下适合作遗像的照片，只有一个人形。' // 必须：个人简介，将在首页显示
        },


        // 首页
        homeHeaderImages: [
            {
                "path": "/img/home-bg/background.png",
                "mask": "rgba(40, 57, 101, .4)"
            }
        ],

        // 每页文章容量
        blogNumPerPage: 10,


        // 导航栏配置项
        navbar: [
            {
                text: "Home",
                link: "/",
                icon: "hi-solid-home"
            },
            {
                text: "Links",
                link: "/links/",
                icon: "hi-solid-link"
            }
        ],

        pages: {
            links: {
                // 可选：链接页副标题
                subtitle: '一些好用的工具 / 影视连接',

                // 可选：链接页封面图路径和蒙版
                bgImage: {
                    path: "/img/pages/links_bgc.png",
                    mask: "rgba(64, 118, 190, 0.5)"
                }
            }
        },

        // 搜索设置
        searchText: "Search",
        searchIcon: "ri-search-2-line",  // 可选：搜索图标
        searchMaxSuggestions: 10,  // 可选：搜索的最大结果数，默认：10
        searchPlaceholder: "瞧一瞧，看一看啦，绝对没有空的",  // 可选：搜索栏占位文本，默认："$ grep ..."


        themePlugins: {
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
    },
    // theme >= 2.0.0-alpha.23 的配置方式
    // theme: gungnirTheme({
    //     // 左上角标题
    //     // navbarTitle: "肚财",
    //
    //
    // }),
    plugins: [
        [
            // 歌单插件
            // https://github.com/vuepress-aurora/vuepress-theme-aurora/tree/master/Aurora-plugin/vuepress-plugin-player
            'player', {
                //是否禁用网易云音乐，如果你选择禁用，那么就将使用本地的歌曲，请传入链接
                disabledNetEaseMusic: true,
                //网易云单个歌单id
                songIds: [],

                //网易云歌单id 只有开启播放歌单才有效 showPlaylist: true
                playlist: '',

                // 是否开启播放的歌曲来源于网易云歌单
                showPlaylist: false,

                // 向网易云请求数据时的接口
                serverUrl: 'http://localhost:8000',

                //本地歌曲
                localSongs: {
                    // 所有的歌曲封面，如果你使用本地歌曲
                    // 对于一些歌曲或者你需要配置的本地歌曲很多
                    // 你不想单独的为每一首歌曲指定封面图
                    // 那么你可以配置此项
                    // 当那首歌没有配置封面的时候
                    // 就会使用该项配置的图片url作为封面图
                    coverUrl: '',
                    // 本地歌曲集合
                    songs: [
                        {
                            // 放在docs/.vuepress/public/bgm 目录里下的 mp3 文件
                            path: '/bgm/面会菜_林生祥_.mp3',
                            // 歌曲名称
                            songName: '面会菜',
                            // 单独为这首歌配置封面图
                            cover: '/img/bgm/面会菜.png'
                        }
                    ]
                }
            }
        ]
    ]
}
const { gungnirTheme } = require("vuepress-theme-gungnir");

module.exports = {
    title: '肚财',
    description: "肚财，一个被社会抛弃的人.",
    head: [['link', { rel: 'icon', href: '/img/logo.png' }]],
    theme: gungnirTheme({
        // 左上角标题
        navbarTitle: "肚财",

        docsDir: 'docs',

        // 对所有博客文章页启用或禁用目录, 可选，默认：true
        catalog: false,

        // 作者信息
        personalInfo: {
            name: "肚 财", // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
            avatar: "/img/logo.png", // 必须：头像，将在首页和移动端侧边栏显示
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


        // 导航栏配置项
        searchText: "Search",
        searchMaxSuggestions: 10,  // 可选：搜索的最大结果数，默认：10
        searchPlaceholder: "瞧一瞧，看一看啦，绝对没有空的",  // 可选：搜索栏占位文本，默认："$ grep ..."
        searchIcon: "ri-search-2-line",  // 可选：搜索图标


        themePlugins: {
            container: {
                // 卡片链接中关闭域名显示
                link: {
                    siteDomain: false  // 可选，默认："true"
                },
                // markdown 增强
                mdPlus: {
                    all: true
                }
            }
        },


        // 页脚
        footer: `
                  &copy; 艾 略 2021-2022
                  <br>
                  Powered by <a href="https://vuepress.vuejs.org" target="_blank">VuePress</a> &
                  <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
                `
    })
}
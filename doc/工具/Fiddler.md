Fiddler 是一个使用 C# 编写的 http 抓包工具。Fiddler是以代理WEB服务器的形式工作的，原理是在打开 Fiddler 后，Fiddler 自动设置好浏览器的代理，通过改写 HTTP 代理，让数据从Fiddler通过，来监控并且截取到数据。

## 常用功能

* Filters(过滤监控)

    通过切换到Filters标签勾选Use filter，定制过滤规则并激活过滤器，以便抓取希望抓到的包。其中
    * Zone：指定只显示内网（Intranet）或互联网（Internet）的内容
    * Host：指定显示某个域名下的会话

* Composer（构造器）

    请求构可以模拟请求，借助Fiddler的Composer 在不改动开发环境实际代码的情况下修改请求中的参数值并且重新调用一次该请求，将该请求鼠标拖入右侧Request Builder标签内并修改原请求参数，然后点击Execute按钮再次触发调用请求

* AutoResponder 用法（拦截指定请求，并返回自定义数据）

    AutoResponder能够将页面原本需要调用的资源指向其他资源(你能够控制的资源或者可以引用到的资源)。打开 AutoResponder 标签设置，勾选前面两个复选框，开启 Fiddler 的请求自动重定向功能。enable rule的作用是开启或禁用自动重定向功能，我们就可以在下面添加重定向规则了。
第二个复选框框勾上时，不影响那些没满足我们处理条件的请求。

* 低网速模式 

   通过Rules > Performance > Stimulate Modem Speeds能够进行低网速模拟设置，低网速模拟有时出于兼容性考虑或者对某处进行性能优化，在低网速下往往能较快发现问题所在也容易发现性能瓶颈。
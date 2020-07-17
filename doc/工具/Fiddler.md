Fiddler 是一个使用 C# 编写的 http 抓包工具。Fiddler是以代理WEB服务器的形式工作的，原理是在打开 Fiddler 后，Fiddler 自动设置好浏览器的代理，通过改写 HTTP 代理，让数据从Fiddler通过，来监控并且截取到数据。

## 常用功能

* Filters(过滤监控)

    通过切换到Filters标签勾选Use filter，定制过滤规则并激活过滤器，以便抓取希望抓到的包。其中
    * Zone：指定只显示内网（Intranet）或互联网（Internet）的内容
    * Host：指定显示某个域名下的会话

* Composer（构造器）

    请求构可以模拟请求，借助Fiddler的Composer 在不改动开发环境实际代码的情况下修改请求中的参数值并且重新调用一次该请求，将该请求鼠标拖入右侧Request Builder标签内并修改原请求参数，然后点击Execute按钮再次触发调用请求

* AutoResponder 用法（拦截指定请求，并返回自定义数据）

    AutoResponder能够将页面原本需要调用的资源指向其他资源(你能够控制的资源或者可以引用到的资源)。打开 AutoResponder 标签设置，勾选前面两个复选框，开启 Fiddler 的请求自动重定向功能。enable rule的作用是开启或禁用自动重定向功能，我们就可以在下面添加重定向规则了。Unmatched request passthrounght复选框框勾上时，那些没满足我们处理条件的请求便不会受到影响。然后点击add rule定义重定向规则以及respond的内容。

* 解密 HTTPS 的网络数据

    通常来说，我们无法查看捕获到的https请求的数据，但fiddler可以通过伪造 CA 证书来欺骗浏览器和服务器，从而实现解密 HTTPS 数据包的目的。大概原理就是在浏览器面前 Fiddler 伪装成一个 HTTPS 服务器，而在真正的 HTTPS 服务器面前 Fiddler 又装成浏览器。方法：Tools -> Telerik Fiddler Options->Decrypt HTTPS Traffic并进行证书的安装。

* 抓取移动设备的数据包

    在电脑与移动设备处于同一局域网的情况下，我们可以通过Fiddler抓取移动设备的数据包。步骤：Tools –> Telerik Fiddler Options -> Allow remote computers to connect，将移动端的代理设置为 PC 的 IP 和端口，并访问该地址，点击FiddlerRoot certificate下载并安装证书。

* 低网速模式 

   通过Rules > Performance > Stimulate Modem Speeds能够进行低网速模拟设置，低网速模拟有时出于兼容性考虑或者对某处进行性能优化，在低网速下往往能较快发现问题所在也容易发现性能瓶颈。

#### 先上效果图
![对话框页面](https://upload-images.jianshu.io/upload_images/13434832-4464c22f847fc815.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/350)
![聊天列表](https://upload-images.jianshu.io/upload_images/13434832-942c468f10e04173.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/350)



## 预览

在线demo [VueSocial](http://47.107.66.252:3001/public/dist/#/home)（移动端最好使用浏览器打开，pc端按了f12后有个小问题，刷新一下就好,resize触发的问题，待改进）
如果想自己试验下可以打开两个浏览器进行聊天

[github地址](https://github.com/CBDxin/VueSocial)

## 引入socket. io


**服务端:**

```

  let serve = app.listen(3001);

  const io = socketio(serve);

  io.on('connection', socket => {

    socket.on('login', (username) => {

                console.log(username+'上线了！');

            });

  }

```

**客户端:**

在index中引入

```
<script src="http://47.107.66.252:3001/socket.io/socket.io.js"></script>

    <script type="text/javascript">

      const socket = io.connect('http://47.107.66.252:3001');

    </script>
```
## 整体思路
把需要用到的数据存放在vuex中，在app.vue的updateBySocket()函数中整体监听服务端emit的事件，根据路由信息判断数据是要做一般处理还是交给对话框页面进行处理

## 核心代码
### 服务端（express实现）
```
        let serve = app.listen(3001);
        const io = socketio(serve);
        io.on('connection', socket => {
            const socketId = socket.id;
            //登录时建立一个username到socketId的映射表
            socket.on('login', (username) => {
                socketHandler.saveUserSocketId(username, socketId)
            });

            socket.on('chat',(data) => {
                Idtoid.findOne({
                    username: data.to_user
                }).then((rs) => {
                //根据用户名在映射表中找到对应的socketId
                    io.to(rs.socketid).emit('receiveMsg',{
                        from_user:data.from_user,
                        message:data.message,
                        time:data.time,
                        avater:data.avater,
                        _id:data._id
                    })
                })
            })
        })
```
### app.vue
`update_chatList`:更新聊天列表的mutation
```
...mapMutations([
        'update_chatList'
      ]),
updateBySocket() {
        socket.removeAllListeners();
        socket.on('receiveMsg', (data) => {
          let from_user = data.from_user;
          //如果当前页面为与from_user的对话框，则交由对话框页面处理
          if (this.$route.query.chatwith == from_user) {
            return;
          }
          this.update_chatList(data);
        })
      }
```
### 对话框页面 chat.vue
`dataList`：当前对话框的聊天记录
```
//发送消息
      sendMessage() {
        if (!this.userInfo._id){
          Toast("请先登录！");
          return;
        }
        if (this.content == '') {
          return;
        }
        this.axios.post('/chat/chatwith', {//向后端传输聊天记录
          chatWithId: this.tUserInfo._id,
          user_id: this.userInfo._id,
          content: this.content
        }).then((result) => {
          //把自己发送的内容更新到dataList中
          this.dataList.push({
            user_id: {//这个有点乱了，这个是自己的信息
              avater: this.userInfo.avater
            },
            chatWith: {
              _id: this.chatWithId
            },
            addTime: Date.now(),
            content: this.content
          });
          //更新聊天用户的列表
          this.update_chatList({
            _id: this.tUserInfo._id,//自己的id
            from_user: this.chatWith,//与你聊天的用户
            message: this.content,//消息内容
            time: Date.now(),//时间);
            me: true,//判别是不是自己发送的
            avater:this.tUserInfo.avater
          });
          //要发送给对方的数据
          let data = {
            from_user: this.userInfo.username,//发送方
            to_user: this.chatWith,//接收方
            message: this.content,//消息内容
            time: Date.now(), //时间);
            avater: this.userInfo.avater,
            _id: this.userInfo._id
          };
          socket.emit('chat', data);
          this.content = '';
        })
      },
      updateBySocket() {
        socket.on('receiveMsg', (data) => {
          //判断一下是不是当前的对话框
          if (data.from_user == this.chatWith) {
            //把收到的消息保存到聊天记录中
            this.dataList.push({
              chatWith: {
                _id: this.userInfo._id
              },
              user_id: {//自己的信息
                avater: data.avater
              },
              addTime: data.addTime,
              content: data.message
            });
            this.update_chatList({
              _id: this.tUserInfo._id,
              from_user: this.chatWith,//与你聊天的用户
              message: data.message,//消息内容
              time: data.addTime,//时间);
              me: true,//判别是不是自己当前页面
              avater:this.tUserInfo.avater
            });
          }
        })
      }
```

## vuex mutation.js
```
[types.UPDATE_CHATLIST](state, data) {
    let flag = 0;//判断新的聊天是否存在于当前的列表中
    state.chatList.forEach((item)=>{
      if (item.chatWith.username == data.from_user) {
        flag = 1;
        if (!data.me) {//判断当前是否在对话框页面中
          item.unread++;
          state.unread++;
        }
        //更新
        item.content = data.message;
        item.addTime = data.time;
        //按添加时间排序
        state.chatList.sort((a, b) => {
          return new Date(b.addTime) - new Date(a.addTime)
        });
        //跳出循环
        return false;
      }
    });
    //是新的并且不在对话框页面
    if (!flag&&!data.me) {
      //添加到第一条
      state.chatList.unshift({
        chatWith: {
          avater: data.avater,
          username: data.from_user,
          _id: data._id
        },
        addTime: data.time,
        content: data.message,
        unread: 1
      });
        state.unread++;
    }else if (!flag&&data.me){//新的并且在对话框页面，不需要增加unread
      state.chatList.unshift({
        chatWith: {
          avater: data.avater,
          username: data.from_user,
          _id: data._id
        },
        addTime: data.time,
        content: data.message,
      });
    }
  }
```

## 总结
socket.io的简单使用其实并不难，只要掌握好以下几个函数

`socket.emit()`：向建立该连接的客户端发送消息

`socket.on()`：监听客户端发送信息

`io.to(socketid).emit()`：向指定客户端发送消息

`socket.broadcast.emit()`：向除去建立该连接的客户端的所有客户端广播

`io.sockets.emit()`：向所有客户端广播

如果你对这个项目有兴趣，你可以去看看我的另一篇文章[VueSocial(仿微博、微信的聊天社交平台）](https://www.jianshu.com/p/8095f7b0d5a9)

完整的代码请到我的github中查看
[github地址](https://github.com/CBDxin/VueSocial)

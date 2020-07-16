## 先上效果图 
![在这里插入图片描述](http://upload-images.jianshu.io/upload_images/13434832-feff467a6508693c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 上代码
html部分主要是借助了weui的样式
```
<template>
  <div>
    <myheader :title="'发布动态'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
    </myheader>
    <div class="upload">
      <div v-if="userInfo._id">
        <!--图片上传-->
        <div class="weui-gallery" id="gallery">
          <span class="weui-gallery__img" id="galleryImg"></span>
          <div class="weui-gallery__opr">
            <a href="javascript:" class="weui-gallery__del">
              <i class="weui-icon-delete weui-icon_gallery-delete"></i>
            </a>
          </div>
        </div>
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <textarea class="weui-textarea" v-model="content" placeholder="你想说啥" rows="3"></textarea>
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <div class="weui-uploader">
                <div class="weui-uploader__bd">
                  <ul class="weui-uploader__files" id="uploaderFiles">
                    <li ref="files" class="weui-uploader__file" v-for="(image,index) in images" :key="index"
                        :style="'backgroundImage:url(' + image +' )'"><span @click="deleteimg(index)" class="x">&times;</span></li>
                  </ul>
                  <div v-show="images.length < maxCount" class="weui-uploader__input-box">
                    <input @change="change" id="uploaderInput" class="weui-uploader__input " type="file"
                          multiple accept="image/*">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a class="weui-btn weui-btn_primary btn-put" style="margin: 20px " @click.prevent.once="put">发送</a>
      </div>
      <unlogin v-else> </unlogin>
    </div>
  </div>
</template>

```
重点部分在于
```
<ul class="weui-uploader__files" id="uploaderFiles">
  <li ref="files" class="weui-uploader__file" v-for="(image,index) in images" :key="index"
      :style="'backgroundImage:url(' + image +' )'"><span @click="deleteimg(index)" class="x">&times;</span></li>
</ul>
<div v-show="!this.$refs.files||this.$refs.files.length < maxCount" class="weui-uploader__input-box">
  <input @change="change" id="uploaderInput" class="weui-uploader__input" type="file"
         multiple accept="image/*">
</div>
```
通过` @change="change"`监听图片的上传，把图片转成base64后（后面会讲怎么转base64）将base64的地址加入到images数组，通过` v-for="(image,index) in images"`把要上传的图片在页面中显示出来，即达到了预览的效果

js部分
data部分
```
data() {
      return {
        content: '',//分享动态的文字内容
        maxSize: 10240000 / 2,//图片的最大大小
        maxCount: 8,//最大数量
        filesArr: [],//保存要上传图片的数组
        images: []//转成base64后的图片的数组
      }
    }
```
delete方法
```
deleteimg(index) {
        this.filesArr.splice(index, 1);
        this.images.splice(index, 1);
      }
```
change方法
```
change(e) {
        let files = e.target.files;
        // 如果没有选中文件，直接返回
        if (files.length === 0) {
          return;
        }
        if (this.images.length + files.length > this.maxCount) {
          Toast('最多只能上传' + this.maxCount + '张图片！');
          return;
        }
        let reader;
        let file;
        let images = this.images;
        for (let i = 0; i < files.length; i++) {
          file = files[i];
          this.filesArr.push(file);
          reader = new FileReader();
          if (file.size > self.maxSize) {
            Toast('图片太大，不允许上传！');
            continue;
          }
          reader.onload = (e) => {
            let img = new Image();
            img.onload = function () {
              let canvas = document.createElement('canvas');
              let ctx = canvas.getContext('2d');
              let w = img.width;
              let h = img.height;
              // 设置 canvas 的宽度和高度
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(img, 0, 0, w, h);
              let base64 = canvas.toDataURL('image/png');
              images.push(base64);
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
```
put方法把filesArr中保存的图片通过axios发送到后端,注意要设置headers信息
```
put() {
        Indicator.open('发布中...');
        let self = this;
        let content = this.content;
        let param = new FormData();
        param.append('content', content);
        param.append('username', this.userInfo._id);
        this.filesArr.forEach((file) => {
          param.append('file2', file);
        });
        self.axios.post('/upload/uploadFile', param, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(function (result) {
          console.log(result.data);
          self.$router.push({path: '/home'});
          Indicator.close();
          Toast(result.data.msg)
        })
      }
```

后端通过multer模块保存传输的图片，再把保存下来的图片发送到阿里云oss（这个可以根据自己的使用情况变化）
```
let filePath;
let fileName;

let Storage = multer.diskStorage({
    destination: function (req, file, cb) {//计算图片存放地址
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {//图片文件名
        fileName = Date.now() + '_' + parseInt(Math.random() * 1000000) + '.png';
        filePath = './public/img/' + fileName;
        cb(null, fileName)
    }
});
let upload = multer({storage: Storage}).any();//file2表示图片上传文件的key

router.post('/uploadFile', function (req, res, next) {
    upload(req, res, function (err) {
        let content = req.body.content || '';
        let username = req.body.username;
        let imgs = [];//要保存到数据库的图片地址数组
        if (err) {
            return res.end(err);
        }
        if (req.files.length === 0) {
            new Pyq({
                writer: username,
                content: content
            }).save().then((result) => {
                res.json({
                    result: result,
                    code: '0',
                    msg: '上传成功'
                });
            })
        }
        /*client.delete('public/img/1.png', function (err) {
            console.log(err)
        });*/
        let i = 0;
        req.files.forEach((item, index) => {
            let filePath = `./public/img/${item.filename}`;
            put(item.filename,filePath,(result)=>{
                imgs.push(result.url);
                i++;
                if (i === req.files.length) {
                //forEach循环是同步的，但上传图片是异步的，所以用一个i去标记图片是否全部上传成功
                //这时才把数据保存到数据库
                    new Pyq({
                        content: content,
                        writer: username,
                        pimg: imgs
                    }).save().then(() => {
                        res.json({
                            code: '0',
                            msg: '发布成功'
                        });
                    })
                }
            })
        })
    })
});
```
如果你对这个项目有兴趣，你可以去看看我的另一篇文章[VueSocial(仿微博、微信的聊天社交平台）](https://www.jianshu.com/p/8095f7b0d5a9)

完整在线demo地址 [VueSocial](http://47.107.66.252:3001/public/dist/#/home)（移动端最好使用浏览器打开，pc端按了f12后有个小问题，刷新一下就好,resize触发的问题，待改进）

[github地址](https://github.com/CBDxin/VueSocial)
如果觉得这篇文章对你有帮助或者觉得这个项目还不错，请留下你的star，谢谢。
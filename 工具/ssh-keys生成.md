SSH key为我们提供了一种与远程代码仓库通信的方法，但因为每次碰到新的环境又需要去进行重新的生成与配置，为了方便以后的使用，故在此记录SSH key生成的步骤

## 步骤
1. 检查是否已存在SSH key
2. 生成新的SSH key
3. 添加到远程仓库

### 1.检查是否已存在SSH key
通过

`
ls -al ~/.ssh
`

查看.ssh 下是否存在文件id_rsa.pub 或 id_dsa.pub，如果存在则直接进入第三步；

### 2.生成新的SSH key
在命令行中输入

`
ssh-keygen -t rsa -C "your_email@example.com"
`

默认会在相应路径下（/your_home_path）生成id_rsa和id_rsa.pub两个文件。

### 3.添加到远程仓库

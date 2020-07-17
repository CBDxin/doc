1. 克隆

命令行：
`
git clone 远程仓库地址
`

小乌龟：右键点击 Git clone，在弹出框中填写对应的远程仓库地址以及将要克隆到的路径

2. 拉取最新的代码

命令行：
`
git pull
`

小乌龟：右键点击 Git Pull

2. 拉取最新的代码

命令行：
`
git pull
`
小乌龟：右键点击 Git Pull

3. 从远端拉取最新的分支

命令行：
`
git fetch
`

小乌龟：右键点击 Git Fetch

4. 提交代码

命令行：

`
  git add 要提交的文件
`

`
  git commit message
`

小乌龟：右键点击 Git Commit ->“master”,填写message

5. 查看日志

命令行：

`
  git log
`

小乌龟：右键点击Git Show Log，可查看每次提交的各种信息

6. 推送代码到远程仓库

命令行：

`
 git push <远程主机名> <本地分支名>:<远程分支名>
`

小乌龟：右键点击Git Push，然后选择本地分支和远程分支

7. 创建新分支

命令行：

`
 git checkout -b branchName remoteName/branchName
`

小乌龟：右键-->TortoiseGit-->Create Branch，填写新分支名称，选择分支来源，并勾选是否切换到新的分支。

8. 切换分支

命令行：

`
 git checkout branchName
`

小乌龟：右键-->TortoiseGit-->Switch/Checkout，然后选择分支

9. 合并分支

命令行：

`
 git merge branchName
`

小乌龟：右键-->TortoiseGit-->Merge，选择被合并的分支

10. 版本回滚

小乌龟：查看日志->右键->Reset “master” to this…

11. 解决冲突

小乌龟：stash save(把自己的代码隐藏存起来) -> 重新pull -> stash pop(把存起来的隐藏的代码取回来 ) -> 代码文件会显示冲突 -> 右键选择edit conficts，解决后点击编辑页面的 mark as resolved ->  commit&push

Edit conficts后

出现界面，分为Theirs、Mine和Merged三部分，表示别人修改的内容、 我修改的内容和合并后的结果3部分。

合并一般分为4种情况：

保留我的修改,舍弃别人的修改。鼠标右键点击Mine框的相应行，点击“Use this text block”。

舍弃我的修改,保留别人的修改。鼠标右键点击Theirs框的相应行，点击“Use this text block”。

同时保留我的修改和别人的修改，并将我的修改 放在前面。鼠标右键点击Mine框的相应行，点击“Use text block from mine before theirs”。

同时保留我的修改和别人的修改，并将别人的修改放在前面。鼠标右键点击Mine框的相应行，点击“Use text block from theirs before mine”。

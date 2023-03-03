@echo off
echo 需要提交的文件
git status
set /p t2="提交信息："
# 更新package版本号
# npm version patch
git add .
git commit -m "%t2%"
git push
pause
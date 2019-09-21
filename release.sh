### 
# @Author: 李浩栋
 # @Begin: 2019-09-21 10:30:50
 # @Update: 2019-09-21 10:30:50
 # @Update log: 更新日志
 ###
#!usr/bin/env sh
set -e
echo "Enter release version:"
read VERSION
read -p "Releasing" $VERSION - are you sure? (y/n) -n 1 -r
echo # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$]]
then
  echo "Releasing" $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish
  npm publish
fi
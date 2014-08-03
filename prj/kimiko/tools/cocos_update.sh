
# 指定のcocosテンプレを最新のものとして、現在のプロジェクトにコピーする.

BASE=`echo $(cd $(dirname $0);pwd)`
source $BASE/_conf.sh

COCOS_PRJ_DIR=${PRJ_DIR}/cocos
COCOS_PRJ_TMPL_DIR=~/prj/cocos2d-x-rc1

rsync -av --delete ${COCOS_PRJ_TMPL_DIR}/frameworks/ ${COCOS_PRJ_DIR}/frameworks/



BASE=`echo $(cd $(dirname $0);pwd)`
source $BASE/_conf.sh

cd $BASE

start(){
  #ls -1 -R $TS_DIR/*.ts > watch_ts_list.txt
  find $TS_DIR | grep -E "\.ts$" > "$TEMP_DIR/watch_ts_list.txt"
  
	$NODE_JS_TSC --target ES5 --watch @"$TEMP_DIR/watch_ts_list.txt" --out $PRJ_DIR/public/javascripts/kimiko.js &
  echo $! > TSC.PID
}

stop(){
  if [ -f TSC.PID ]; then
    kill `cat TSC.PID`
    rm TSC.PID
  fi
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  *)
    echo "watch typescript {start|stop|restart}"
    ;;
esac


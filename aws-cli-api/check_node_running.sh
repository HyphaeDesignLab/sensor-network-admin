home_dir="$1";
if [ ! "$home_dir" ]; then
  echo "need home dir as first param";
  exit;
fi;

running_check="$(ps aux | grep 'node index.js' | grep -v 'grep')"
if [ "$running_check" ]; then
        echo 'running';
        echo $running_check;
else
        cd $home_dir;
        echo 'not running';
        if [ "$2" = 'restart' ]; then
                sudo node index.js .env &
        fi
fi;
home_dir="$1";
if [ ! "$home_dir" ]; then
  echo "need home dir as first param";
  exit;
fi;

if [ "$(ps aux | grep 'node index.js' | grep -v 'grep' | head -1)" ]; then
        echo 'running';
else
        cd $home_dir;
        echo 'not running';
        if [ "$2" = 'restart' ]; then
                sudo node index.js .env &
        fi
fi;
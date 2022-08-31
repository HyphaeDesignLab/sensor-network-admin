home_dir="$1";
echo "Start/Restart/Stop the AWS CLI API server"
if [ ! "$home_dir" ]; then
  echo "need home dir as first param";
  exit;
fi;

running_check="$(ps aux | grep 'node index.js' | grep -v 'grep')"
if [ "$running_check" ]; then
        echo 'running';
        echo $running_check;
        if [ "$2" = 'stop' ]; then
            for pid in $(ps aux | grep 'node index.js' | grep -v 'grep' | sed -E -e 's/[a-z]+[ \t]+([0-9]+).+/\1/'); do
                  echo "stopping process " $pid;
                  kill -KILL $pid;
            done;
        fi;
        if [ "$2" = 'restart' ]; then
                for pid in $(ps aux | grep 'node index.js' | grep -v 'grep' | sed -E -e 's/[a-z]+[ \t]+([0-9]+).+/\1/'); do
                  echo "stopping process " $pid;
                  kill -KILL $pid;
                done;
                echo "restarting process ";
                if [ "$3" = 'background' ]; then
                        sudo node index.js .env &
                else
                        sudo node index.js .env
                fi;
        fi;
else
        cd $home_dir;
        echo 'not running';
        if [ "$2" = 'restart' ]; then
                if [ "$3" = 'background' ]; then
                        sudo node index.js .env &
                else
                        sudo node index.js .env
                fi;
        fi
fi;
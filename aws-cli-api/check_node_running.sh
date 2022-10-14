function main() {
  home_dir="$1";
  cmd="$2";
  cmd2="$3";
  echo "Start/Restart/Stop the AWS CLI API server"
  if [ ! "$home_dir" ]; then
    echo "need home dir as first param";
  else
    echo $home_dir;
    cd $home_dir;
    runcheck $cmd $cmd2;
  fi;
}

function runcheck() {
  cmd="$1";
  cmd2="$2";
  running_check="$(ps aux | grep 'node index.js' | grep -v 'grep')"
  if [ "$running_check" ]; then
          echo 'running';
          echo "$running_check";
          if [ "$cmd" = 'stop' ]; then
              for pid in $(ps aux | grep 'node index.js' | grep -v 'grep' | sed -E -e 's/[a-z]+[ \t]+([0-9]+).+/\1/'); do
                    echo "stopping process " $pid;
                    sudo kill -KILL $pid;
              done;
          fi;

          if [ "$cmd" = 'restart' ]; then
                  for pid in $(ps aux | grep 'node index.js' | grep -v 'grep' | sed -E -e 's/[a-z]+[ \t]+([0-9]+).+/\1/'); do
                    echo "stopping process " $pid;
                    sudo kill -KILL $pid;
                    sleep 3
                  done;
                  echo "restarting process ";
                  if [ "$cmd2" = 'bg' ]; then
                    echo 'starting in background';
                    sudo node index.js .env &
                  else
                    echo 'starting in FORE-ground';
                    sudo node index.js .env
                  fi;
          fi;
  else

          echo 'not running';
          if [ "$cmd" = 'restart' ]; then
            echo 'restart'
                  if [ "$cmd2" = 'bg' ]; then
                          echo 'starting in background';
                          sudo node index.js .env &
                  else
                          echo 'starting in FORE-ground';
                          sudo node index.js .env
                  fi;
          fi
  fi;
}

main $1 $2 $3;
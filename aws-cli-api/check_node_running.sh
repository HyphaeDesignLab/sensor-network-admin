if [ "$(ps aux | grep 'node index.js' | grep -v 'grep' | head -1)" ]; then
        echo 'running';
else
        cd /home/ubuntu/aws_cli_api;
        echo 'not running';
        if [ "$1" = 'restart' ]; then
                sudo node index.js .env &
        fi
fi;
function sensors-api {
  cmd="$1";
  cmd2="$2"

  if [ "$cmd" = "git" ]; then
    if [ "$cmd2" = "init" ]; then
      echo 'Copy and paste these commands to init GITHUB'
      echo 'eval "$(ssh-agent -s)"'
      echo 'ssh-add ~/.ssh/sensor_install_dashboard_github_id_ed25519'
    elif [ "$cmd2" = "update" ]; then
      echo 'Run this if GITHUB permissions not right'
      echo 'aws-cli-api-ssh-github-init';
      echo
      cd ~/hyphae-geodashboard/
      git pull
      cd ~/aws_cli_api/
      cp ~/hyphae-geodashboard/aws-cli-api/*.* .
    else
      sensor-api-help
    fi
  elif [ "$cmd" = "start" ]; then
    if [ "$cmd2" = "bg" ]; then
      cd ~/aws_cli_api/
	    ./check_node_running.sh . restart bg
    elif [ ! "$cmd2" ]; then
      cd ~/aws_cli_api/
	    ./check_node_running.sh . restart
	  else
	    sensor-api-help;
    fi
  elif [ "$cmd" = "stop" ]; then
    cd ~/aws_cli_api/
    ./check_node_running.sh . stop
  elif [ "$cmd" = "status" ]; then
    cd ~/aws_cli_api/
    ./check_node_running.sh .
  else
    sensor-api-help;
  fi
}

echo "Available Commands: "
echo "    sensors-api"
echo "    sensors-api cmd1 cmd2 cmd3"
echo
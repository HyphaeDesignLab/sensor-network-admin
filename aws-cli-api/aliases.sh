function aws-cli-api-ssh-github-init {
	if [ ! "$(ps aux | grep 'ssh-agent' | grep -v grep)" ]; then
	  eval "$(ssh-agent -s)"
  fi;
	ssh-add ~/.ssh/sensor_install_dashboard_github_id_ed25519
}

function aws-cli-api-gitpull-and-update {
	cd ~/hyphae-geodashboard/
	ssh-github-init
	git pull
	cd ~/aws_cli_api/
	cp ~/hyphae-geodashboard/aws-cli-api/*.* .
}

function aws-cli-api-start-in-bg {
	cd ~/aws_cli_api/
	./check_node_running.sh . restart background
}

function aws-cli-api-start {
	cd ~/aws_cli_api/
	./check_node_running.sh . restart
}

function aws-cli-api-stop {
	cd ~/aws_cli_api/
	./check_node_running.sh . stop
}

function aws-cli-api-status {
	cd ~/aws_cli_api/
	./check_node_running.sh .
}

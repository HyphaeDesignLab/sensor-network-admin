clientEnv='';
if [ "$1" = 'prod' ]; then
  clientEnv='prod';
else
  clientEnv='dev';
fi;
echo "export default '$clientEnv';" > ./src/keys/env.js
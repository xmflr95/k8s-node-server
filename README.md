# k8s-node-server
k8s 테스트용 node server (k8s Test Node Server)  

## Starting Local
로컬에섯 테스트 할 경우 git clone 받아 사용
```sh
git clone https://github.com/xmflr95/k8s-node-server.git
# start cmd
npm run start
# Check Server
curl -XGET http://localhost:18000
# response : K8S Node Server 1
```

## Docker(Podman) Build
```sh
# -t : tag
docker build -t ${username}/k8s-node-server:${version} .
# example
docker build -t xmflr95/k8s-node-server:1.0 .
```

## Docker Run
```sh
docker run -d -p 18000:18000 --name k8s-node-server xmflr95/k8s-node-server:1.0
```

## Docker Hub Image Push
```sh
docker login
# Enter your name/password ...
docker push xmflr95/k8s-node-server:1.0
```

## K8S Create Secret
[K8S-Secret-Setting](https://kubernetes.io/ko/docs/tasks/configure-pod-container/pull-image-private-registry/)  
Example Docker Hub:  
```sh
# create secret "myhub"
# docker hub server : https://index.docker.io/v1/
kubectl create secret docker-registry myhub --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

# output yaml
kubectl get secret myhub --output=yaml

# base64 decode
kubectl get secret myhub --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
# example (result: docker_username:password)
echo "c3R...zE2" | base64 --decode
```

#### K8S setting
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-node-server
  labels:
    app: k8s-node-server
spec:
  selector:
    matchLabels:
      app: k8s-node-server
  replicas: 1
  template:
    metadata:
      labels:
        app: k8s-node-server
    spec:
      containers:
      - name: k8s-node-server
        image: xmflr95/k8s-node-server:1.0
        ports:
        - containerPort: 18000
          protocol: TCP
      imagePullSecrets:
      - name: myhub
```

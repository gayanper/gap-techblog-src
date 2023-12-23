# Instructions

## Preparation

Before running any scripts in this folder create two new namespaces called `es` and `esm` which will be used by all kubernetes
deployments that is found inside this folder.

```shell
kubectl create namespace es
```

```shell
kubectl create namespace esm
```

## Deploy the operator

To deploy the elastic operator into the kubernetes cluster run the script `deploy-operator.sh`

# Deploying elasticsearch

To deploy a elasticsearch cluster in the namespace `es` running the following commands in order inside `k8s/elasticsearch`

1. Install the PVs (Persistence Volume)
```shell
kubectl create -f ./es-pv.yaml
```

```shell
kubectl create -f ./esm-pv.yaml
```

2. Install the Elasticsearch
```shell
kubectl create -f ./eck-es.8.yaml
```

3. Install the Elasticsearch for Metrics
```shell
kubectl create -f ./eck-es.m.yaml
```

4. Install the Kibana for Metrics
```shell
kubectl create -f ./eck-kb.m.yaml
```

# Removing elasticsearch

To remove elasticsearch from the namespace run the following command

```shell
kubectl delete elastic --all -n es
```

```shell
kubectl delete elastic --all -n esm
```

To remove the data

```shell
kubectl delete persistentvolume elasticsearch-data
```
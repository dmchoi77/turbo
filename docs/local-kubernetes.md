# 로컬 Kubernetes PoC

이 문서는 `apps/web` Next.js 앱을 로컬 `kind` Kubernetes 클러스터에서 실행하고, 같은 매니페스트를 Argo CD로 동기화하는 방법을 설명한다.

## 구성

- 앱: `apps/web`
- Docker 이미지: `turbo-web:local`
- kind 클러스터: `turbo-local`
- 앱 namespace: `turbo-local`
- Argo CD namespace: `argocd`
- Kubernetes 매니페스트: `k8s/local/web.yaml`
- Argo CD Application: `k8s/argocd/web-application.yaml`

## 1. Next.js 빌드 확인

```bash
pnpm --filter web build
```

standalone 서버 파일이 생성되었는지 확인한다.

```bash
test -f apps/web/.next/standalone/apps/web/server.js
```

## 2. Docker 이미지 빌드

저장소 루트에서 실행한다.

```bash
docker build -f apps/web/Dockerfile -t turbo-web:local .
```

컨테이너 단독 실행을 확인한다.

```bash
docker run --rm -d --name turbo-web-local -p 3001:3000 turbo-web:local
curl -I http://localhost:3001
docker stop turbo-web-local
```

## 3. kind 클러스터 생성

```bash
kind create cluster --name turbo-local
```

이미 클러스터가 있으면 다음 명령으로 확인한다.

```bash
kind get clusters
```

## 4. 이미지를 kind에 로드

```bash
kind load docker-image turbo-web:local --name turbo-local
```

같은 태그로 이미지를 다시 빌드했다면 이미지를 다시 로드하고 Deployment를 재시작한다.

```bash
kind load docker-image turbo-web:local --name turbo-local
kubectl -n turbo-local rollout restart deployment/web
```

## 5. Kubernetes 매니페스트 적용

```bash
kubectl apply -f k8s/local/web.yaml
kubectl -n turbo-local rollout status deployment/web
```

Pod 상태를 확인한다.

```bash
kubectl -n turbo-local get pods
```

로그를 확인한다.

```bash
kubectl -n turbo-local logs deployment/web
```

## 6. 로컬 브라우저에서 확인

```bash
kubectl -n turbo-local port-forward service/web 3000:3000
```

다른 터미널에서 확인한다.

```bash
curl -I http://localhost:3000
```

브라우저에서 `http://localhost:3000`에 접속한다.

## 7. Argo CD 설치

Argo CD는 Git 저장소를 읽어서 Kubernetes 리소스를 동기화한다. 로컬 파일 시스템을 직접 읽는 것이 아니므로, `k8s/local`과 `k8s/argocd` 변경사항이 `origin/main`에 push되어 있어야 한다.

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd rollout status deployment/argocd-server
```

Argo CD Application을 적용한다.

```bash
kubectl apply -f k8s/argocd/web-application.yaml
kubectl -n argocd get applications
```

동기화된 앱 리소스를 확인한다.

```bash
kubectl -n turbo-local get deploy,svc,pod
```

## 8. Argo CD UI 접속

초기 admin 비밀번호를 확인한다.

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

UI를 port-forward한다.

```bash
kubectl -n argocd port-forward service/argocd-server 8080:443
```

브라우저에서 `https://localhost:8080`에 접속한다.

- username: `admin`
- password: 위 명령으로 확인한 값

## 9. 정리

앱만 삭제한다.

```bash
kubectl delete -f k8s/argocd/web-application.yaml
kubectl delete -f k8s/local/web.yaml
```

클러스터 전체를 삭제한다.

```bash
kind delete cluster --name turbo-local
```

## ECS에서 EKS로 넘어갈 때 볼 포인트

- ECS Task Definition은 Kubernetes `Deployment`와 `Pod` 스펙으로 옮겨간다.
- ECS Service는 Kubernetes `Deployment`와 `Service` 조합으로 나뉜다.
- public ALB 뒤의 내부 통신은 Kubernetes `Service` DNS로 표현한다.
- Argo CD를 쓰면 배포 명령은 `kubectl apply` 중심에서 Git commit과 sync 중심으로 이동한다.
- 로컬 kind에서는 ECR, IAM, ALB Controller, VPC CNI 같은 EKS 전용 요소를 완전히 재현하지 않는다.

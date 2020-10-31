import axios from 'axios'

export default ({ req }) => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
    headers: req.headers
  })
}
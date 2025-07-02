import routes from '../routes/routes.data'

export default function useNavRoutes() {
  return routes.filter((r) => r.label)
}

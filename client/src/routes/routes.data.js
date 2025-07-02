import About from '../pages/About'
import Contact from '../pages/Contact'
import Home from '../pages/Home'
import Projects from '../pages/Projects'
import ThemeGuide from '../static/ThemeGuide'

const routes = [
  { path: '/', component: Home, label: 'Home' },
  { path: '/about', component: About, label: 'About' },
  { path: '/projects', component: Projects, label: 'Projects' },
  { path: '/contact', component: Contact, label: 'Contact' },
  { path: '/themeguide', component: ThemeGuide, label: 'Theme Guide' },
]

export default routes

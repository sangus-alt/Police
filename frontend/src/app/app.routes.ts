import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Route par défaut - redirection vers dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Authentification
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Dashboard principal
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Gestion des effectifs
  {
    path: 'effectifs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/effectifs/effectifs.routes').then(m => m.effectifsRoutes)
  },

  // Gestion de carrière
  {
    path: 'carriere',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'agent_rh'] },
    loadChildren: () => import('./features/carriere/carriere.routes').then(m => m.carriereRoutes)
  },

  // Module congés
  {
    path: 'conges',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/conges/conges.routes').then(m => m.congesRoutes)
  },

  // Module retraite
  {
    path: 'retraite',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'agent_rh'] },
    loadChildren: () => import('./features/retraite/retraite.routes').then(m => m.retraiteRoutes)
  },

  // Registres des agents
  {
    path: 'registres',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/registres/registres.routes').then(m => m.registresRoutes)
  },

  // Planification des gardes
  {
    path: 'gardes',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/gardes/gardes.routes').then(m => m.gardesRoutes)
  },

  // Communication interne
  {
    path: 'communication',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/communication/communication.routes').then(m => m.communicationRoutes)
  },

  // Gestion des interventions
  {
    path: 'interventions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/interventions/interventions.routes').then(m => m.interventionsRoutes)
  },

  // Gestion des grades
  {
    path: 'grades',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'agent_rh'] },
    loadChildren: () => import('./features/grades/grades.routes').then(m => m.gradesRoutes)
  },

  // Rapports et PV
  {
    path: 'rapports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/rapports/rapports.routes').then(m => m.rapportsRoutes)
  },

  // Objets trouvés
  {
    path: 'objets-trouves',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/objets-trouves/objets-trouves.routes').then(m => m.objetsTrouvesRoutes)
  },

  // Accueil et visites
  {
    path: 'accueil',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/accueil/accueil.routes').then(m => m.accueilRoutes)
  },

  // Verbalisations électroniques
  {
    path: 'verbalisations',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/verbalisations/verbalisations.routes').then(m => m.verbalisationsRoutes)
  },

  // Fiches de renseignement
  {
    path: 'renseignements',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'enqueteur', 'commissaire'] },
    loadChildren: () => import('./features/renseignements/renseignements.routes').then(m => m.renseignementsRoutes)
  },

  // Reconnaissance moyens roulants
  {
    path: 'vehicules',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/vehicules/vehicules.routes').then(m => m.vehiculesRoutes)
  },

  // Statistiques et SIG
  {
    path: 'statistiques',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/statistiques/statistiques.routes').then(m => m.statistiquesRoutes)
  },

  // Carte Gabon
  {
    path: 'carte',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/carte/carte.component').then(m => m.CarteComponent)
  },

  // Paramètres système
  {
    path: 'parametres',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./features/parametres/parametres.routes').then(m => m.parametresRoutes)
  },

  // Profil utilisateur
  {
    path: 'profil',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profil/profil.component').then(m => m.ProfilComponent)
  },

  // Aide et documentation
  {
    path: 'aide',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/aide/aide.component').then(m => m.AideComponent)
  },

  // Page 404
  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Page 403 - Accès refusé
  {
    path: '403',
    loadComponent: () => import('./shared/components/forbidden/forbidden.component').then(m => m.ForbiddenComponent)
  },

  // Route catch-all - doit être la dernière
  {
    path: '**',
    redirectTo: '/404'
  }
];
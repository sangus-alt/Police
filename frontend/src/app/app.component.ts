import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { NotificationService } from './core/services/notification.service';

interface AppState {
  isLoading: boolean;
  isMobile: boolean;
  sidebarOpen: boolean;
  user: any;
  notifications: any[];
  theme: 'light' | 'dark';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container" [class.mobile]="state.isMobile" [class.sidebar-open]="state.sidebarOpen">
      
      <!-- Header -->
      <app-header 
        [isMobile]="state.isMobile"
        [user]="state.user"
        [notifications]="state.notifications"
        (toggleSidebar)="toggleSidebar()"
        (logout)="logout()">
      </app-header>

      <!-- Sidebar -->
      <app-sidebar 
        [isOpen]="state.sidebarOpen"
        [isMobile]="state.isMobile"
        [user]="state.user"
        (closeSidebar)="closeSidebar()">
      </app-sidebar>

      <!-- Overlay mobile -->
      <div 
        class="sidebar-overlay"
        [class.active]="state.sidebarOpen && state.isMobile"
        (click)="closeSidebar()">
      </div>

      <!-- Contenu principal -->
      <main class="main-content" [class.shifted]="state.sidebarOpen && !state.isMobile">
        
        <!-- Loading global -->
        <div class="loading-overlay" *ngIf="state.isLoading">
          <div class="spinner-container">
            <div class="spinner"></div>
            <p>Chargement en cours...</p>
          </div>
        </div>

        <!-- Router outlet -->
        <router-outlet></router-outlet>
        
      </main>

      <!-- Footer -->
      <app-footer 
        [isMobile]="state.isMobile"
        class="footer">
      </app-footer>

      <!-- PWA Update Banner -->
      <div class="pwa-update-banner" *ngIf="updateAvailable" [class.mobile]="state.isMobile">
        <div class="update-content">
          <i class="material-icons">system_update</i>
          <span>Nouvelle version disponible !</span>
          <button class="btn btn-primary btn-sm" (click)="updateApp()">
            Mettre à jour
          </button>
          <button class="btn btn-outline btn-sm" (click)="dismissUpdate()">
            Plus tard
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
    }

    /* Header fixe */
    app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-fixed);
      transition: left 0.3s ease;
    }

    /* Sidebar */
    app-sidebar {
      position: fixed;
      top: 64px; /* Hauteur header */
      left: 0;
      bottom: 0;
      z-index: var(--z-fixed);
      width: 280px;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .sidebar-open app-sidebar {
      transform: translateX(0);
    }

    /* Overlay mobile */
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: var(--z-modal-backdrop);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Contenu principal */
    .main-content {
      flex: 1;
      margin-top: 64px; /* Hauteur header */
      padding: var(--spacing-md);
      transition: margin-left 0.3s ease;
      min-height: calc(100vh - 64px - 60px); /* 100vh - header - footer */
    }

    .main-content.shifted {
      margin-left: 280px; /* Largeur sidebar */
    }

    /* Footer */
    .footer {
      margin-top: auto;
    }

    /* Loading overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: var(--z-modal);
    }

    .spinner-container {
      text-align: center;
      color: var(--primary-color);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--grey-300);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--spacing-md);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* PWA Update Banner */
    .pwa-update-banner {
      position: fixed;
      bottom: var(--spacing-md);
      right: var(--spacing-md);
      background: var(--primary-color);
      color: white;
      padding: var(--spacing-md);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-toast);
      max-width: 400px;
      animation: slideInRight 0.3s ease;
    }

    .pwa-update-banner.mobile {
      bottom: 0;
      left: 0;
      right: 0;
      max-width: none;
      border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    }

    .update-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .update-content i {
      font-size: 1.5rem;
    }

    .update-content span {
      flex: 1;
      min-width: 150px;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .app-container.mobile .main-content.shifted {
        margin-left: 0; /* Pas de décalage sur mobile */
      }

      .app-container.mobile app-sidebar {
        width: 100%;
        max-width: 320px;
      }

      .main-content {
        padding: var(--spacing-sm);
      }
    }

    /* Mode tablette */
    @media (min-width: 769px) and (max-width: 1024px) {
      app-sidebar {
        width: 240px;
      }

      .main-content.shifted {
        margin-left: 240px;
      }
    }

    /* Très petits écrans */
    @media (max-width: 480px) {
      .main-content {
        padding: var(--spacing-xs);
      }

      .pwa-update-banner .update-content {
        flex-direction: column;
        text-align: center;
      }
    }

    /* Mode paysage mobile */
    @media (max-height: 500px) and (orientation: landscape) {
      .main-content {
        margin-top: 56px; /* Header plus petit en paysage */
      }
    }

    /* Print styles */
    @media print {
      app-header,
      app-sidebar,
      .sidebar-overlay,
      .pwa-update-banner,
      .loading-overlay {
        display: none !important;
      }

      .main-content {
        margin: 0 !important;
        padding: 0 !important;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  
  // Services injectés
  private swUpdate = inject(SwUpdate);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private notificationService = inject(NotificationService);

  // État de l'application
  state: AppState = {
    isLoading: false,
    isMobile: false,
    sidebarOpen: false,
    user: null,
    notifications: [],
    theme: 'light'
  };

  updateAvailable = false;

  ngOnInit() {
    this.initializeApp();
    this.checkMobile();
    this.setupPWA();
    this.subscribeToServices();
  }

  private initializeApp() {
    // Initialisation de l'application
    console.log('🚔 Police Main Courante Gabon - Démarrage');
    
    // Masquer le loader initial
    setTimeout(() => {
      const loader = document.querySelector('.initial-loader');
      if (loader) {
        loader.remove();
      }
    }, 1000);
  }

  private checkMobile() {
    this.state.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobile();
    
    // Fermer sidebar automatiquement si on passe en desktop
    if (!this.state.isMobile && this.state.sidebarOpen) {
      this.state.sidebarOpen = false;
    }
  }

  private setupPWA() {
    if (this.swUpdate.isEnabled) {
      // Vérifier les mises à jour
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable = true;
        }
      });

      // Vérifier périodiquement
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 30000); // Toutes les 30 secondes
    }
  }

  private subscribeToServices() {
    // Loading state
    this.loadingService.loading$.subscribe(
      loading => this.state.isLoading = loading
    );

    // Auth state
    this.authService.currentUser$.subscribe(
      user => this.state.user = user
    );

    // Theme
    this.themeService.currentTheme$.subscribe(
      theme => this.state.theme = theme
    );

    // Notifications
    this.notificationService.notifications$.subscribe(
      notifications => this.state.notifications = notifications
    );
  }

  // Actions UI
  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
  }

  closeSidebar() {
    this.state.sidebarOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeSidebar();
  }

  // PWA Actions
  updateApp() {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload();
    });
  }

  dismissUpdate() {
    this.updateAvailable = false;
  }

  // Gestion tactile mobile
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    // Gérer les gestes de swipe pour ouvrir/fermer sidebar
    if (this.state.isMobile) {
      const touch = event.touches[0];
      const startX = touch.clientX;
      
      // Swipe depuis le bord gauche pour ouvrir
      if (startX < 20 && !this.state.sidebarOpen) {
        this.toggleSidebar();
      }
    }
  }

  // Gestion erreurs
  @HostListener('window:error', ['$event'])
  onError(event: ErrorEvent) {
    console.error('Erreur application:', event.error);
    this.notificationService.showError(
      'Une erreur inattendue s\'est produite. Veuillez rafraîchir la page.'
    );
  }
}
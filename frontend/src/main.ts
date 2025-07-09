import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';

// Configuration des providers
const providers = [
  importProvidersFrom(
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      enableTracing: !environment.production,
      scrollPositionRestoration: 'top'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  )
];

// Bootstrap de l'application
bootstrapApplication(AppComponent, {
  providers
}).catch(err => {
  console.error('Erreur démarrage application:', err);
  
  // Affichage erreur pour mobile
  if (typeof window !== 'undefined') {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #f44336;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        text-align: center;
        z-index: 10000;
      ">
        <h2>Erreur de démarrage</h2>
        <p>L'application n'a pas pu démarrer correctement.</p>
        <p>Veuillez rafraîchir la page ou contacter l'assistance.</p>
        <button onclick="window.location.reload()" style="
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: white;
          color: #f44336;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Rafraîchir
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
});

// Gestion erreurs globales pour mobile
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
});